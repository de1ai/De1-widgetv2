import type { WalletClient } from 'viem';
import type { WidgetBridgesConfig } from '../types/widget.js';
/**
 * Get cross-chain aggregated quotes (supports multiple adapter comparison)
 * @param params - Cross-chain quote parameters
 * @returns Best quote result, compatible with useRoutes.ts requirements
 */
export declare function getCrossChainQuote({ fromMsg, toMsg, inAmount, slippage_tolerance, account, recipient, tokenInUsd, tokenOutUsd, feeBps, walletClient, publicClient, publicKey, nearTokens, disabledBridges, bridgesConfig, }: {
    fromMsg: any;
    toMsg: any;
    inAmount: string;
    slippage_tolerance: string | number;
    account: string;
    recipient?: string;
    tokenInUsd?: number;
    tokenOutUsd?: number;
    feeBps?: number;
    walletClient?: any;
    publicClient?: any;
    publicKey?: string;
    nearTokens?: any[];
    disabledBridges?: string[];
    bridgesConfig?: WidgetBridgesConfig;
}): Promise<any | null>;
export declare const bridgeExecuteSwap: ({ quoteData, walletClient, nearWallet, }: {
    quoteData: any;
    walletClient: WalletClient;
    nearWallet?: any;
}) => Promise<any>;
export declare const ADAPTER_LOGIN_URLS: Record<string, string>;
