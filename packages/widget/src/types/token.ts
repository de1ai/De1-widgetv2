import type { TokenAmount as SDKTokenAmount } from '@de1/widget-sdk'

export type TokenSource = 'token' | 'rwa' | 'both'

export interface TokenAmount extends SDKTokenAmount {
  featured?: boolean
  popular?: boolean
  tokenSource?: TokenSource
  category?: string
  /** Attached at runtime by useTokens from the token address */
  isNative?: boolean
}
