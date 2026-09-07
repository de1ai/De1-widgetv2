import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useRef } from 'react';
import { createRouteExecutionStore } from './createRouteExecutionStore.js';
export const RouteExecutionStoreContext = createContext(null);
export function RouteExecutionStoreProvider({ children, ...props }) {
    const storeRef = useRef(null);
    if (!storeRef.current) {
        storeRef.current = createRouteExecutionStore(props);
    }
    return (_jsx(RouteExecutionStoreContext.Provider, { value: storeRef.current, children: children }));
}
export function useRouteExecutionStoreContext() {
    const useStore = useContext(RouteExecutionStoreContext);
    if (!useStore) {
        throw new Error(`You forgot to wrap your component in <${RouteExecutionStoreProvider.name}>.`);
    }
    return useStore;
}
export function useRouteExecutionStore(selector, equalityFn) {
    const useStore = useRouteExecutionStoreContext();
    return useStore(selector, equalityFn);
}
//# sourceMappingURL=RouteExecutionStore.js.map