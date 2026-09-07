import { shallow } from 'zustand/shallow';
import { useFormStore } from './useFormStore.js';
export const useValidationActions = () => {
    const actions = useFormStore((store) => ({
        addFieldValidation: store.addFieldValidation,
        triggerFieldValidation: store.triggerFieldValidation,
        clearErrors: store.clearErrors,
    }), shallow);
    return actions;
};
//# sourceMappingURL=useValidationActions.js.map