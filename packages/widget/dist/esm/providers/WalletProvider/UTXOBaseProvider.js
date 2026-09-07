import { jsx as _jsx } from "react/jsx-runtime";
import { BigmiProvider, useReconnect } from '@bigmi/react';
import { WalletBigmiConfigContext, createDefaultBigmiConfig, } from '@de1/wallet-management';
import { useRef } from 'react';
export const UTXOBaseProvider = ({ children }) => {
    const bigmi = useRef(null);
    if (!bigmi.current) {
        bigmi.current = createDefaultBigmiConfig({
            bigmiConfig: {
                ssr: true,
                multiInjectedProviderDiscovery: false,
            },
        });
    }
    useReconnect(bigmi.current.config);
    return (_jsx(BigmiProvider, { config: bigmi.current.config, reconnectOnMount: false, children: _jsx(WalletBigmiConfigContext.Provider, { value: bigmi.current.config, children: children }) }));
};
//# sourceMappingURL=UTXOBaseProvider.js.map