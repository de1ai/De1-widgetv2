import { jsx as _jsx } from "react/jsx-runtime";
import { ChainType } from '@de1/widget-sdk';
import { ConnectionContext } from '@solana/wallet-adapter-react';
import { useContext } from 'react';
import { isItemAllowed } from '../../utils/item.js';
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js';
import { SVMBaseProvider } from './SVMBaseProvider.js';
import { SVMExternalContext } from './SVMExternalContext.js';
export function useInSolanaContext() {
    const { chains } = useWidgetConfig();
    const context = useContext(ConnectionContext);
    return (Boolean(context?.connection) && isItemAllowed(ChainType.SVM, chains?.types));
}
export const SVMProvider = ({ children }) => {
    const inSolanaContext = useInSolanaContext();
    return inSolanaContext ? (_jsx(SVMExternalContext.Provider, { value: inSolanaContext, children: children })) : (_jsx(SVMBaseProvider, { children: children }));
};
//# sourceMappingURL=SVMProvider.js.map