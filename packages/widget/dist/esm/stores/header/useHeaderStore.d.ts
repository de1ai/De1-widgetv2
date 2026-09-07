import type { PersistStoreProviderProps } from '../types.js';
import type { HeaderState, HeaderStore } from './types.js';
export declare const HeaderStoreContext: import("react").Context<HeaderStore>;
export declare function HeaderStoreProvider({ children }: PersistStoreProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useHeaderStoreContext(): HeaderStore;
export declare function useHeaderStore<T>(selector: (state: HeaderState) => T, equalityCheck?: (objA: T, objB: T) => boolean): T;
export declare function useHeaderHeight(): {
    headerHeight: number;
};
export declare function useSetHeaderHeight(): {
    setHeaderHeight: (headerHeight: number) => void;
};
export declare const createHeaderStore: () => import("zustand/traditional").UseBoundStoreWithEqualityFn<import("zustand").StoreApi<HeaderState>>;
