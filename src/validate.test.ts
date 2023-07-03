import { version as VERSION } from '$src/../package.json';

import DefaultList from '$src/../dist/sithswap.tokenlist.json';
import MockList from '$src/../dist/mock.tokenlist.json';

import { checksum } from 'ministark/address';

import isTokenList from './validate.js';

const Lists = [DefaultList, MockList];

describe('Validate Generated List', () => {
	it('validates', () => {
		for (const list of Lists) {
			expect(isTokenList(list)).toEqual(true);
		}
	});
	it('contains no duplicate addresses', () => {
		for (const { tokens } of Lists) {
			const map = new Map();
			for (const token of tokens) {
				const key = `${token.chainId}:${token.address}`;
				expect(map.has(key)).toEqual(false);
				map.set(key, true);
			}
		}
	});

	it('contains no duplicate symbols', () => {
		for (const { tokens } of Lists) {
			const map = new Map();
			for (const token of tokens) {
				const key = `${token.chainId}:${token.symbol.toLowerCase()}`;
				expect(map.has(key)).toEqual(false);
				map.set(key, true);
			}
		}
	});

	it('contains no duplicate names', () => {
		for (const { tokens } of Lists) {
			const map = new Map();
			for (const token of tokens) {
				const key = `${token.chainId}:${token.name.toLowerCase()}`;
				expect(map.has(key)).toEqual(false);
				map.set(key, true);
			}
		}
	});

	it('all addresses are valid and checksummed', () => {
		for (const { tokens } of Lists) {
			for (const token of tokens) {
				expect(checksum(token.address)).toEqual(token.address);
			}
		}
	});

	it('version matches package.json', () => {
		expect(VERSION).toMatch(/^\d+\.\d+\.\d+$/);
		for (const { version } of Lists) {
			const current = `${version.major}.${version.minor}.${version.patch}`;
			expect(current).toEqual(VERSION);
		}
	});
});
