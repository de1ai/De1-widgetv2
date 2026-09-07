import type { ChainType } from '@de1/widget-sdk'

export interface WalletMenuOpenOptions {
  chainType?: ChainType
}

export interface WalletMenuContext {
  isWalletMenuOpen(): void
  toggleWalletMenu(): void
  openWalletMenu(options?: WalletMenuOpenOptions): void
  closeWalletMenu(): void
}
