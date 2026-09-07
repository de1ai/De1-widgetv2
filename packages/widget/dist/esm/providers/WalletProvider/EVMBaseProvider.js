import { jsx as _jsx } from "react/jsx-runtime";
import { WalletWagmiConfigContext } from '@de1/wallet-management';
import { WagmiProvider } from 'wagmi';
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js';
import { useWidgetInternalWagmiConfig } from './useWidgetInternalWagmiConfig.js';
export const EVMBaseProvider = ({ children }) => {
    const { walletConfig } = useWidgetConfig();
    const { config, connectors } = useWidgetInternalWagmiConfig({
        walletConfig,
    });
    return (_jsx(WagmiProvider, { config: config, reconnectOnMount: false, children: _jsx(WalletWagmiConfigContext.Provider, { value: config, children: children }) }));
};
//# sourceMappingURL=EVMBaseProvider.js.map