import type { useWalletSelector } from '@near-wallet-selector/react-hook';
import { ChainId } from '@de1/widget-sdk';
import type { WalletAdapterProps } from '@solana/wallet-adapter-base';
import type { Connection } from '@solana/web3.js';
import type { WalletClient } from 'viem';
import type { Currency as EvmCurrency, NearToken, SolanaToken } from '../constants/index.js';
import type { Quote } from '../registry.js';
export declare enum NonEvmChain {
    Near = 20000000000006,
    Bitcoin = 20000000000001,
    Solana = 1151111081099710
}
export declare enum NewEvmChain {
    Plasma = 9745,
    Monad = 143
}
export declare const BitcoinToken: {
    name: string;
    symbol: string;
    decimals: number;
    logo: string;
};
export type Chain = ChainId | NonEvmChain | NewEvmChain;
export type Currency = EvmCurrency | NearToken | typeof BitcoinToken | SolanaToken;
export declare const NonEvmChainInfo: {
    [key in NonEvmChain]: {
        name: string;
        icon: string;
    };
};
export declare const NewEvmChainInfo: {
    [key in NewEvmChain]: {
        name: string;
        icon: string;
    };
};
export declare const NOT_SUPPORTED_CHAINS_PRICE_SERVICE: (ChainId | NonEvmChain | NewEvmChain)[];
export interface QuoteParams {
    feeBps: number;
    fromChain: Chain;
    toChain: Chain;
    fromToken: Currency;
    toToken: Currency;
    amount: string;
    slippage: number;
    walletClient?: WalletClient;
    publicClient?: any;
    tokenInUsd: number;
    tokenOutUsd: number;
    sender: string;
    recipient: string;
    publicKey?: string;
    isNative: boolean;
}
export interface EvmQuoteParams extends QuoteParams {
    fromToken: EvmCurrency;
    toToken: EvmCurrency;
}
export interface NearQuoteParams extends QuoteParams {
}
export interface NormalizedQuote {
    quoteParams: QuoteParams;
    outputAmount: bigint;
    formattedOutputAmount: string;
    inputUsd: number;
    outputUsd: number;
    rate: number;
    timeEstimate: number;
    priceImpact: number;
    gasFeeUsd: number;
    contractAddress: string;
    rawQuote: any;
    protocolFee: string | number;
    protocolFeeString?: string;
    platformFeePercent: number;
}
export interface NormalizedTxResponse {
    id: string;
    sourceTxHash: string;
    sender: string;
    adapter: string;
    sourceChain: Chain;
    targetChain: Chain;
    inputAmount: string;
    outputAmount: string;
    sourceToken: Currency;
    targetToken: Currency;
    targetTxHash?: string;
    timestamp: number;
    status?: 'Processing' | 'Success' | 'Failed' | 'Refunded';
    /** Pegasus: tx hash reported via POST /swap/:id/txhash — no further status polling */
    txHashSubmitted?: boolean;
}
export interface SwapStatus {
    txHash: string;
    status: 'Processing' | 'Success' | 'Failed' | 'Refunded';
}
export interface SwapProvider {
    getName(): string;
    getIcon(): string;
    getSupportedChains(): Chain[];
    getSupportedTokens(sourceChain: Chain, destChain: Chain): Currency[];
    getQuote(params: QuoteParams): Promise<NormalizedQuote>;
    executeSwap(quote: Quote, walletClient: WalletClient, nearWallet?: ReturnType<typeof useWalletSelector>, sendBtcFn?: (params: {
        recipient: string;
        amount: string | number;
    }) => Promise<string>, sendSolanaTransaction?: WalletAdapterProps['sendTransaction'], connection?: Connection): Promise<NormalizedTxResponse>;
    getTransactionStatus(p: NormalizedTxResponse): Promise<SwapStatus>;
}
export declare abstract class BaseSwapAdapter implements SwapProvider {
    abstract getName(): string;
    abstract getIcon(): string;
    abstract getSupportedChains(): Chain[];
    abstract getSupportedTokens(sourceChain: Chain, destChain: Chain): Currency[];
    abstract getQuote(params: QuoteParams): Promise<NormalizedQuote>;
    abstract executeSwap(params: Quote, walletClient: WalletClient, nearWallet?: ReturnType<typeof useWalletSelector>): Promise<NormalizedTxResponse>;
    abstract getTransactionStatus(p: NormalizedTxResponse): Promise<SwapStatus>;
    protected handleError(error: any): never;
}
