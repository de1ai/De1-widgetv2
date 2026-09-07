import { WalletWagmiConfigContext } from '@de1/wallet-management'
import { type FC, type PropsWithChildren } from 'react'
import { WagmiProvider } from 'wagmi'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'
import { useWidgetInternalWagmiConfig } from './useWidgetInternalWagmiConfig.js'

export const EVMBaseProvider: FC<PropsWithChildren> = ({ children }) => {
  const { walletConfig } = useWidgetConfig()
  const { config, connectors } = useWidgetInternalWagmiConfig({
    walletConfig,
  })

  return (
    <WagmiProvider config={config} reconnectOnMount={false}>
      <WalletWagmiConfigContext.Provider value={config}>
        {children}
      </WalletWagmiConfigContext.Provider>
    </WagmiProvider>
  )
}
