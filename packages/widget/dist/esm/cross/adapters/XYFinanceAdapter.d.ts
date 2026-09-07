import { Currency } from '../constants/index.js';
import { WalletClient } from 'viem';
import { Quote } from '../registry.js';
import { BaseSwapAdapter, Chain, EvmQuoteParams, NormalizedQuote, NormalizedTxResponse, SwapStatus } from './BaseSwapAdapter.js';
export declare class XYFinanceAdapter extends BaseSwapAdapter {
    constructor();
    getName(): string;
    getIcon(): string;
    getSupportedChains(): Chain[];
    getSupportedTokens(_sourceChain: Chain, _destChain: Chain): Currency[];
    getQuote(params: EvmQuoteParams): Promise<NormalizedQuote>;
    executeSwap({ quote }: Quote, walletClient: WalletClient): Promise<NormalizedTxResponse>;
    getTransactionStatus(p: NormalizedTxResponse): Promise<SwapStatus>;
}
