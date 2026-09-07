import type { TokenAmount } from '../types/token.js';
export declare const useTokenPrice: (chainId?: number, token?: TokenAmount) => {
    price: string;
    isLoading: boolean;
};
