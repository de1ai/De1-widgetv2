import { jsx as _jsx } from "react/jsx-runtime";
import { BaseTransactionButton } from '../../components/BaseTransactionButton/BaseTransactionButton.js';
import { useMessageQueue, useStorePriceImpactAcknowledged, } from '../../components/Messages/useMessageQueue.js';
export const StartTransactionButton = ({ onClick, route, text, loading, }) => {
    const { messages, isLoading } = useMessageQueue(route);
    const priceImpactAcknowledged = useStorePriceImpactAcknowledged((state) => state.priceImpactAcknowledged);
    let hasMessages = messages.length > 0;
    if (messages.length > 0) {
        const message = messages.find((message) => message.id === 'PRICE_IMPACT_HIGH');
        if (message && priceImpactAcknowledged) {
            hasMessages = false;
        }
    }
    return (_jsx(BaseTransactionButton, { onClick: onClick, text: text, disabled: hasMessages, loading: isLoading || loading }));
};
//# sourceMappingURL=StartTransactionButton.js.map