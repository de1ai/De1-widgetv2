import { ChainType } from '@de1/widget-sdk'
import { useContext, useMemo } from 'react'
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js'
import { EVMExternalContext } from './EVMExternalContext.js'
import { SVMExternalContext } from './SVMExternalContext.js'
import { UTXOExternalContext } from './UTXOExternalContext.js'

interface ExternalWalletProvider {
  useExternalWalletProvidersOnly: boolean
  externalChainTypes: ChainType[]
  internalChainTypes: ChainType[]
}

const allChainTypes = [ChainType.EVM, ChainType.SVM, ChainType.UTXO, ChainType.NVM]

export function useExternalWalletProvider(): ExternalWalletProvider {
  const { walletConfig } = useWidgetConfig()
  const hasExternalEVMContext = useContext(EVMExternalContext)
  const hasExternalSVMContext = useContext(SVMExternalContext)
  const hasExternalUTXOContext = useContext(UTXOExternalContext)
  const data = useMemo(() => {
    // Treat `externalWagmiConfig` as an external EVM provider the same way
    // as a host <WagmiProvider> would. This is what enables the wallet
    // menu to hide EVM entries when the host already manages the wallet.
    const hasExternalEVM =
      hasExternalEVMContext || Boolean(walletConfig?.externalWagmiConfig)
    const providers: ChainType[] = []
    if (hasExternalEVM) {
      providers.push(ChainType.EVM)
    }
    if (hasExternalSVMContext) {
      providers.push(ChainType.SVM)
    }
    if (hasExternalUTXOContext) {
      providers.push(ChainType.UTXO)
    }
    const hasExternalProvider =
      hasExternalEVM || hasExternalSVMContext || hasExternalUTXOContext
    const usePartialWalletManagement =
      walletConfig?.usePartialWalletManagement === true
    const hideEvmWalletMenu = walletConfig?.hideEvmWalletMenu === true

    // When usePartialWalletManagement is enabled, the widget should still
    // render its own wallet list for every ecosystem, even if the host app
    // already provides an external wallet context. In that case we keep all
    // chain types in `internalChainTypes` so the wallet menu is not empty.
    // When usePartialWalletManagement is disabled (default), we only keep the
    // ecosystems that are NOT already provided externally – the host app is
    // considered the single source of truth for the rest.
    let internalChainTypes = usePartialWalletManagement
      ? allChainTypes
      : allChainTypes.filter((chainType) => !providers.includes(chainType))

    // Explicit `hideEvmWalletMenu: true` removes EVM from the internal
    // wallet menu regardless of usePartialWalletManagement, so the host's
    // wallet (e.g. RainbowKit navbar) stays the single source of truth.
    if (hideEvmWalletMenu && !usePartialWalletManagement) {
      internalChainTypes = internalChainTypes.filter(
        (chainType) => chainType !== ChainType.EVM
      )
    }

    const useExternalWalletProvidersOnly =
      hasExternalProvider && !usePartialWalletManagement
    return {
      useExternalWalletProvidersOnly,
      externalChainTypes: providers,
      internalChainTypes,
    }
  }, [
    hasExternalEVMContext,
    hasExternalSVMContext,
    hasExternalUTXOContext,
    walletConfig?.usePartialWalletManagement,
    walletConfig?.externalWagmiConfig,
    walletConfig?.hideEvmWalletMenu,
  ])

  return data
}
