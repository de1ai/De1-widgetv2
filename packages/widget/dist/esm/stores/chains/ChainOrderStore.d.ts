import type { StoreApi } from 'zustand';
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional';
import type { PersistStoreProviderProps } from '../types.js';
import type { ChainOrderState } from './types.js';
export type ChainOrderStore = UseBoundStoreWithEqualityFn<StoreApi<ChainOrderState>>;
export declare const ChainOrderStoreContext: import("react").Context<ChainOrderStore>;
export declare function ChainOrderStoreProvider({ children, ...props }: PersistStoreProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useChainOrderStoreContext(): ChainOrderStore;
export declare function useChainOrderStore<T>(selector: (state: ChainOrderState) => T, equalityFn?: (left: T, right: T) => boolean): T;
