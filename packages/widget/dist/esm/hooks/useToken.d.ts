import type { TokenAmount } from '../types/token.js';
export declare const useToken: (chainId?: number, tokenAddress?: string) => {
    token: TokenAmount;
    isLoading: boolean;
};
