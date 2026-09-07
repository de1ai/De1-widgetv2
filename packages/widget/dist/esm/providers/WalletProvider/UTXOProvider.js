import { jsx as _jsx } from "react/jsx-runtime";
import { BigmiContext } from '@bigmi/react';
import { WalletBigmiConfigContext } from '@de1/wallet-management';
import { ChainType } from '@de1/widget-sdk';
import { useContext } from 'react';
import { isItemAllowed } from '../../utils/item.js';
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js';
import { UTXOBaseProvider } from './UTXOBaseProvider.js';
import { UTXOExternalContext } from './UTXOExternalContext.js';
export function useInBigmiContext() {
    const { chains } = useWidgetConfig();
    const context = useContext(BigmiContext);
    return Boolean(context) && isItemAllowed(ChainType.UTXO, chains?.types);
}
export const UTXOProvider = ({ children }) => {
    const bigmiConfig = useContext(BigmiContext);
    const inBigmiContext = useInBigmiContext();
    return inBigmiContext ? (_jsx(WalletBigmiConfigContext.Provider, { value: bigmiConfig, children: _jsx(UTXOExternalContext.Provider, { value: inBigmiContext, children: children }) })) : (_jsx(UTXOBaseProvider, { children: children }));
};
//# sourceMappingURL=UTXOProvider.js.map