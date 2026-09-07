import type { FeeCost, GasCost, RouteExtended, Token } from '@de1/widget-sdk';
export interface FeesBreakdown {
    amount: bigint;
    amountUSD: number;
    token: Token;
}
export declare const getAccumulatedFeeCostsBreakdown: (route: RouteExtended, included?: boolean) => {
    gasCosts: FeesBreakdown[];
    feeCosts: FeesBreakdown[];
    gasCostUSD: number;
    feeCostUSD: number;
    combinedFeesUSD: number;
};
export declare const getGasCostsBreakdown: (route: RouteExtended) => FeesBreakdown[];
export declare const getFeeCostsBreakdown: (route: RouteExtended, included?: boolean) => FeesBreakdown[];
export declare const getStepFeeCostsBreakdown: (feeCosts: FeeCost[] | GasCost[]) => FeesBreakdown;
