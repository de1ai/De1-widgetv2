import { type Currency } from '../constants/index.js';
import type { WalletClient } from 'viem';
import type { Quote } from '../registry.js';
import { BaseSwapAdapter, type Chain, type EvmQuoteParams, type NormalizedQuote, type NormalizedTxResponse, type SwapStatus } from './BaseSwapAdapter.js';
export declare class MayanAdapter extends BaseSwapAdapter {
    getName(): string;
    getIcon(): string;
    getSupportedChains(): Chain[];
    getSupportedTokens(_sourceChain: Chain, _destChain: Chain): Currency[];
    getQuote(params: EvmQuoteParams): Promise<NormalizedQuote>;
    executeSwap({ quote }: Quote, walletClient: WalletClient): Promise<NormalizedTxResponse>;
    getTransactionStatus(p: NormalizedTxResponse): Promise<SwapStatus>;
}
