import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { WalletManagementProvider } from '@de1/wallet-management';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js';
import { EVMProvider } from './EVMProvider.js';
import { SDKProviders } from './SDKProviders.js';
import { SVMProvider } from './SVMProvider.js';
import { UTXOProvider } from './UTXOProvider.js';
import { useExternalWalletProvider } from './useExternalWalletProvider.js';
export const WalletProvider = ({ children }) => {
    return (_jsx(EVMProvider, { children: _jsx(SVMProvider, { children: _jsxs(UTXOProvider, { children: [_jsx(SDKProviders, {}), _jsx(WalletMenuProvider, { children: children })] }) }) }));
};
export const WalletMenuProvider = ({ children }) => {
    const { walletConfig } = useWidgetConfig();
    const { i18n } = useTranslation();
    const { internalChainTypes } = useExternalWalletProvider();
    const config = useMemo(() => {
        return {
            locale: i18n.resolvedLanguage,
            enabledChainTypes: internalChainTypes,
            ...walletConfig,
        };
    }, [i18n.resolvedLanguage, internalChainTypes, walletConfig]);
    return (_jsx(WalletManagementProvider, { config: config, children: children }));
};
//# sourceMappingURL=WalletProvider.js.map