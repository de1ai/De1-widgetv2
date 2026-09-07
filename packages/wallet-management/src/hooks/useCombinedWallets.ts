import type { Theme } from '@mui/material'
import { useMediaQuery } from '@mui/material'
import { ChainType } from '@de1/widget-sdk'
import { WalletReadyState } from '@solana/wallet-adapter-base'
import type { Wallet } from '@solana/wallet-adapter-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useMemo } from 'react'
import type { Connector } from 'wagmi'
import { useAccount, useConnect } from 'wagmi'
import { defaultCoinbaseConfig } from '../config/coinbase.js'
import { defaultMetaMaskConfig } from '../config/metaMask.js'
import { defaultWalletConnectConfig } from '../config/walletConnect.js'
import { createCoinbaseConnector } from '../connectors/coinbase.js'
import { createMetaMaskConnector } from '../connectors/metaMask.js'
import type { CreateConnectorFnExtended } from '../connectors/types.js'
import { createWalletConnectConnector } from '../connectors/walletConnect.js'
import {
  getSafeWagmiConfig,
  useOptionalBigmiConfig,
  useOptionalWagmiConfig,
} from './useAccount.js'
import { useWalletManagementConfig } from '../providers/WalletManagementProvider/WalletManagementContext.js'
import type { WalletConnector } from '../types/walletConnector.js'
import { getConnectorIcon } from '../utils/getConnectorIcon.js'
import { getWalletPriority } from '../utils/getWalletPriority.js'
import { isWalletInstalled } from '../utils/isWalletInstalled.js'

export type CombinedWalletConnector = {
  connector: WalletConnector
  chainType: ChainType
}

export type CombinedWallet = {
  id: string
  name: string
  icon?: string
  connectors: CombinedWalletConnector[]
}

const normalizeName = (name: string) => name.split(' ')[0].toLowerCase().trim()

const combineWalletLists = (
  utxoConnectorList: (CreateConnectorFnExtended | Connector)[],
  evmConnectorList: (CreateConnectorFnExtended | Connector)[],
  svmWalletList: Wallet[]
): CombinedWallet[] => {
  const walletMap = new Map<string, CombinedWallet>()

  utxoConnectorList.forEach((utxo) => {
    const utxoName =
      (utxo as CreateConnectorFnExtended)?.displayName ||
      (utxo as Connector)?.name
    const normalizedName = normalizeName(utxoName)

    const connectors: any[] = []
    const existing = walletMap.get(normalizedName) || {
      id: utxo.id,
      name: utxoName,
      icon: getConnectorIcon(utxo as Connector),
      connectors: connectors,
    }
    existing.connectors.push({ connector: utxo, chainType: ChainType.UTXO })
    walletMap.set(normalizedName, existing)
  })

  evmConnectorList.forEach((evm) => {
    const evmName =
      (evm as CreateConnectorFnExtended)?.displayName ||
      (evm as Connector)?.name
    const normalizedName = normalizeName(evmName)
    const connectors: any[] = []
    const existing = walletMap.get(normalizedName) || {
      id: evm.id,
      name: evmName,
      icon: getConnectorIcon(evm as Connector),
      connectors: connectors,
    }
    existing.connectors.push({ connector: evm, chainType: ChainType.EVM })
    walletMap.set(normalizedName, existing)
  })

  svmWalletList.forEach((svm) => {
    const normalizedName = normalizeName(svm.adapter.name)
    const connectors: any[] = []
    const existing = walletMap.get(normalizedName) || {
      id: svm.adapter.name,
      name: svm.adapter.name,
      icon: svm.adapter.icon,
      connectors: connectors,
    }
    existing.connectors.push({
      connector: svm.adapter,
      chainType: ChainType.SVM,
    })
    walletMap.set(normalizedName, existing)
  })

  const combinedWallets = Array.from(walletMap.values())
  combinedWallets.sort(walletComparator)

  return combinedWallets
}

