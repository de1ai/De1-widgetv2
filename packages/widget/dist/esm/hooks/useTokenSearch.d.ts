import type { TokenAmount } from '../types/token.js';
export declare const useTokenSearch: (chainId?: number, tokenQuery?: string, enabled?: boolean) => {
    token: TokenAmount;
    isLoading: boolean;
};
