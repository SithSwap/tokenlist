import { version } from "../package.json";
import mainnet from "./tokens/mainnet.json";
import goerli from "./tokens/goerli.json";
import { getChecksumAddress } from "starknet";

export function buildList() {
  const parsed = version.split(".");
  return {
    name: "SithSwap Default List",
    timestamp: new Date().toISOString(),
    version: {
      major: +parsed[0],
      minor: +parsed[1],
      patch: +parsed[2]
    },
    tags: {},
    logoURI: "ipfs://QmWwb4rNQHtD63v8txYUKoqv38ULFA8VThqCg7HDwpJ3NK",
    keywords: ["sithswap", "default"],
    tokens: [...mainnet, ...goerli]
      // parse address
      .map(token => ({
        ...token,
        address: getChecksumAddress(token.address)
      }))
      // sort them by symbol for easy readability
      .sort((t1, t2) => {
        if (t1.chainId === t2.chainId) {
          return t1.symbol.toLowerCase() < t2.symbol.toLowerCase() ? -1 : 1;
        }
        return t1.chainId < t2.chainId ? -1 : 1;
      })
  };
}
