import { Currency } from '../constants/index.js';
import { useWalletSelector } from '@near-wallet-selector/react-hook';
import { WalletAdapterProps } from '@solana/wallet-adapter-base';
import { Connection } from '@solana/web3.js';
import { WalletClient } from 'viem';
import { Quote } from '../registry.js';
import { BaseSwapAdapter, Chain, NormalizedQuote, NormalizedTxResponse, QuoteParams, SwapStatus } from './BaseSwapAdapter.js';
export declare class OrbiterAdapter extends BaseSwapAdapter {
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
