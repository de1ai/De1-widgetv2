import { WalletAdapterProps } from '@solana/wallet-adapter-base';
import { Connection } from '@solana/web3.js';
import { WalletClient } from 'viem';
import { Currency } from '../constants/index.js';
import { Quote } from '../registry.js';
import { BaseSwapAdapter, Chain, NormalizedQuote, NormalizedTxResponse, QuoteParams, SwapStatus } from './BaseSwapAdapter.js';
export declare class LifiAdapter extends BaseSwapAdapter {
    constructor();
    getName(): string;
    getIcon(): string;
    getSupportedChains(): Chain[];
    getSupportedTokens(_sourceChain: Chain, _destChain: Chain): Currency[];
    getQuote(params: QuoteParams): Promise<NormalizedQuote>;
    executeSwap({ quote }: Quote, walletClient: WalletClient, _nearWalletClient?: any, _sendBtcFn?: (params: {
        recipient: string;
        amount: string | number;
    }) => Promise<string>, sendTransaction?: WalletAdapterProps['sendTransaction'], connection?: Connection): Promise<NormalizedTxResponse>;
    getTransactionStatus(p: NormalizedTxResponse): Promise<SwapStatus>;
    private buildRoutesRequest;
    private selectBestRoute;
    private aggregateRouteFees;
    private getUnavailableRoutesMessage;
    private resolveStepTransaction;
    private executeEvmRoute;
    private executeSolanaSwap;
    private executeBitcoinSwap;
    private toLifiChainId;
    private toLifiTokenAddress;
    private convertHexToBase64;
    private extractSignedPsbt;
}
