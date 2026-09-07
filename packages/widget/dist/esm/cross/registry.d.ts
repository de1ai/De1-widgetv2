import type { NormalizedQuote, // QuoteParams,
SwapProvider } from './adapters/BaseSwapAdapter.js';
export interface Quote {
    adapter?: SwapProvider;
    quote: NormalizedQuote;
}
export declare class CrossChainSwapAdapterRegistry {
    private adapters;
    registerAdapter(adapter: SwapProvider): void;
    getAdapter(name: string): SwapProvider | undefined;
    getAllAdapters(): SwapProvider[];
}
