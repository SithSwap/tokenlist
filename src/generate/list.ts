import type { ChainID } from 'ministark/network';
import type { Version } from '$src/utilities/version.js';

import fs from 'fs/promises';
import path from 'path';
import fg from 'fast-glob';
import { checksum } from 'ministark/address';

type SourceToken = {
	name: string;
	symbol: string;
	decimals: number;
	address: Partial<Record<ChainID, string>>;
	logoURI?: string;
	tags?: string[];
};

type OutputToken = {
	name: string;
	symbol: string;
	decimals: number;
	address: string;
	chainId: ChainID;
	logoURI?: string;
	tags?: string[];
};

async function toToken(file: string) {
	const token: SourceToken = await fs.readFile(file, 'utf-8').then(JSON.parse);

	const output = new Array<OutputToken>();
	const chains: ChainID[] = ['0x534e5f474f45524c49', '0x534e5f4d41494e'];
	for (const chainId of chains) {
		const address = token.address[chainId];
		if (!address) continue;
		output.push({ chainId, ...token, address: checksum(address) });
	}
	return output;
}

type ListInfo = {
	name: { list: string; file?: string };
	tags?: Record<string, { name: string; description: string }>;
	logoURI?: string;
	keywords?: string[];
};

async function generate(from: string, to: string, version: Version, folder: string) {
	const source = path.join(from, folder);

	const infoPath = path.join(source, 'list.info.json');

	const info: ListInfo = await fs.readFile(infoPath, 'utf-8').then(JSON.parse);

	if (!info) return;

	const paths = await fg([`${source}/*.json`, `!${infoPath}`]);

	const tokens = await Promise.all(paths.map(toToken));

	const file = path.join(to, `${info.name.file ?? folder}.tokenlist.json`);

	const content = {
		name: info.name.list,
		timestamp: new Date().toISOString(),
		version,
		tags: info.tags,
		logoURI: info.logoURI,
		keywords: info.keywords,
		tokens: tokens.flat().sort((t1, t2) => {
			if (t1.chainId === t2.chainId)
				return t1.symbol.toLowerCase() < t2.symbol.toLowerCase() ? -1 : 1;
			return t1.chainId < t2.chainId ? -1 : 1;
		})
	};

	await fs.writeFile(file, JSON.stringify(content, null, 2));
}

export default async function (from: string, to: string, version: Version) {
	await fs.mkdir(to, { recursive: true });
	const paths = await fs.readdir(from, { withFileTypes: true });
	const tasks = new Array<Promise<void>>();
	for (const path of paths) {
		if (path.isDirectory()) tasks.push(generate(from, to, version, path.name));
	}
	await Promise.all(tasks);
}
