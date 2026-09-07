import { BigmiContext } from '@bigmi/react'
import { ChainId, ChainType } from '@de1/widget-sdk'
import type { WalletAdapter } from '@solana/wallet-adapter-base'
import { useWallet } from '@solana/wallet-adapter-react'
import { useContext, useMemo } from 'react'
import { http, createClient } from 'viem'
import { mainnet } from 'viem/chains'
import type { Config, Connector } from 'wagmi'
import { WagmiContext, createConfig, useAccount as useAccountInternal } from 'wagmi'
import { create } from 'zustand'
import type { CreateConnectorFnExtended } from '../connectors/types.js'
import {
  WalletBigmiConfigContext,
  WalletWagmiConfigContext,
} from '../providers/WalletChainConfigContext.js'

const fallbackWagmiConfig = createConfig({
  chains: [mainnet],
  client({ chain }) {
    return createClient({ chain, transport: http() })
  },
  ssr: true,
  multiInjectedProviderDiscovery: false,
})

export const useOptionalWagmiConfig = (): Config | undefined => {
  return useContext(WalletWagmiConfigContext) ?? useContext(WagmiContext)
}

export const getSafeWagmiConfig = (config?: Config): Config => {
  return config ?? fallbackWagmiConfig
}

export interface AccountBase<CT extends ChainType, ConnectorType = undefined> {
  address?: string
  addresses?: readonly string[]
  chainId?: number
  chainType: CT
  connector?: ConnectorType
  isConnected: boolean
  isConnecting: boolean
  isDisconnected: boolean
  isReconnecting: boolean
  status: 'connected' | 'reconnecting' | 'connecting' | 'disconnected'
}

export type EVMAccount = AccountBase<ChainType.EVM, Connector>
export type SVMAccount = AccountBase<ChainType.SVM, WalletAdapter>
export type UTXOAccount = AccountBase<ChainType.UTXO, Connector>
export type NVMAccount = AccountBase<
  ChainType.NVM,
  {
    id: string
    name: string
  }
>
export type DefaultAccount = AccountBase<ChainType>

export type Account =
  | EVMAccount
  | SVMAccount
  | UTXOAccount
  | NVMAccount
  | DefaultAccount

export interface AccountResult {
  account: Account
  /**
   * Connected accounts
   */
  accounts: Account[]
}

interface UseAccountArgs {
  chainType?: ChainType
}

const defaultAccount: AccountBase<ChainType> = {
  chainType: ChainType.EVM,
  isConnected: false,
  isConnecting: false,
  isReconnecting: false,
  isDisconnected: true,
  status: 'disconnected',
}

const disconnectedUTXOAccount: UTXOAccount = {
  chainType: ChainType.UTXO,
  isConnected: false,
  isConnecting: false,
  isReconnecting: false,
  isDisconnected: true,
  status: 'disconnected',
}

export const useOptionalBigmiConfig = (): Config | undefined => {
  return (
    useContext(WalletBigmiConfigContext) ??
    (useContext(BigmiContext) as Config | undefined)
  )
}

export type LastConnectedAccount =
  | WalletAdapter
  | Connector
  | CreateConnectorFnExtended
  | null

interface LastConnectedAccountStore {
  lastConnectedAccount: LastConnectedAccount
  setLastConnectedAccount: (account: LastConnectedAccount) => void
}

export const useLastConnectedAccount = create<LastConnectedAccountStore>(
  (set) => ({
    lastConnectedAccount: null,
    setLastConnectedAccount: (account) =>
      set({ lastConnectedAccount: account }),
  })
)

interface NearAccountStore {
  nearAccount: NVMAccount | null
  setNearAccount: (account: NVMAccount | null) => void
}

export const useNearAccountStore = create<NearAccountStore>((set) => ({
  nearAccount: null,
  setNearAccount: (account) => set({ nearAccount: account }),
}))

