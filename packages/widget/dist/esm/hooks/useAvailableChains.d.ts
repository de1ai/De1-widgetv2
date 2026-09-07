import type { ExtendedChain } from '@de1/widget-sdk';
import { ChainType } from '@de1/widget-sdk';
export type GetChainById = (chainId?: number, chains?: ExtendedChain[]) => ExtendedChain | undefined;
export declare const useAvailableChains: (chainTypes?: ChainType[]) => {
    chains: ExtendedChain[];
    getChainById: GetChainById;
    isLoading: boolean;
};
