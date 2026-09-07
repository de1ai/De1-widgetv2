import { ChainType } from '@de1/widget-sdk'
import { useWallet } from '@solana/wallet-adapter-react'
import type { Config } from 'wagmi'
import { disconnect, getAccount } from 'wagmi/actions'
import type { Account } from './useAccount.js'
import {
  useLastConnectedAccount,
  useNearAccountStore,
  useOptionalBigmiConfig,
  useOptionalWagmiConfig,
} from './useAccount.js'
// @ts-ignore - runtime implementation is provided by the host app (widget package)
import { useWalletSelector } from '@near-wallet-selector/react-hook'

export const useAccountDisconnect = () => {
  const bigmiConfig = useOptionalBigmiConfig()
  const wagmiConfig = useOptionalWagmiConfig()
  const { disconnect: solanaDisconnect } = useWallet()
  const { setNearAccount } = useNearAccountStore()
  const { setLastConnectedAccount } = useLastConnectedAccount()
  const nearWallet = useWalletSelector() as any

  const handleDisconnect = async (config: Config) => {
    const connectedAccount = getAccount(config)
    if (connectedAccount.connector) {
      await disconnect(config, { connector: connectedAccount.connector })
    }
  }

  return async (account: Account) => {
    switch (account.chainType) {
      case ChainType.EVM:
        if (wagmiConfig) {
          await handleDisconnect(wagmiConfig)
        }
        break
      case ChainType.UTXO:
        if (bigmiConfig) {
          await handleDisconnect(bigmiConfig)
        }
        break
      case ChainType.NVM:
        try {
          // Call Near wallet signOut when available
          await nearWallet?.signOut?.()
        } catch (error) {
          console.error('Failed to sign out Near wallet', error)
        }
        // Clear the global Near account and last-connected record
        setNearAccount(null)
        setLastConnectedAccount(null)
        break
      default:
        await solanaDisconnect()
    }
  }
}
