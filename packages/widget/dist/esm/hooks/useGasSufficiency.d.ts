import type { EVMChain, RouteExtended, Token } from '@de1/widget-sdk';
export interface GasSufficiency {
    gasAmount: bigint;
    tokenAmount?: bigint;
    insufficientAmount?: bigint;
    insufficient?: boolean;
    token: Token;
    chain?: EVMChain;
}
export declare const useGasSufficiency: (route?: RouteExtended) => {
    insufficientGas: GasSufficiency[];
    isLoading: boolean;
};
