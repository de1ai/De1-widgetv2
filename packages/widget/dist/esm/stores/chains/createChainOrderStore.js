import { persist } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';
export const maxChainsToOrder = 9;
export const maxChainsToShow = 10;
const defaultChainState = {
    from: [],
    to: [],
};
export const createChainOrderStore = ({ namePrefix }) => createWithEqualityFn(persist((set, get) => ({
    chainOrder: defaultChainState,
    availableChains: defaultChainState,
    initializeChains: (chainIds, type) => {
        set((state) => {
            const chainOrder = state.chainOrder[type].filter((chainId) => chainIds.includes(chainId));
            const chainsToAdd = chainIds.filter((chainId) => !chainOrder.includes(chainId));
            if (chainOrder.length === maxChainsToOrder || !chainsToAdd.length) {
                return {
                    availableChains: {
                        ...state.availableChains,
                        [type]: chainIds,
                    },
                    chainOrder: {
                        ...state.chainOrder,
                        [type]: chainOrder,
                    },
                };
            }
            const chainsToAddLength = maxChainsToOrder - chainOrder.length;
            for (let index = 0; index < chainsToAddLength; index++) {
                chainOrder.push(chainsToAdd[index]);
            }
            return {
                availableChains: {
                    ...state.availableChains,
                    [type]: chainIds,
                },
                chainOrder: {
                    ...state.chainOrder,
                    [type]: chainOrder,
                },
            };
        });
        return get().chainOrder[type];
    },
    setChain: (chainId, type) => {
        const state = get();
        if (state.chainOrder[type].includes(chainId) ||
            !state.availableChains[type].includes(chainId)) {
            return;
        }
        set((state) => {
            const chainOrder = state.chainOrder[type].slice();
            chainOrder.unshift(chainId);
            if (chainOrder.length > maxChainsToOrder) {
                chainOrder.pop();
            }
            return {
                chainOrder: {
                    ...state.chainOrder,
                    [type]: chainOrder,
                },
            };
        });
    },
}), {
    name: `${namePrefix || 'de1'}-widget-chains-order`,
    version: 2,
    partialize: (state) => ({ chainOrder: state?.chainOrder }),
}), Object.is);
//# sourceMappingURL=createChainOrderStore.js.map