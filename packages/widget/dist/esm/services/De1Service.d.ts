import type { TokenAmount } from '../types/token.js';
export declare class De1Service {
    private static readonly API_V3_URL;
    private static readonly API_V4_URL;
    static solanaRpcUrl: string;
    private static readonly CHAIN_ID_MAP;
    private static getChainName;
    private static getApiUrl;
    private static getSolanaAddress;
    private static normalizeTokenAddress;
    private static createTokenSource;
    private static mapToken;
    private static fetchTokenList;
    private static mergeTokenLists;
    private static parseApiResponse;
    static getQuote(params: {
        chain: string;
        inTokenAddress: string;
        inTokenSymbol: string;
        outTokenAddress: string;
        outTokenSymbol: string;
        amount: string;
        slippage?: string;
        gasPrice?: string;
        disabledDexIds?: string;
        enabledDexIds?: string;
        referrer?: string;
        account?: string;
        inTokenDecimals?: number;
        outTokenDecimals?: number;
    }): Promise<any>;
    static getSwapQuote(params: {
        chain: string;
        inTokenAddress: string;
        inTokenSymbol: string;
        outTokenAddress: string;
        outTokenSymbol: string;
        amount: string;
        account: string;
        slippage?: string;
        gasPrice?: string;
        disabledDexIds?: string;
        enabledDexIds?: string;
        referrer?: string;
        referrerFee?: string;
        referrerFeeShare?: string;
        inTokenDecimals?: number;
    }): Promise<any>;
    static getTokenList(chain: string, useRwaTokenList?: boolean): Promise<TokenAmount[]>;
    static getDexList(chain: string): Promise<any>;
    static getGasPrice(chain: string): Promise<any>;
    static getTokenInfo(chain: string, tokenAddress: string): Promise<{
        address: any;
        symbol: any;
        decimals: any;
        name: any;
        logoURI: any;
        priceUSD: any;
        chainId: number;
        amount: bigint;
        featured: boolean;
        popular: boolean;
    }>;
    /**
     * Get prices for specified tokens
     * @param chain chain name, e.g. 'arbitrum'
     * @param tokenAddresses array of token addresses
     * @returns Promise<Record<string, string>> returns an object where key is token address and value is price
     */
    static getTokensPrice(chain: string, tokenAddresses: string[]): Promise<Record<string, string>>;
    static getRpcUrl(): Promise<string>;
}
