import { Currency } from '../constants/index.js';
import { WalletClient } from 'viem';
import { Quote } from '../registry.js';
import { BaseSwapAdapter, Chain, NormalizedQuote, NormalizedTxResponse, QuoteParams, SwapStatus } from './BaseSwapAdapter.js';
export declare class OptimexAdapter extends BaseSwapAdapter {
    private tokens;
    constructor();
    private getTokens;
    getName(): string;
    getIcon(): string;
    getSupportedChains(): Chain[];
    getSupportedTokens(_sourceChain: Chain, _destChain: Chain): Currency[];
    getQuote(params: QuoteParams): Promise<NormalizedQuote>;
    executeSwap({ quote }: Quote, walletClient: WalletClient, _nearWallet: any, sendBtcFn?: (params: {
        recipient: string;
        amount: string | number;
    }) => Promise<string>): Promise<NormalizedTxResponse>;
    getTransactionStatus(p: NormalizedTxResponse): Promise<SwapStatus>;
}
