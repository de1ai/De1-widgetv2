import { type WalletClient } from 'viem';
import type { Quote } from '../registry.js';
import { BaseSwapAdapter, type Chain, type NormalizedQuote, type NormalizedTxResponse, type QuoteParams, type SwapStatus } from './BaseSwapAdapter.js';
export declare class PegasusAdapter extends BaseSwapAdapter {
    private chainsCache;
    private tokensCache;
    getName(): string;
    getIcon(): string;
    getSupportedChains(): Chain[];
    getSupportedTokens(_sourceChain: Chain, _destChain: Chain): any[];
    private pegasusRequest;
    private getChains;
    private getTokensForChain;
    private resolvePegasusChainData;
    private getChainAssets;
    private toPegasusChain;
    private resolvePegasusToken;
    private selectBestRoute;
    getQuote(params: QuoteParams): Promise<NormalizedQuote>;
    private buildSwapRequest;
    private isOnChainTxHash;
    /**
     * After the user signs and broadcasts on-chain, submit the tx hash so Pegasus
     * can move the swap to `submitted` and begin monitoring.
     * @see https://stagenet-app.pegasusfi.xyz/docs/integrators/transaction-monitoring
     */
    private submitSwapTxHash;
    private executeWalletTxAndSubmit;
    private getTokenContractAddress;
    private isNativeToken;
    private executeInstaswapDeposit;
    executeSwap({ quote }: Quote, walletClient: WalletClient): Promise<NormalizedTxResponse>;
    getTransactionStatus(p: NormalizedTxResponse): Promise<SwapStatus>;
}
