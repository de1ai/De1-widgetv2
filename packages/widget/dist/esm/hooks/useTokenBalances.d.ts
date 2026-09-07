import type { TokenAmount } from '../types/token.js';
export declare const useTokenBalances: (selectedChainId?: number) => {
    tokens: TokenAmount[];
    tokensWithBalance: TokenAmount[];
    featuredTokens: TokenAmount[];
    popularTokens: TokenAmount[];
    chain: import("@de1/widget-sdk").ExtendedChain;
    isLoading: boolean;
    isBalanceLoading: boolean;
    refetch: () => Promise<void>;
};
