import type { TokenList } from '@uniswap/token-lists';
import type { ChainID } from 'ministark';

import { getVersionUpgrade, minVersionBump, VersionUpgrade } from '@uniswap/token-lists';

import { normalize } from 'ministark/address';

import isTokenList from './validate.js';
import { toHTTPs } from './utilities/string.js';

export async function download(urls: string[]) {
	const controller = new AbortController();
	const tokenlist = await Promise.any(
		urls.map(async url => {
			try {
				const response = await fetch(url, { signal: controller.signal });
				const content = await response.json();
				if (isTokenList(content)) return content as unknown as TokenList;
				throw new Error(`Token list failed validation`);
			} catch (e) {
				console.log(e);
				throw new Error(`Failed to get list at url ${url}`);
			}
		})
	);
	controller.abort();
	return tokenlist;
}

export function isOutdated(current: TokenList, latest: TokenList) {
	if (!current) return true;
	const bump = getVersionUpgrade(current.version, latest.version);
	switch (bump) {
		case VersionUpgrade.NONE:
			return false;
		case VersionUpgrade.PATCH:
		case VersionUpgrade.MINOR:
			return bump > minVersionBump(current.tokens, latest.tokens);
		case VersionUpgrade.MAJOR:
			return true;
	}
}

export type Token = {
	address: HexString;
	name: string;
	symbol: string;
	decimals: number;
	logo: Arrayable<string>;
};

export type TokenMap = Map<HexString, Token>;

export function parse(tokenlist: TokenList, chains?: readonly ChainID[]) {
	const tokens = {} as Record<ChainID, TokenMap>;
	for (const token of tokenlist.tokens) {
		const chain = token.chainId as unknown as ChainID;
		if (chains && !chains.includes(chain)) continue;
		const address = normalize(token.address);

		if (!tokens[chain]) tokens[chain] = new Map() as TokenMap;
		if (tokens[chain].has(address)) continue;

		tokens[chain].set(address, {
			address,
			name: token.name,
			decimals: token.decimals,
			symbol: token.symbol,
			logo: token.logoURI ? toHTTPs(token.logoURI) : []
		});
	}

	return {
		tokens: tokens,
		name: tokenlist.name,
		logo: tokenlist.logoURI ? toHTTPs(tokenlist.logoURI) : [],
		version: `${tokenlist.version.major}.${tokenlist.version.minor}.${tokenlist.version.patch}`
	} as List;
}

export function toMap(...tokens: Token[]) {
	const tokenmap = new Map() as TokenMap;
	for (const token of tokens) {
		if (tokenmap.has(token.address)) continue;
		tokenmap.set(token.address, token);
	}
	return tokenmap;
}

export function match({ address, name, symbol }: Token, query: string) {
	return (
		address.includes(query) ||
		name.toLowerCase().includes(query) ||
		symbol.toLowerCase().includes(query)
	);
}

export function find(tokens: TokenMap, query: string) {
	const found = new Map() as TokenMap;
	if (!tokens) return found;

	query = query.toLowerCase();
	for (const [address, token] of tokens) {
		if (match(token, query)) found.set(address, token);
	}
	return found;
}

export function combine(...tokenmaps: TokenMap[]) {
	const combined = new Map() as TokenMap;
	for (const tokenmap of tokenmaps) {
		if (!tokenmap) continue;
		for (const [address, token] of tokenmap) {
			if (combined.has(address)) continue;
			combined.set(address, token);
		}
	}
	return combined;
}

export type List = {
	name: string;
	logo: string[];
	tokens: Record<ChainID, TokenMap>;
	version: `${number}.${number}.${number}`;
};

export type ListMap = Map<HexString, List>;
