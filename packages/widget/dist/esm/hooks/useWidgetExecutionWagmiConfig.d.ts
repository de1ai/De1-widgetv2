import type { Config } from 'wagmi';
/**
 * Returns the wagmi config that the widget's SDK execution path should use
 * for chain lookups, `getPublicClient`, and `switchChain`.
 *
 * Resolution order:
 *   1. Widget-internal shadow config (carries the De¹ 40+ chain list) – this
 *      is always preferred so that the host's restricted chain list never
 *      leaks into the widget.
 *   2. Host `<WagmiProvider config>` from context – used in legacy
 *      integrations where the host wraps the widget in a single wagmi
 *      provider and no shadow config was created.
 *
 * Note: this hook is NOT meant for reading the connected account; account
 * reads should go through `useAccount` / `WalletWagmiConfigContext` instead.
 */
export declare function useWidgetExecutionWagmiConfig(): Config | undefined;
