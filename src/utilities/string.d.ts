/**
 * Given a URI that may be ipfs, ipns, http, or https protocol, return the fetch-able http(s) URLs for the same content
 * @param uri to convert to fetch-able http(s) URLs
 */
export declare function toHTTPs(uri: string): string[];
export declare function normalize(uri: string): string;
