import { useContext } from 'react';
import { shallow } from 'zustand/shallow';
import { FormStoreContext } from './FormStoreContext.js';
export function useFormStore(selector, equalityFn = shallow) {
    const useStore = useContext(FormStoreContext);
    if (!useStore) {
        throw new Error('You forgot to wrap your component in <FormStoreProvider>.');
    }
    return useStore(selector, equalityFn);
}
//# sourceMappingURL=useFormStore.js.map