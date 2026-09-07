import type { RouteExtended, Token } from '@de1/widget-sdk';
interface GetPriceImpractProps {
    fromToken: Token;
    toToken: Token;
    fromAmount?: bigint;
    toAmount?: bigint;
}
/** Parse De¹ Exchange `price_impact` (e.g. `"0.06%"`) to decimal for i18n percent formatter */
export declare function parseApiPriceImpact(value?: string | number | null): number | undefined;
type RouteWithApiPriceImpact = RouteExtended & {
    price_impact?: string | number;
    priceImpact?: string | number;
};
export declare function resolveRoutePriceImpact(route: RouteWithApiPriceImpact): number;
export declare const getPriceImpact: ({ fromToken, toToken, fromAmount, toAmount, }: GetPriceImpractProps) => number;
export {};
