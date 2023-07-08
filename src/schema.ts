import type { HexString } from '$src/types.js';
import type { Version } from '$src/utilities/version.js';

import { ChainID } from 'ministark/network';

export type TokenInfo = Readonly<{
	chainId: ChainID;
	address: HexString;
	name: string;
	decimals: number;
	symbol: string;
	logoURI?: string;
	tags?: string[];
}>;

export type Tags = Readonly<Record<string, Readonly<{ name: string; description: string }>>>;

export type TokenList = Readonly<{
	name: string;
	timestamp: string;
	version: Version;
	tokens: TokenInfo[];
	keywords?: string[];
	tags?: Tags;
	logoURI?: string;
}>;
