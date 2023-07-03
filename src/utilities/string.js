const gateways = ['https://cloudflare-ipfs.com', 'https://ipfs.io'];
/**
 * Given a URI that may be ipfs, ipns, http, or https protocol, return the fetch-able http(s) URLs for the same content
 * @param uri to convert to fetch-able http(s) URLs
 */
export function toHTTPs(uri) {
	const protocol = uri.split('://')[0].toLowerCase();
	const path = uri.substring(protocol.length + 3);
	switch (protocol) {
		case 'https':
			return [uri];
		case 'http':
			return [`https://${path}`, uri];
		case 'ipfs':
		case 'ipns': {
			return gateways.map(gateway => `${gateway}/${protocol}/${path}/`);
		}
		default:
			return [];
	}
}
export function normalize(uri) {
	return uri.toLowerCase();
}
//# sourceMappingURL=string.js.map
