import { shallow } from 'zustand/shallow';
import { useChainOrderStore } from './ChainOrderStore.js';
export const useChainOrder = (type) => {
    return useChainOrderStore((state) => [state.chainOrder[type], state.setChain], shallow);
};
//# sourceMappingURL=useChainOrder.js.map