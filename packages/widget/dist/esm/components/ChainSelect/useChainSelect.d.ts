import type { EVMChain } from '@de1/widget-sdk';
import type { FormType } from '../../stores/form/types.js';
export declare const useChainSelect: (formType: FormType) => {
    chainOrder: number[];
    chains: import("@de1/widget-sdk").ExtendedChain[];
    getChains: () => EVMChain[];
    isLoading: boolean;
    setChainOrder: (chainId: number, type: FormType) => void;
    setCurrentChain: (chainId: number) => void;
};
