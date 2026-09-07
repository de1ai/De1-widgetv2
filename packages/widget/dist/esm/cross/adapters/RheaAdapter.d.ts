import { type useWalletSelector } from '@near-wallet-selector/react-hook';
import { type WalletClient } from 'viem';
import type { Quote } from '../registry.js';
import { BaseSwapAdapter, type Chain, type Currency, type NormalizedQuote, type NormalizedTxResponse, type QuoteParams, type SwapStatus } from './BaseSwapAdapter.js';
export declare class RheaAdapter extends BaseSwapAdapter {
    constructor();
    getName(): string;
    getIcon(): string;
    getSupportedChains(): Chain[];
    getSupportedTokens(_sourceChain: Chain, _destChain: Chain): Currency[];
    getQuote(params: QuoteParams): Promise<NormalizedQuote>;
    private executePreSwap;
    executeSwap({ quote }: Quote, walletClient: WalletClient, nearWallet?: ReturnType<typeof useWalletSelector>): Promise<NormalizedTxResponse>;
    getTransactionStatus(p: NormalizedTxResponse): Promise<SwapStatus>;
}
