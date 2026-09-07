import { useMemo } from 'react';
import { create } from 'zustand';
import { useFromTokenSufficiency } from '../../hooks/useFromTokenSufficiency.js';
import { useGasSufficiency } from '../../hooks/useGasSufficiency.js';
import { useGasSufficiencyBridge } from '../../hooks/useGasSufficiencyBridge.js';
import { useIsCompatibleDestinationAccount } from '../../hooks/useIsCompatibleDestinationAccount.js';
import { usePriceImpact } from '../../hooks/usePriceImpact.js';
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js';
import { useServerErrorStore } from '../../stores/useServerErrorStore.js';
// TODO: re-enable before production – allows continuing without wallet balance
const DISABLE_BALANCE_CHECKS = false;
export const useStorePriceImpactAcknowledged = create((set) => ({
    priceImpactAcknowledged: false,
    setPriceImpactAcknowledged: (v) => set(() => {
        return {
            priceImpactAcknowledged: v,
        };
    }),
}));
export const useMessageQueue = (route, allowInteraction) => {
    const { requiredToAddress, toAddress } = useToAddressRequirements(route);
    const { isCompatibleDestinationAccount, isLoading: isCompatibleDestinationAccountLoading, } = useIsCompatibleDestinationAccount(route);
    const { insufficientFromToken, isLoading: isFromTokenSufficiencyLoading } = useFromTokenSufficiency(route);
    const { insufficientBridge, isLoading: isGasSufficiencyBridgeLoading } = useGasSufficiencyBridge(route);
    const { insufficientGas, isLoading: isGasSufficiencyLoading } = useGasSufficiency(route);
    const { priceImpact } = usePriceImpact(route);
    const serverErrorMsg = useServerErrorStore((s) => s.error);
    const messageQueue = useMemo(() => {
        const queue = [];
        if (!DISABLE_BALANCE_CHECKS && insufficientFromToken) {
            queue.push({
                id: 'INSUFFICIENT_FUNDS',
                priority: 1,
            });
        }
        if (priceImpact <= -0.3) {
            queue.push({
                id: 'PRICE_IMPACT_HIGH',
                priority: 1,
            });
        }
        if (!DISABLE_BALANCE_CHECKS && insufficientGas?.length) {
            queue.push({
                id: 'INSUFFICIENT_GAS',
                priority: 2,
                props: { insufficientGas },
            });
        }
        if (!DISABLE_BALANCE_CHECKS && insufficientBridge) {
            queue.push({
                id: 'INSUFFICIENT_BRIDGE',
                priority: 2,
                props: { insufficientBridge },
            });
        }
        if (!isCompatibleDestinationAccount && !allowInteraction) {
            queue.push({
                id: 'ACCOUNT_NOT_DEPLOYED',
                priority: 3,
            });
        }
        if (requiredToAddress && !toAddress) {
            queue.push({
                id: 'TO_ADDRESS_REQUIRED',
                priority: 4,
            });
        }
        if (serverErrorMsg) {
            queue.push({
                id: 'SERVER_ERROR',
                priority: 0,
                props: { errorMsg: serverErrorMsg },
            });
        }
        return queue.sort((a, b) => a.priority - b.priority);
    }, [
        allowInteraction,
        insufficientFromToken,
        insufficientGas,
        insufficientBridge,
        isCompatibleDestinationAccount,
        requiredToAddress,
        toAddress,
        priceImpact,
        serverErrorMsg
    ]);
    return {
        messages: messageQueue,
        hasMessages: messageQueue.length > 0,
        isLoading: isGasSufficiencyLoading ||
            isFromTokenSufficiencyLoading ||
            isCompatibleDestinationAccountLoading ||
            isGasSufficiencyBridgeLoading,
    };
};
//# sourceMappingURL=useMessageQueue.js.map