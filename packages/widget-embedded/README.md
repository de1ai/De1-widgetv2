# De¹ Exchange Widget NFT Checkout

The demo of the De¹ Exchange Widget NFT Checkout based on the OpenSea API.

### Environment

Create a local `.env.local` from `.env.example` and fill in the values below:

```env
VITE_WALLET_CONNECT=your_walletconnect_project_id
VITE_OPENSEA_API_KEY=your_opensea_api_key
VITE_RHEA_ONE_CLICK_JWT=your_rhea_one_click_jwt
VITE_RHEA_ONE_CLICK_TOKEN=your_rhea_one_click_token
VITE_RHEA_ONE_CLICK_API_BASE=https://open-api.de1.exchange/1click
VITE_RHEA_BITGET_API_KEY=your_bitget_api_key
VITE_RHEA_BITGET_API_SECRET=your_bitget_api_secret
VITE_RHEA_BITGET_API_BASE=https://bopenapi.bgwapi.io
```

### How to run?

```
pnpm dev
```

### How to test?

1. Find an NFT on the [OpenSea](https://opensea.io/). Please make sure it has an active listing and the test wallet has enough tokens to buy it. While we will be able to pay with any token in the process, the OpenSea SDK checks for the token in which the NFT is listed to generate transaction data.
2. Let's say we found this NFT https://opensea.io/assets/base/0x9e81df5258908dbeef4f841d0ab3816b10850426/2578
3. We need to replace the `opensea.io/assets` part with `localhost:3000` or `widget-v2.de1.exchange`, depending on the testing environment, so the final URL should look like this
http://localhost:3000/base/0x9e81df5258908dbeef4f841d0ab3816b10850426/2578 or this https://widget-v2.de1.exchange/base/0x9e81df5258908dbeef4f841d0ab3816b10850426/2578
4. Open the URL and make sure the test wallet is switched to the chain the NFT is on so OpenSea SDK can generate transaction data.
5. Select any token on any chain and pay for NFT.

### Questions?

Please don't hesitate to open an issue or contact us if you have any questions.
