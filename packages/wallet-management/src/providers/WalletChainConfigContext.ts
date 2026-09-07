import { createContext } from 'react'
import type { Config } from 'wagmi'

/**
 * Widget-owned wagmi/bigmi configs. These contexts live in this package so
 * wallet-management hooks can read them even when the host bundle has a
 * second copy of `wagmi` / `@bigmi/react` (whose React contexts would miss).
 */
export const WalletWagmiConfigContext = createContext<Config | undefined>(
  undefined
)

export const WalletBigmiConfigContext = createContext<Config | undefined>(
  undefined
)