export const useCombinedWallets = () => {
  const walletConfig = useWalletManagementConfig()
  const bigmiConfig = useOptionalBigmiConfig()
  const wagmiConfig = useOptionalWagmiConfig()
  const wagmiAccountFromHook = useAccount({
    config: getSafeWagmiConfig(wagmiConfig),
  })
  const bigmiAccountFromHook = useAccount({
    config: getSafeWagmiConfig(bigmiConfig),
  })
  const { connectors: wagmiConnectorsFromHook } = useConnect({
    config: getSafeWagmiConfig(wagmiConfig),
  })
  const { connectors: bigmiConnectorsFromHook } = useConnect({
    config: getSafeWagmiConfig(bigmiConfig),
  })
  const wagmiAccount = wagmiConfig ? wagmiAccountFromHook : undefined
  const bigmiAccount = bigmiConfig ? bigmiAccountFromHook : undefined
  const wagmiConnectors = wagmiConfig ? wagmiConnectorsFromHook : []
  const bigmiConnectors = bigmiConfig ? bigmiConnectorsFromHook : []
  const { wallets: solanaWallets } = useWallet()

  const isDesktopView = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('sm')
  )

  const data = useMemo(() => {
    const evmConnectors: (CreateConnectorFnExtended | Connector)[] =
      Array.from(wagmiConnectors)

    // When a real wagmi config is available, register any synthetic connectors
    // on the config before adding them to the list. Otherwise calling
    // `connect()` from EVMListItemButton will create a one-off connector
    // instance whose connect events are not wired up to the config, and the
    // wallet popup (MetaMask / WalletConnect / Coinbase) never appears in
    // production builds.
    const registerIfNeeded = (fn: CreateConnectorFnExtended) => {
      if (!wagmiConfig) return fn
      try {
        const registered = wagmiConfig._internal.connectors.setup(fn)
        return registered as unknown as CreateConnectorFnExtended
      } catch {
        return fn
      }
    }

    // Ensure standard connectors are included
    if (
      !evmConnectors.some((connector) =>
        connector.id.toLowerCase().includes('walletconnect')
      )
    ) {
      evmConnectors.unshift(
        registerIfNeeded(
          createWalletConnectConnector(
            walletConfig?.walletConnect ?? defaultWalletConnectConfig
          )
        )
      )
    }
    if (
      !evmConnectors.some((connector) =>
        connector.id.toLowerCase().includes('coinbase')
      )
    ) {
      evmConnectors.unshift(
        registerIfNeeded(
          createCoinbaseConnector(
            walletConfig?.coinbase ?? defaultCoinbaseConfig
          )
        )
      )
    }
    if (
      !evmConnectors.some((connector) =>
        connector.id.toLowerCase().includes('metamask')
      )
    ) {
      evmConnectors.unshift(
        registerIfNeeded(
          createMetaMaskConnector(
            walletConfig?.metaMask ?? defaultMetaMaskConfig
          )
        )
      )
    }

    const includeEcosystem = (chainType: ChainType) => {
      return !walletConfig.enabledChainTypes ||
        walletConfig.enabledChainTypes.includes(chainType)
    }

    const installedUTXOConnectors = includeEcosystem(ChainType.UTXO)
      ? bigmiConnectors.filter((connector) => {
        const isInstalled = isWalletInstalled(connector.id)
        const isConnected = bigmiAccount?.connector?.id === connector.id
        return isInstalled && !isConnected
      })
      : []

    const installedEVMConnectors = includeEcosystem(ChainType.EVM)
      ? evmConnectors.filter((connector) => {
        const isInstalled = isWalletInstalled(connector.id)
        const isConnected = wagmiAccount?.connector?.id === connector.id
        return isInstalled && !isConnected
      })
      : []

    const installedSVMWallets = includeEcosystem(ChainType.SVM)
      ? solanaWallets.filter((wallet) => {
        const isInstalled =
          wallet.adapter.readyState === WalletReadyState.Installed ||
          wallet.adapter.readyState === WalletReadyState.Loadable
        const isConnected = wallet.adapter.connected
        return isInstalled && !isConnected
      })
      : []

    const installedCombinedWallets = combineWalletLists(
      installedUTXOConnectors,
      installedEVMConnectors,
      installedSVMWallets
    )

    // Add Near wallets (Meteor / Sender) as NVM ecosystem wallets.
    if (includeEcosystem(ChainType.NVM)) {
      const nearWallets: CombinedWallet[] = [
        {
          id: 'meteor-wallet',
          name: 'Meteor Wallet',
          icon: 'https://assets.meteorwallet.app/logo.png',
          connectors: [
            {
              // We only need an identifier here; connection logic is handled
              // in the NVM-specific list item button in the UI layer.
              connector: { id: 'meteor-wallet' } as unknown as WalletConnector,
              chainType: ChainType.NVM,
            },
          ],
        },
        {
          id: 'sender',
          name: 'Sender Wallet',
          icon: 'https://senderwallet.io/favicon.ico',
          connectors: [
            {
              connector: { id: 'sender' } as unknown as WalletConnector,
              chainType: ChainType.NVM,
            },
          ],
        },
      ]

      nearWallets.forEach((wallet) => {
        if (!installedCombinedWallets.some((w) => w.id === wallet.id)) {
          installedCombinedWallets.push(wallet)
        }
      })
    }

    const notDetectedUTXOConnectors = bigmiConnectors.filter((connector) => {
      const isInstalled = isWalletInstalled(connector.id)
      return !isInstalled && isDesktopView
    })

    const notDetectedEVMConnectors = evmConnectors.filter((connector) => {
      const isInstalled = isWalletInstalled(connector.id)
      return !isInstalled && isDesktopView
    })

    const notDetectedSVMWallets = solanaWallets.filter((wallet) => {
      const isInstalled =
        wallet.adapter.readyState === WalletReadyState.Installed ||
        wallet.adapter.readyState === WalletReadyState.Loadable
      return !isInstalled && isDesktopView
    })

    const notDetectedCombinedWallets = combineWalletLists(
      notDetectedEVMConnectors,
      notDetectedUTXOConnectors,
      notDetectedSVMWallets
    )

    installedCombinedWallets.sort(walletComparator)
    notDetectedCombinedWallets.sort(walletComparator)

    return {
      installedWallets: installedCombinedWallets,
      notDetectedWallets: notDetectedCombinedWallets,
    }
  }, [
    bigmiAccount?.connector?.id,
    bigmiConnectors,
    solanaWallets,
    wagmiAccount?.connector?.id,
    wagmiConnectors,
    wagmiConfig,
    isDesktopView,
    walletConfig,
  ])

  return data
}

// Ensure the walletComparator function is updated to handle CombinedWallet
export const walletComparator = (a: CombinedWallet, b: CombinedWallet) => {
  const priorityA = getWalletPriority(a.id)
  const priorityB = getWalletPriority(b.id)

  if (priorityA !== priorityB) {
    return priorityA - priorityB
  }

  return a.id?.localeCompare(b.id)
}
