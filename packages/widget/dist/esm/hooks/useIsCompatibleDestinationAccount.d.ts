import type { RouteExtended } from '@de1/widget-sdk';
export declare const useIsCompatibleDestinationAccount: (route?: RouteExtended) => {
    isCompatibleDestinationAccount: boolean;
    isFromContractAddress: boolean;
    isToContractAddress: boolean;
    isLoading: boolean;
    isFetched: boolean;
};
