import type { ChainType } from '@de1/widget-sdk'

export enum WalletManagementEvent {
  WalletConnected = 'walletConnected',
}

export type WalletManagementEvents = {
  walletConnected: WalletConnected
}

export interface WalletConnected {
  address: string
  chainId: number
  chainType: ChainType
  connectorId: string
  connectorName: string
}
