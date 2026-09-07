import type { DefaultWagmiConfigResult } from '@de1/wallet-management';
import type { WidgetWalletConfig } from '../../types/widget.js';
export interface UseWidgetInternalWagmiConfigOptions {
    walletConfig?: WidgetWalletConfig;
}
export interface UseWidgetInternalWagmiConfigResult {
    /**
     * Widget-owned wagmi config. This config holds the De¹ 40+ EVM chain list
     * internally and is independent from any host-supplied wagmi config. The
     * widget's SDK execution path consumes this config so that the host's
     * global wagmi config is never mutated.
     */
    config: DefaultWagmiConfigResult['config'] | undefined;
    connectors: DefaultWagmiConfigResult['connectors'];
}
/**
 * Hook that returns a stable, widget-internal wagmi config.
 *
 * It is only created when the widget needs to run EVM SDK execution
 * against De¹ chains (i.e. the host provided an `externalWagmiConfig`
 * for the account source, or the widget is being used standalone).
 *
 * Reuse of the underlying `createDefaultWagmiConfig` + `useSyncWagmiConfig`
 * pair keeps standalone behaviour identical to the previous
 * `EVMBaseProvider` implementation.
 */
export declare function useWidgetInternalWagmiConfig(options?: UseWidgetInternalWagmiConfigOptions): UseWidgetInternalWagmiConfigResult;
