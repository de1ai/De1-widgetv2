import { useSyncWagmiConfig } from '@de1/wallet-management'
import { ChainType, useAvailableChains } from '@de1/widget'
import {} from '@tanstack/react-query'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import type { FC, PropsWithChildren } from 'react'
import { WagmiProvider, createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { walletConnectProjectId } from '../config/connectkit'

const wagmiConfig = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [mainnet],

    // Required API Keys
    walletConnectProjectId: walletConnectProjectId,

    // Required App Info
    appName: 'de1-connectkit-widget-example',

    // Optional App Info
    appDescription: 'De¹ Exchange Widget ConnectKit Example',
    appUrl: 'https://de1.exchange/', // your app's url
    appIcon: 'https://avatars.githubusercontent.com/u/85288935', // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
)

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { chains } = useAvailableChains()

  const evmChains = chains?.filter((chain) => chain.chainType === ChainType.EVM)

  useSyncWagmiConfig(wagmiConfig, [], evmChains)
  return (
    <WagmiProvider config={wagmiConfig}>
      <ConnectKitProvider>{children}</ConnectKitProvider>
    </WagmiProvider>
  )
}
