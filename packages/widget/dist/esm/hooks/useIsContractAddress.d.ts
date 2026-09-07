import { ChainType } from '@de1/widget-sdk';
export declare const useIsContractAddress: (address?: string, chainId?: number, chainType?: ChainType) => {
    isContractAddress: boolean;
    contractCode: `0x${string}`;
    isLoading: boolean;
    isFetched: boolean;
};
