/**
 * Solana Transaction Sending Service
 *
 * This module handles sending and confirming transactions on Solana blockchain
 */
import type { BlockhashWithExpiryBlockHeight, Connection } from '@solana/web3.js';
/**
 * Transaction sending and confirmation parameters interface
 */
interface SolanaTransactionParams {
    /** Solana RPC connection instance */
    connection: Connection;
    /** Serialized transaction data */
    serializedTransaction: Buffer;
    /** Blockhash with expiry block height */
    blockhashWithExpiryBlockHeight?: BlockhashWithExpiryBlockHeight;
    /** Transaction process object */
    process?: any;
    /** Route update callback function */
    updateRouteHook?: (route: any) => void;
}
/**
 * Send and wait for Solana transaction confirmation
 *
 * @param params Transaction parameters
 * @returns Transaction response and hash
 */
export declare function sendAndConfirmSolanaTransaction({ connection, serializedTransaction, process, updateRouteHook, }: SolanaTransactionParams): Promise<any>;
export {};
