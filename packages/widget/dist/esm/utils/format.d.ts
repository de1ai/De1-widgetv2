/**
 * Format token amount to at least 6 decimals.
 * @param amount amount to format.
 * @returns formatted amount.
 */
export declare function formatTokenAmount(amount: bigint | undefined, decimals: number): string;
/**
 * Format toToken amount with conditional decimal places for display only.
 * When toToken value > 1000, keep 4 decimal places, otherwise keep 6 decimal places.
 * This function only changes the display format, not the original value precision.
 * @param amount amount to format.
 * @param decimals token decimals.
 * @returns formatted amount string for display.
 */
export declare function formatToTokenAmount(amount: bigint | undefined, decimals: number): string;
export declare function formatSlippage(slippage?: string, defaultValue?: string, returnInitial?: boolean): string;
export declare function formatInputAmount(amount: string, decimals?: number | null, returnInitial?: boolean): string;
export declare function formatTokenPrice(amount?: string | bigint, price?: string, decimals?: number): number;
