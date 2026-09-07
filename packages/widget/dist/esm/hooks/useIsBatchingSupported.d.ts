import type { ExtendedChain } from '@de1/widget-sdk';
export declare function useIsBatchingSupported(chain?: ExtendedChain, address?: string): {
    isBatchingSupported: boolean;
    isBatchingSupportedLoading: boolean;
};
