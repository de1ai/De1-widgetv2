import { Currency } from '../constants/index.js';
import { useWalletSelector } from '@near-wallet-selector/react-hook';
import { WalletClient } from 'viem';
import { Quote } from '../registry.js';
import { BaseSwapAdapter, Chain, NearQuoteParams, NormalizedQuote, NormalizedTxResponse, SwapStatus } from './BaseSwapAdapter.js';
export declare const MappingChainIdToBlockChain: Record<string, string>;
export interface NearToken {
    assetId: string;
    decimals: number;
    blockchain: string;
    symbol: string;
    price: number;
    priceUpdatedAt: number;
    contractAddress: string;
    logo: string;
}
export declare class NearIntentsAdapter extends BaseSwapAdapter {
    private nearTokens;
    constructor();
    getName(): string;
    getIcon(): string;
    getSupportedChains(): Chain[];
    getAllSupportedTokens(): Promise<void>;
    getSupportedTokens(_sourceChain: Chain, _destChain: Chain): Currency[];
    getQuote(params: NearQuoteParams): Promise<NormalizedQuote>;
    executeSwap({ quote }: Quote, walletClient: WalletClient, nearWallet?: ReturnType<typeof useWalletSelector>): Promise<NormalizedTxResponse>;
    getTransactionStatus(p: NormalizedTxResponse): Promise<SwapStatus>;
}
