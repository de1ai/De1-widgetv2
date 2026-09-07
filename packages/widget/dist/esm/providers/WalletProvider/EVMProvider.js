import { jsx as _jsx } from "react/jsx-runtime";
import { WalletWagmiConfigContext } from '@de1/wallet-management';
import { ChainType } from '@de1/widget-sdk';
import { useContext } from 'react';
import { WagmiContext } from 'wagmi';
import { isItemAllowed } from '../../utils/item.js';
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js';
import { EVMBaseProvider } from './EVMBaseProvider.js';
import { EVMExternalContext } from './EVMExternalContext.js';
import { WidgetInternalWagmiConfigContext } from './WidgetInternalWagmiConfigContext.js';
import { useWidgetInternalWagmiConfig } from './useWidgetInternalWagmiConfig.js';
export function useInWagmiContext() {
    const { chains } = useWidgetConfig();
    const context = useContext(WagmiContext);
    return Boolean(context) && isItemAllowed(ChainType.EVM, chains?.types);
}
/**
 * Internal provider that mounts the widget-owned wagmi config (with the De¹
 * 40+ chain list) into `WidgetInternalWagmiConfigContext` so that the
 * SDK execution path can consume it without mutating any host config.
 */
const WidgetInternalWagmiConfigProvider = ({ children, }) => {
    const { walletConfig } = useWidgetConfig();
    const { config } = useWidgetInternalWagmiConfig({ walletConfig });
    return (_jsx(WidgetInternalWagmiConfigContext.Provider, { value: config, children: children }));
};
export const EVMProvider = ({ children }) => {
    const { walletConfig } = useWidgetConfig();
    const externalWagmiConfig = walletConfig?.externalWagmiConfig;
    const wagmiContextConfig = useContext(WagmiContext);
    const inWagmiContext = useInWagmiContext();
    // Branch 1: host explicitly provided an external wagmi config via prop.
    // This takes precedence over a host <WagmiProvider> found in context.
    if (externalWagmiConfig) {
        return (_jsx(WalletWagmiConfigContext.Provider, { value: externalWagmiConfig, children: _jsx(EVMExternalContext.Provider, { value: true, children: _jsx(WidgetInternalWagmiConfigProvider, { children: children }) }) }));
    }
    // Branch 2: host wrapped the widget in <WagmiProvider> – reuse it as the
    // account source. The widget still creates its own internal config for
    // SDK execution so the host config is never mutated.
    if (inWagmiContext && wagmiContextConfig) {
        return (_jsx(WalletWagmiConfigContext.Provider, { value: wagmiContextConfig, children: _jsx(EVMExternalContext.Provider, { value: true, children: _jsx(WidgetInternalWagmiConfigProvider, { children: children }) }) }));
    }
    // Branch 3: standalone mode – create everything internally.
    return _jsx(EVMBaseProvider, { children: children });
};
//# sourceMappingURL=EVMProvider.js.map