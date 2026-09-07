import type { PrivyClientConfig } from '@privy-io/react-auth'
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana'
const solanaConnectors = toSolanaWalletConnectors()

export const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
    requireUserPasswordOnCreate: true,
    showWalletUIs: true,
  },
  loginMethods: ['wallet', 'email'],
  appearance: {
    walletChainType: 'ethereum-and-solana',
    showWalletLoginFirst: true,
    logo: 'https://pbs.twimg.com/profile_images/1759593486674972672/kh5ynoMH_400x400.jpg', // your company logo here
  },
  externalWallets: {
    coinbaseWallet: {
      connectionOptions: 'eoaOnly',
    },
    walletConnect: {
      enabled: true,
    },
    solana: {
      connectors: solanaConnectors,
    },
  },
  solanaClusters: [
    {
      name: 'mainnet-beta',
      // replace this with your rpc url
      rpcUrl: 'https://chaotic-restless-putty.solana-mainnet.quiknode.pro/',
    },
  ],
}

export const PRIVY_APP_ID: string = import.meta.env.VITE_PRIVY_APP_ID

export const PRIVY_CLIENT_ID: string = import.meta.env.VITE_PRIVY_CLIENT_ID
