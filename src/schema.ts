import { schema as base } from '@uniswap/token-lists';

type BaseType = typeof base;

export type Schema = Omit<BaseType, 'definitions'> & {
	definitions: Omit<BaseType['definitions'], 'TokenInfo'> & {
		TokenInfo: Omit<BaseType['definitions']['TokenInfo'], 'properties'> & {
			properties: Omit<BaseType['definitions']['TokenInfo']['properties'], 'chainId'> & {
				chainId: {
					type: string;
					description: string;
					examples: string[];
				};
			};
		};
	};
};

const schema = structuredClone(base) as unknown as Schema;

schema.definitions.TokenInfo.properties.chainId = {
	type: 'string',
	description: 'The chain ID of the Starknet network where this token is deployed',
	examples: ['0x534e5f4d41494e']
};

schema.definitions.TokenInfo.properties.address.pattern = '^0x[a-fA-F0-9]{40,}$';
schema.$id = 'https://sithswap.xyz/tokenlist.schema.json';
schema.title = 'SithSwap Token List';
schema.description = 'Schema for token lists compatible with the official SithSwap interface';

export default schema;
