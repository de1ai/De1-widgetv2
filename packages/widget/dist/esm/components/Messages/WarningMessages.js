import { jsx as _jsx } from "react/jsx-runtime";
import { Collapse } from '@mui/material';
import { AccountNotDeployedMessage } from './AccountNotDeployedMessage.js';
import { FundsSufficiencyMessage } from './FundsSufficiencyMessage.js';
import { GasSufficiencyMessage } from './GasSufficiencyMessage.js';
import { GasSufficiencyMessageBridge } from './GasSufficiencyMessageBridge.js';
import { PriceImpactHighMessage } from './PriceImpactHighMessage.js';
import { ServerErrorMessage } from './ServeErrorMessage.js';
import { ToAddressRequiredMessage } from './ToAddressRequiredMessage.js';
import { useMessageQueue, useStorePriceImpactAcknowledged, } from './useMessageQueue.js';
export const WarningMessages = ({ route, allowInteraction, ...props }) => {
    const { messages, hasMessages } = useMessageQueue(route, allowInteraction);
    const setPriceImpactAcknowledged = useStorePriceImpactAcknowledged((state) => state.setPriceImpactAcknowledged);
    const getMessage = () => {
        switch (messages[0]?.id) {
            case 'INSUFFICIENT_FUNDS':
                return _jsx(FundsSufficiencyMessage, { ...props });
            case 'INSUFFICIENT_GAS':
                return (_jsx(GasSufficiencyMessage, { insufficientGas: messages[0].props?.insufficientGas, ...props }));
            case 'INSUFFICIENT_BRIDGE':
                return _jsx(GasSufficiencyMessageBridge, { ...props });
            case 'ACCOUNT_NOT_DEPLOYED':
                return _jsx(AccountNotDeployedMessage, { ...props });
            case 'PRICE_IMPACT_HIGH':
                return (_jsx(PriceImpactHighMessage, { onAcknowledge: (e) => {
                        setPriceImpactAcknowledged(e);
                    }, ...props }));
            case 'TO_ADDRESS_REQUIRED':
                // return <ToAddressRequiredMessage {...props} />
                const fromChainId = route?.fromChainId;
                const toChainId = route?.toChainId;
                if (fromChainId && toChainId && fromChainId !== toChainId) {
                    return _jsx(ToAddressRequiredMessage, { ...props });
                }
                return null;
            case 'SERVER_ERROR':
                return (_jsx(ServerErrorMessage, { errorMsg: messages[0].props?.errorMsg, ...props }));
            default:
                return null;
        }
    };
    return (_jsx(Collapse, { in: hasMessages, timeout: 225, unmountOnExit: true, mountOnEnter: true, children: getMessage() }));
};
//# sourceMappingURL=WarningMessages.js.map