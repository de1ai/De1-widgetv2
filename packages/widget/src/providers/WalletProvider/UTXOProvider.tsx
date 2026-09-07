import { BigmiContext } from '@bigmi/react'
import { WalletBigmiConfigContext } from '@de1/wallet-management'
import { ChainType } from '@de1/widget-sdk'
import { type FC, type PropsWithChildren, useContext } from 'react'
import { isItemAllowed } from '../../utils/item.js'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'
import { UTXOBaseProvider } from './UTXOBaseProvider.js'
import { UTXOExternalContext } from './UTXOExternalContext.js'

export function useInBigmiContext(): boolean {
  const { chains } = useWidgetConfig()
  const context = useContext(BigmiContext)

  return Boolean(context) && isItemAllowed(ChainType.UTXO, chains?.types)
}

export const UTXOProvider: FC<PropsWithChildren> = ({ children }) => {
  const bigmiConfig = useContext(BigmiContext)
  const inBigmiContext = useInBigmiContext()

  return inBigmiContext ? (
    <WalletBigmiConfigContext.Provider value={bigmiConfig}>
      <UTXOExternalContext.Provider value={inBigmiContext}>
        {children}
      </UTXOExternalContext.Provider>
    </WalletBigmiConfigContext.Provider>
  ) : (
    <UTXOBaseProvider>{children}</UTXOBaseProvider>
  )
}
