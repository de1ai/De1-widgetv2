import type { RouteExtended } from '@de1/widget-sdk';
export declare const useToAddressRequirements: (route?: RouteExtended) => {
    requiredToAddress: boolean;
    requiredToChainType: import("@de1/widget-sdk").ChainType;
    toAddress: string;
};
