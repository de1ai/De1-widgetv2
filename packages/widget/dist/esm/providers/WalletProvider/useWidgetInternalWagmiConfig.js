import { createDefaultWagmiConfig, useSyncWagmiConfig, } from '@de1/wallet-management';
import { useMemo, useRef } from 'react';
import { defaultCoinbaseConfig } from '../../config/coinbase.js';
import { defaultMetaMaskConfig } from '../../config/metaMask.js';
import { defaultWalletConnectConfig } from '../../config/walletConnect.js';
import { useAvailableChains } from '../../hooks/useAvailableChains.js';
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
export function useWidgetInternalWagmiConfig(options = {}) {
    const { walletConfig } = options;
    const { chains } = useAvailableChains();
    const ref = useRef(null);
    if (!ref.current) {
        ref.current = createDefaultWagmiConfig({
            coinbase: walletConfig?.coinbase ?? defaultCoinbaseConfig,
            metaMask: walletConfig?.metaMask ?? defaultMetaMaskConfig,
            walletConnect: walletConfig?.walletConnect ?? defaultWalletConnectConfig,
            wagmiConfig: {
                ssr: true,
            },
            lazy: true,
        });
    }
    useSyncWagmiConfig(ref.current.config, ref.current.connectors, chains);
    return useMemo(() => ({
        config: ref.current.config,
        connectors: ref.current.connectors,
    }), []);
}
//# sourceMappingURL=useWidgetInternalWagmiConfig.js.map