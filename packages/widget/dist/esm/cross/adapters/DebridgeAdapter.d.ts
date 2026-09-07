import type { useWalletSelector } from '@near-wallet-selector/react-hook';
import type { WalletAdapterProps } from '@solana/wallet-adapter-base';
import { type Connection } from '@solana/web3.js';
import { type WalletClient } from 'viem';
import type { Currency } from '../constants/index.js';
import type { Quote } from '../registry.js';
import { BaseSwapAdapter, type Chain, type NormalizedQuote, type NormalizedTxResponse, type QuoteParams, type SwapStatus } from './BaseSwapAdapter.js';
export declare class DeBridgeAdapter extends BaseSwapAdapter {
    constructor();
    getName(): string;
    getIcon(): string;
    getSupportedChains(): Chain[];
    getSupportedTokens(_sourceChain: Chain, _destChain: Chain): Currency[];
    getQuote(params: QuoteParams): Promise<NormalizedQuote>;
    executeSwap({ quote }: Quote, walletClient: WalletClient, _nearWallet?: ReturnType<typeof useWalletSelector>, _sendBtcFn?: (params: {
        recipient: string;
        amount: string | number;
    }) => Promise<string>, sendSolanaFn?: WalletAdapterProps['sendTransaction'], solanaConnection?: Connection): Promise<NormalizedTxResponse>;
    getTransactionStatus(p: NormalizedTxResponse): Promise<SwapStatus>;
}
