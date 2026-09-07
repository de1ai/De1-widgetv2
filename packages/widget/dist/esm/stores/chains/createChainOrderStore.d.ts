import type { PersistStoreProps } from '../types.js';
import type { ChainOrderState } from './types.js';
export declare const maxChainsToOrder = 9;
export declare const maxChainsToShow = 10;
export declare const createChainOrderStore: ({ namePrefix }: PersistStoreProps) => import("zustand/traditional").UseBoundStoreWithEqualityFn<import("zustand").StoreApi<ChainOrderState>>;
