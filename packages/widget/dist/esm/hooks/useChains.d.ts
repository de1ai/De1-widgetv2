import type { ChainType } from '@de1/widget-sdk';
import type { FormType } from '../stores/form/types.js';
export declare const useChains: (type?: FormType, chainTypes?: ChainType[]) => {
    chains: import("@de1/widget-sdk").ExtendedChain[];
    getChainById: import("./useAvailableChains.js").GetChainById;
    isLoading: boolean;
};
