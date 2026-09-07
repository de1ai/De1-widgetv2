import type { TokenAmount } from '../types/token.js';
export declare const isNativeToken: (token: string) => boolean;
export declare const useTokens: (selectedChainId?: number) => {
    tokens: TokenAmount[];
    featuredTokens: TokenAmount[];
    popularTokens: TokenAmount[];
    chain: import("@de1/widget-sdk").ExtendedChain;
    isLoading: boolean;
};
