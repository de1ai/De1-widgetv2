import { shallow } from 'zustand/shallow';
import { useFormStore } from './useFormStore.js';
export const useValidation = () => {
    const [isValid, isValidating, errors] = useFormStore((store) => [store.isValid, store.isValidating, store.errors], shallow);
    return {
        isValid,
        isValidating,
        errors,
    };
};
//# sourceMappingURL=useValidation.js.map