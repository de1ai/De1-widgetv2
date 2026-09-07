interface Asset {
    address: string;
    symbol: string;
    decimals: number;
    name: string;
    icon?: string;
    chainId: number;
    chain?: string;
}
interface CrossStatusParams {
    requestId: string;
}
interface SwapParams {
    fromMsg: Asset;
    toMsg: Asset;
    inAmount: string;
    slippage_tolerance: string | number;
    account: string;
    receiver?: string;
}
interface BuildBridgeDataParams {
    account: string;
    route: any;
    toMiddlewareRoute?: any;
    swapResult?: any;
    receiver: string;
}
interface BuildSolanaBridgeDataParams {
    account: string;
    route: any;
    receiver: string;
}
export declare class DebridgeService {
    private static readonly DEBRIDGE_API_URL;
    static readonly DEBRIDGE_QUOTE_URL = "https://deswap.debridge.finance/v1.0";
    private static readonly REFERRAL_CODE;
    private static readonly STATUS_MAP;
    /**
     * Map Debridge status code to internal unified status code
     * @param status Debridge return status string or number
     * @returns Internal status code ('2': failure, '3': pending, '5': success) or '2' (unknown/failure)
     */
    private static mapStatus;
    /**
     * Check if address is native token address
     * @param tokenAddress Token address
     * @returns Whether it's a native token
     */
    private static isNativeToken;
    /**
     * Get native token information for specified chain
     * @param chainId Chain ID
     * @returns Native token Asset object or undefined
     */
    private static getNativeTokenInfo;
    /**
     * Get Debridge internal chain ID
     * @param chainId Original chain ID
     * @returns Debridge chain ID string
     */
    private static getDebridgeChainId;
    /**
     * Get Debridge token address for specified asset
     * @param asset Token Asset object
     * @returns Debridge token address string
     */
    private static getDebridgeTokenAddress;
    static getCrossAmount(params: {
        amt: string;
    }): Promise<{
        crossOutAmount: string;
    }>;
    static minSend(params: any): Promise<number>;
    /**
     * Query Debridge cross-chain transaction status
     * @param params Contains requestId
     * @returns Transaction status and destination chain hash
     */
    static getCrossStatus(params: CrossStatusParams): Promise<{
        code: number;
        data: {
            status: string;
            destHash?: string;
        };
    }>;
    /**
     * Get Debridge cross-chain quote (Swap U Then Cross)
     * @param params Contains source/target information, amount, slippage, etc.
     * @returns Contains object with fields needed to build Route or null (failure)
     */
    static swapUThenCross(params: SwapParams): Promise<any | null>;
    /**
     * Build Debridge EVM cross-chain transaction data (Completed in swapUThenCross)
     * @param params Contains account, route, receiver, etc.
     * @returns Returns transactionRequest data from swapUThenCross
     */
    static buildBridgeData(params: BuildBridgeDataParams): Promise<any | null>;
    /**
     * Build Debridge transaction data from Solana to EVM
     * @param params Contains account, route, receiver
     * @returns Solana transaction object { code, data: { from, to, data, value } } or null
     */
    static buildSolanaBridgeData(params: BuildSolanaBridgeDataParams): Promise<{
        code: number;
        data: {
            from: string;
            to: string;
            data: string;
            value: string;
        };
    } | null>;
}
export {};
