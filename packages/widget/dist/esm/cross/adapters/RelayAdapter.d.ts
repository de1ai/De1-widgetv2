import { type WalletClient } from 'viem';
import type { Currency } from '../constants/index.js';
import type { Quote } from '../registry.js';
import { BaseSwapAdapter, type Chain, type NormalizedQuote, type NormalizedTxResponse, type QuoteParams, type SwapStatus } from './BaseSwapAdapter.js';
export declare class RelayAdapter extends BaseSwapAdapter {
    constructor();
    getName(): string;
    getIcon(): string;
    getSupportedChains(): Chain[];
    getSupportedTokens(_sourceChain: Chain, _destChain: Chain): Currency[];
    getQuote(params: QuoteParams): Promise<NormalizedQuote>;
    executeSwap({ quote }: Quote, walletClient: WalletClient): Promise<NormalizedTxResponse>;
    getTransactionStatus(p: NormalizedTxResponse): Promise<SwapStatus>;
}
