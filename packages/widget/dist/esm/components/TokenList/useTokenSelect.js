import { useCallback } from 'react';
import { useToAddressAutoPopulate } from '../../hooks/useToAddressAutoPopulate.js';
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { useChainOrderStoreContext } from '../../stores/chains/ChainOrderStore.js';
import { FormKeyHelper } from '../../stores/form/types.js';
import { useFieldActions } from '../../stores/form/useFieldActions.js';
import { useFieldController } from '../../stores/form/useFieldController.js';
import { WidgetEvent } from '../../types/events.js';
export const useTokenSelect = (formType, onClick) => {
    const { subvariant, disabledUI } = useWidgetConfig();
    const emitter = useWidgetEvents();
    const { setFieldValue, getFieldValues } = useFieldActions();
    const autoPopulateToAddress = useToAddressAutoPopulate();
    const chainOrderStore = useChainOrderStoreContext();
    const tokenKey = FormKeyHelper.getTokenKey(formType);
    const { onChange } = useFieldController({ name: tokenKey });
    return useCallback((tokenAddress, chainId) => {
        onChange(tokenAddress);
        const selectedChainId = chainId ?? getFieldValues(FormKeyHelper.getChainKey(formType))[0];
        // Set chain again to trigger URL builder update
        setFieldValue(FormKeyHelper.getChainKey(formType), selectedChainId, {
            isDirty: true,
            isTouched: true,
        });
        const amountKey = FormKeyHelper.getAmountKey(formType);
        if (!disabledUI?.includes(amountKey)) {
            setFieldValue(amountKey, '');
        }
        const oppositeFormType = formType === 'from' ? 'to' : 'from';
        const [selectedOppositeTokenAddress, selectedOppositeChainId, selectedToAddress,] = getFieldValues(FormKeyHelper.getTokenKey(oppositeFormType), FormKeyHelper.getChainKey(oppositeFormType), 'toAddress');
        // TODO: remove when we enable same chain/token transfers
        if (selectedOppositeTokenAddress === tokenAddress &&
            selectedOppositeChainId === selectedChainId &&
            subvariant !== 'custom') {
            setFieldValue(FormKeyHelper.getTokenKey(oppositeFormType), '', {
                isDirty: true,
                isTouched: true,
            });
        }
        // If no opposite token is selected, synchronize the opposite chain to match the currently selected chain
        const { setChain } = chainOrderStore.getState();
        if (!selectedOppositeTokenAddress && selectedChainId) {
            setFieldValue(FormKeyHelper.getChainKey(oppositeFormType), selectedChainId, {
                isDirty: true,
                isTouched: true,
            });
            setChain(selectedChainId, oppositeFormType);
        }
        // Automatically populate toAddress field if bridging across ecosystems and compatible wallet is connected
        autoPopulateToAddress({
            formType,
            selectedToAddress,
            selectedChainId,
            selectedOppositeChainId,
            selectedOppositeTokenAddress,
        });
        const eventToEmit = formType === 'from'
            ? WidgetEvent.SourceChainTokenSelected
            : WidgetEvent.DestinationChainTokenSelected;
        if (selectedChainId) {
            emitter.emit(eventToEmit, {
                chainId: selectedChainId,
                tokenAddress,
            });
        }
        onClick?.();
    }, [
        autoPopulateToAddress,
        chainOrderStore,
        disabledUI,
        emitter,
        formType,
        getFieldValues,
        onChange,
        onClick,
        setFieldValue,
        subvariant,
    ]);
};
//# sourceMappingURL=useTokenSelect.js.map