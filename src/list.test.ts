import { toHTTPs } from '$src/utilities/string.js';
import { ChainID } from 'ministark/network';
import { download, parse } from '$src/list.js';

const originalFetch = globalThis.fetch;

describe.concurrent('list', () => {
	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	test('work on good uri', async () => {
		globalThis.fetch = vi.fn(async () => {
			const body = JSON.stringify({
				name: 'SithSwap Mock Token List',
				timestamp: '2023-07-02T09:28:24.253Z',
				version: { major: 1, minor: 0, patch: 0 },
				tags: {},
				logoURI: 'ipfs://QmWwb4rNQHtD63v8txYUKoqv38ULFA8VThqCg7HDwpJ3NK',
				keywords: ['sithswap', 'default', 'test'],
				tokens: [
					{
						chainId: '0x534e5f474f45524c49',
						name: 'MockToken 1',
						symbol: 'MOCK1',
						decimals: 18,
						address:
							'0x030B787c358eb75203Ba2C0819412C87787C5f4aaf625d742A4A5A25fF4fDF3C'
					}
				]
			});
			return new Response(body, { status: 200 });
		});
		const uri = 'https://sithswap.xyz/tokens.json';
		const urls = toHTTPs(uri);
		const downloaded = await download(urls);
		expect(downloaded.name).toBe('SithSwap Mock Token List');
	});

	test('Token Map', async () => {
		globalThis.fetch = vi.fn(async () => {
			const body = JSON.stringify({
				name: 'SithSwap Mock Token List',
				timestamp: '2023-07-02T09:28:24.253Z',
				version: { major: 1, minor: 0, patch: 0 },
				tags: {},
				logoURI: 'ipfs://QmWwb4rNQHtD63v8txYUKoqv38ULFA8VThqCg7HDwpJ3NK',
				keywords: ['sithswap', 'default', 'test'],
				tokens: [
					{
						chainId: '0x534e5f474f45524c49',
						name: 'MockToken 1',
						symbol: 'MOCK1',
						decimals: 18,
						address:
							'0x030B787c358eb75203Ba2C0819412C87787C5f4aaf625d742A4A5A25fF4fDF3C'
					}
				]
			});
			return new Response(body, { status: 200 });
		});
		const uris = ['https://sithswap.xyz/tokens.json', 'ipns://tokens.sithswap.xyz'];

		const lists = await Promise.all(uris.map(toHTTPs).map(download));
		lists.map(list => parse(list, [ChainID.Goerli]));

		for (const { tokens } of lists) {
			expect(tokens.length).toEqual(1);
			expect(tokens[0].name).toEqual('MockToken 1');
		}
	});

	test('equal', async () => {
		globalThis.fetch = vi.fn(async (request: RequestInfo | URL) => {
			const url = new URL(request.toString());
			const body = JSON.stringify({
				name: url.hostname.replace('.', '').replace('-', ''),
				timestamp: '2023-07-02T09:28:24.253Z',
				version: { major: 1, minor: 0, patch: 0 },
				tags: {},
				logoURI: 'ipfs://QmWwb4rNQHtD63v8txYUKoqv38ULFA8VThqCg7HDwpJ3NK',
				keywords: ['sithswap', 'default', 'test'],
				tokens: [
					{
						chainId: '0x534e5f474f45524c49',
						name: 'MockToken 1',
						symbol: 'MOCK1',
						decimals: 18,
						address:
							'0x030B787c358eb75203Ba2C0819412C87787C5f4aaf625d742A4A5A25fF4fDF3C'
					}
				]
			});
			return new Response(body, { status: 200 });
		});

		const uris = ['https://sithswap.xyz/tokens.json', 'ipns://tokens.sithswap.xyz'];

		const lists = await Promise.all(uris.map(toHTTPs).map(download));

		const possibleNames = ['cloudflareipfscom', 'sithswapxyz'];

		for (const { name } of lists) {
			expect(possibleNames.includes(name as string)).toBe(true);
		}
	});
});