/**
 * @param args When we provide args we want to return either account with corresponding chainType or default disconnected one
 * @returns - Account result
 */
export const useAccount = (args?: UseAccountArgs): AccountResult => {
  const bigmiConfig = useOptionalBigmiConfig()
  const wagmiConfig = useOptionalWagmiConfig()
  const bigmiAccountFromHook = useAccountInternal({
    config: getSafeWagmiConfig(bigmiConfig),
  })
  const wagmiAccountFromHook = useAccountInternal({
    config: getSafeWagmiConfig(wagmiConfig),
  })
  const { wallet } = useWallet()
  const { lastConnectedAccount } = useLastConnectedAccount()
  const { nearAccount } = useNearAccountStore()

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  return useMemo(() => {
    const svm: Account = wallet?.adapter.publicKey
      ? {
        address: wallet?.adapter.publicKey.toString(),
        chainId: ChainId.SOL,
        chainType: ChainType.SVM,
        connector: wallet?.adapter,
        isConnected: Boolean(wallet?.adapter.publicKey),
        isConnecting: false,
        isReconnecting: false,
        isDisconnected: !wallet,
        status: 'connected',
      }
      : {
        chainType: ChainType.SVM,
        isConnected: false,
        isConnecting: false,
        isReconnecting: false,
        isDisconnected: true,
        status: 'disconnected',
      }
    const evm: Account = wagmiConfig
      ? { ...wagmiAccountFromHook, chainType: ChainType.EVM }
      : defaultAccount
    const utxo: Account = bigmiConfig
      ? { ...bigmiAccountFromHook, chainType: ChainType.UTXO }
      : disconnectedUTXOAccount

    const nvm: Account =
      nearAccount && nearAccount.isConnected
        ? nearAccount
        : {
          chainType: ChainType.NVM,
          isConnected: false,
          isConnecting: false,
          isReconnecting: false,
          isDisconnected: true,
          status: 'disconnected',
        }

    const accounts = [evm, svm, utxo, nvm]
    const connectedAccounts = accounts.filter(
      (account) => account.isConnected && account.address
    )

    // If a chainType argument is provided, attempt to find a connected account with the matching chainType.
    // If no matching account is found, fallback to the default account.
    // If no chainType argument, selectedAccount should be used.
    const selectedChainTypeAccount = args?.chainType
      ? connectedAccounts.find(
        (account) => account.chainType === args?.chainType
      ) || defaultAccount
      : undefined

    // If lastConnectedAccount exists, attempt to find a connected account with a matching connector ID or name.
    // If no matching account is found, fallback to the first connected account.
    // If lastConnectedAccount is not present, simply select the first connected account.
    const selectedAccount = lastConnectedAccount
      ? connectedAccounts.find((account) => {
        const connectorIdMatch =
          (lastConnectedAccount as Connector)?.id ===
          (account.connector as Connector)?.id
        const connectorNameMatch =
          !(lastConnectedAccount as Connector)?.id &&
          (lastConnectedAccount as WalletAdapter)?.name ===
          account.connector?.name
        return connectorIdMatch || connectorNameMatch
      }) || connectedAccounts[0]
      : connectedAccounts[0]

    return {
      account: selectedChainTypeAccount || selectedAccount || defaultAccount,
      // We need to return only connected account list
      accounts: connectedAccounts,
    }
  }, [
    wallet?.adapter.publicKey,
    wagmiConfig,
    wagmiAccountFromHook.connector?.uid,
    wagmiAccountFromHook.connector?.id,
    wagmiAccountFromHook.status,
    wagmiAccountFromHook.address,
    wagmiAccountFromHook.chainId,
    bigmiConfig,
    bigmiAccountFromHook.connector?.uid,
    bigmiAccountFromHook.connector?.id,
    bigmiAccountFromHook.status,
    bigmiAccountFromHook.address,
    bigmiAccountFromHook.chainId,
    args?.chainType,
    lastConnectedAccount,
    nearAccount,
  ])
}
