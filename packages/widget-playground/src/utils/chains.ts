// Only keep EVM chains, structure: name, chainId, defaultToken (including symbol and address)
export interface ChainInfo {
  name: string;
  chainId: number;
  defaultToken: {
    in: { symbol: string; address: string };
    out: { symbol: string; address: string };
  };
}

export const getChains = (): ChainInfo[] => [
  {
    name: "Ethereum",
    chainId: 1,
    defaultToken: {
      in: { symbol: "ETH", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "USDT", address: "0xdac17f958d2ee523a2206206994597c13d831ec7" },
    },
  },
  {
    name: "BNB Chain",
    chainId: 56,
    defaultToken: {
      in: { symbol: "BNB", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "USDT", address: "0x55d398326f99059ff775485246999027b3197955" },
    },
  },
  {
    name: "Solana",
    chainId: 1151111081099710,
    defaultToken: {
      in: { symbol: "SOL", address: "So11111111111111111111111111111111111111112" },
      out: { symbol: "USDT", address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB" },
    },
  },
  {
    name: "Arbitrum",
    chainId: 42161,
    defaultToken: {
      in: { symbol: "ETH", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "USDC", address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831" },
    },
  },
  {
    name: "Optimism",
    chainId: 10,
    defaultToken: {
      in: { symbol: "ETH", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "USDT", address: "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58" },
    },
  },
  {
    name: "zkSync Era",
    chainId: 324,
    defaultToken: {
      in: { symbol: "ETH", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "USDC", address: "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4" },
    },
  },
  {
    name: "Polygon",
    chainId: 137,
    defaultToken: {
      in: { symbol: "MATIC", address: "0x0000000000000000000000000000000000001010" },
      out: { symbol: "USDT", address: "0xc2132D05D31c914a87C6611C10748AaCbA5aA5c" },
    },
  },
  {
    name: "Avalanche",
    chainId: 43114,
    defaultToken: {
      in: { symbol: "AVAX", address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7" },
      out: { symbol: "USDT.e", address: "0xc7198437980c041c805A1EDcbA50c1Ce5db95118" },
    },
  },
  {
    name: "Fantom",
    chainId: 250,
    defaultToken: {
      in: { symbol: "FTM", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "USDC_Multi", address: "0x04068da6c83afcfa0e13ba15a6696662335d5b75" },
    },
  },
  {
    name: "Sonic",
    chainId: 146,
    defaultToken: {
      in: { symbol: "S", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "USDC.e", address: "0x7e7e1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c" },
    },
  },
  {
    name: "Berachain",
    chainId: 80094,
    defaultToken: {
      in: { symbol: "BERA", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "USDT0", address: "0x779ded0c9e1022225f8e0630b35a9b54be713736" },
    },
  },
  {
    name: "Base",
    chainId: 8453,
    defaultToken: {
      in: { symbol: "ETH", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "USDC", address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913" },
    },
  },
  {
    name: "Linea",
    chainId: 59144,
    defaultToken: {
      in: { symbol: "ETH", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "USDC", address: "0x176211869ca2b568f2a7d4ee941e073a821ee1ff" },
    },
  },
  {
    name: "Scroll",
    chainId: 534352,
    defaultToken: {
      in: { symbol: "ETH", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "USDC", address: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4" },
    },
  },
  {
    name: "Blast",
    chainId: 81457,
    defaultToken: {
      in: { symbol: "ETH", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "USDB", address: "0x4300000000000000000000000000000000000003" },
    },
  },
  {
    name: "Mode",
    chainId: 34443,
    defaultToken: {
      in: { symbol: "ETH", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "USDC", address: "0xd988097fb8612cc24eeC14542bC03424c656005f" },
    },
  },
  {
    name: "Mantle",
    chainId: 5000,
    defaultToken: {
      in: { symbol: "MNT", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "USDT", address: "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE" },
    },
  },
  {
    name: "UniChain",
    chainId: 130,
    defaultToken: {
      in: { symbol: "WETH", address: "0x4200000000000000000000000000000000000006" },
      out: { symbol: "USDC", address: "0x078d782b760474a361dda0af3839290b0ef57ad6" },
    },
  },
  {
    name: "HyperEvm",
    chainId: 999,
    defaultToken: {
      in: { symbol: "WHYPE", address: "0x5555555555555555555555555555555555555555" },
      out: { symbol: "USH", address: "0x8fF0dd9f9C40a0d76eF1BcFAF5f98c1610c74Bd8" },
    },
  },
  {
    name: "Flare",
    chainId: 14,
    defaultToken: {
      in: { symbol: "FLR", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "USDT0", address: "0xe7cd86e13ac4309349f30b3435a9d337750fc82d" },
    },
  },
  {
    name: "Swellchain",
    chainId: 1923,
    defaultToken: {
      in: { symbol: "WETH", address: "0x4200000000000000000000000000000000000006" },
      out: { symbol: "USDe", address: "0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34" },
    },
  },
  {
    name: "Manta Pacific",
    chainId: 169,
    defaultToken: {
      in: { symbol: "ETH", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "USDC", address: "0xb73603c5d87fa094b7314c74ace2e64d165016fb" },
    },
  },
  {
    name: "Polygon zkEVM",
    chainId: 1101,
    defaultToken: {
      in: { symbol: "MATIC", address: "0xa2036f0538221a77A3937F1379699f44945018d0" },
      out: { symbol: "USDT", address: "0x1E4a5963aBFD975d8c9021ce480b42188849D41d" },
    },
  },
  {
    name: "Telos",
    chainId: 40,
    defaultToken: {
      in: { symbol: "TLOS", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "USDT", address: "0x674843C06FF83502ddb4D37c2E09C01cdA38cbc8" },
    },
  },
  {
    name: "Gnosis Mainnet",
    chainId: 100,
    defaultToken: {
      in: { symbol: "XDAI", address: "0xaf204776c7245bF4147c2612BF6e5972Ee483701" },
      out: { symbol: "USDT", address: "0x4ECaBa5870353805a9F068101A40E0f32ed605C6" },
    },
  },
  {
    name: "Rootstock",
    chainId: 30,
    defaultToken: {
      in: { symbol: "RBTC", address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" },
      out: { symbol: "rUSDT", address: "0xef213441a85df4d7acbdae0cf78004e1e486bb96" },
    },
  },
  {
    name: "Kava",
    chainId: 2222,
    defaultToken: {
      in: { symbol: "KAVA", address: "0x211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2" },
      out: { symbol: "USDT", address: "0x919C1c267BC06a7039e03fcc2eF738525769109c" },
    },
  },
  {
    name: "SEI",
    chainId: 1329,
    defaultToken: {
      in: { symbol: "SEI", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "USDT", address: "0xb75d0b03c06a926e488e2659df1a861f860bd3d1" },
    },
  },
  {
    name: "Metis",
    chainId: 1088,
    defaultToken: {
      in: { symbol: "METIS", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "m.USDT", address: "0xbb06dca3ae6887fabf931640f67cab3e3a16f4dc" },
    },
  },
  {
    name: "opBNB",
    chainId: 204,
    defaultToken: {
      in: { symbol: "BNB", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "USDT", address: "0x55d398326f99059fF775485246999027B3197955" },
    },
  },
  {
    name: "Celo",
    chainId: 42220,
    defaultToken: {
      in: { symbol: "CELO", address: "0x471EcE3750Da237f93B8E339c536989b8978a438" },
      out: { symbol: "cUSD", address: "0x765DE816845861e75A25fCA122bb6898B8B1282a" },
    },
  },
  {
    name: "Gravity",
    chainId: 1625,
    defaultToken: {
      in: { symbol: "G", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "USDT", address: "0x816E810f9F787d669FB71932DeabF6c83781Cd48" },
    },
  },
  {
    name: "ApeChain",
    chainId: 33139,
    defaultToken: {
      in: { symbol: "APE", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "apeUSD", address: "0xA2235d059F80e176D931Ef76b6C51953Eb3fBEf4" },
    },
  },
  {
    name: "Cronos",
    chainId: 25,
    defaultToken: {
      in: { symbol: "CRO", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "USDT", address: "0x66e428c3f67a68878562e79a0234c1f83c208770" },
    },
  },
  {
    name: "Aurora",
    chainId: 1313161554,
    defaultToken: {
      in: { symbol: "ETH", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "USDT", address: "0x4988a896b1227218e4a686fde5eabdcabd91571f" },
    },
  },
  {
    name: "Moonriver",
    chainId: 1285,
    defaultToken: {
      in: { symbol: "MOVR", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "USDT", address: "0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d" },
    },
  },
  {
    name: "Harmony",
    chainId: 1666600000,
    defaultToken: {
      in: { symbol: "ONE", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "1USDT", address: "0x3C2B8Be99c50593081EAA2A724F0B8285F5aba8f" },
    },
  },
  {
    name: "Monad Testnet",
    chainId: 10143,
    defaultToken: {
      in: { symbol: "WMON", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "USDT", address: "0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D" },
    },
  },
  {
    name: "HyperEvm",
    chainId: 999,
    defaultToken: {
      in: { symbol: "WHYPE", address: "0x5555555555555555555555555555555555555555" },
      out: { symbol: "USH", address: "0x8fF0dd9f9C40a0d76eF1BcFAF5f98c1610c74Bd8" },
    },
  },
  {
    name: "Plasma",
    chainId: 9745,
    defaultToken: {
      in: { symbol: "WXPL", address: "0x6100e367285b01f48d07953803a2d8dca5d19873" },
      out: { symbol: "USDT0", address: "0xb8ce59fc3717ada4c02eadf9682a9e934f625ebb" },
    },
  },
  {
    name: "Plume",
    chainId: 98866,
    defaultToken: {
      in: { symbol: "WPLUME", address: "0xEa237441c92CAe6FC17Caaf9a7acB3f953be4bd1" },
      out: { symbol: "PUSD", address: "0xdddd73f5df1f0dc31373357beac77545dc5a6f3f" },
    },
  },
  {
    name: "Tac",
    chainId: 239,
    defaultToken: {
      in: { symbol: "WTAC", address: "0xb63b9f0eb4a6e6f191529d71d4d88cc8900df2c9" },
      out: { symbol: "USDT", address: "0xaf988c3f7cb2aceabb15f96b19388a259b6c438f" },
    },
  },
  {
    name: "Monad",
    chainId: 143,
    defaultToken: {
      in: { symbol: "WMON", address: "0x3bd359C1119dA7Da1D913D1C4D2B7c461115433A" },
      out: { symbol: "USDC", address: "0x754704Bc059F8C67012fEd69BC8A327a5aafb603" },
    },
  },
  {
    name: "Bitcoin",
    chainId: 20000000000001,
    defaultToken: {
      in: { symbol: "BTC", address: "bitcoin" },
      out: { symbol: "USDT", address: "0xaf988c3f7cb2aceabb15f96b19388a259b6c438f" },
    },
  },
  {
    name: "Flare",
    chainId: 14,
    defaultToken: {
      in: { symbol: "FLR", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "USDT", address: "0x0b38e83b86d491735feaa0a791f65c2b99535396" },
    },
  },
  {
    name: "Near",
    chainId: 20000000000006,
    defaultToken: {
      in: { symbol: "NEAR", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "USDT", address: "0xaf988c3f7cb2aceabb15f96b19388a259b6c438f" },
    },
  },
  {
    name: "RobinHood",
    chainId: 4663,
    defaultToken: {
      in: { symbol: "ETH", address: "0x0000000000000000000000000000000000000000" },
      out: { symbol: "USDE", address: "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34" },
    },
  },
];
