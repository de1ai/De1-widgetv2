import type { SplitSubvariantProps, SplitSubvariantProviderProps, SplitSubvariantState, SplitSubvariantStore } from './types.js';
export declare const SplitSubvariantStoreContext: import("react").Context<SplitSubvariantStore>;
export declare function SplitSubvariantStoreProvider({ children, ...props }: SplitSubvariantProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useSplitSubvariantStoreContext(): SplitSubvariantStore;
export declare function useSplitSubvariantStore<T>(selector: (state: SplitSubvariantState) => T): T;
export declare const createSplitSubvariantStore: ({ state }: SplitSubvariantProps) => import("zustand/traditional").UseBoundStoreWithEqualityFn<import("zustand").StoreApi<SplitSubvariantState>>;
