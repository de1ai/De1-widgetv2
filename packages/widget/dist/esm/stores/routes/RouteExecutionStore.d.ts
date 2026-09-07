import type { StoreApi } from 'zustand';
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional';
import type { PersistStoreProviderProps } from '../types.js';
import type { RouteExecutionState } from './types.js';
export type RouteExecutionStore = UseBoundStoreWithEqualityFn<StoreApi<RouteExecutionState>>;
export declare const RouteExecutionStoreContext: import("react").Context<RouteExecutionStore>;
export declare function RouteExecutionStoreProvider({ children, ...props }: PersistStoreProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useRouteExecutionStoreContext(): RouteExecutionStore;
export declare function useRouteExecutionStore<T>(selector: (state: RouteExecutionState) => T, equalityFn?: (left: T, right: T) => boolean): T;
