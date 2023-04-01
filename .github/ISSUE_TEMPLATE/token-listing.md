---
name: Token listing
about: Issue template to add new tokens
title: 'Add {TOKEN_SYMBOL}: {TOKEN_NAME}'
labels: ''
assignees: 0xSidius

---

Please fill the token json data according to the schema below:
```json
        {
            "chainId": "0x534e5f4d41494e",  // required, use SN_MAIN only
            "address": "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8", // required
            "name": "USD Coin", // required
            "symbol": "USDC", // required
            "decimals": 6, // required
            "logoURI": "ipfs://", // optional, IPFS or other URL
            "tags": ["stablecoin"] // optional
        }
```
