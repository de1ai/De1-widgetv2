import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
export const HeaderStoreContext = createContext(null);
export function HeaderStoreProvider({ children }) {
    const storeRef = useRef(null);
    if (!storeRef.current) {
        storeRef.current = createHeaderStore();
    }
    return (_jsx(HeaderStoreContext.Provider, { value: storeRef.current, children: children }));
}
export function useHeaderStoreContext() {
    const useStore = useContext(HeaderStoreContext);
    if (!useStore) {
        throw new Error(`You forgot to wrap your component in <${HeaderStoreProvider.name}>.`);
    }
    return useStore;
}
export function useHeaderStore(selector, equalityCheck) {
    const useStore = useHeaderStoreContext();
    return useStore(selector, equalityCheck);
}
// We use fixed position on the header when Widget is in Full Height layout.
// We do this to get it to work like the sticky header does in the other layout modes.
// As the header is position fixed its not in the document flow anymore.
// To prevent the remaining page content from appearing behind the header we need to
// pass the headers height so that the position of the page content can be adjusted
export function useHeaderHeight() {
    const [headerHeight] = useHeaderStore((state) => [state.headerHeight], shallow);
    return {
        headerHeight,
    };
}
export function useSetHeaderHeight() {
    const [setHeaderHeight] = useHeaderStore((state) => [state.setHeaderHeight], shallow);
    return {
        setHeaderHeight,
    };
}
export const createHeaderStore = () => createWithEqualityFn((set, get) => ({
    headerHeight: 108, // a basic default height
    setAction: (element) => {
        set(() => ({
            element,
        }));
        return get().removeAction;
    },
    setTitle: (title) => {
        set(() => ({
            title,
        }));
        return get().removeTitle;
    },
    removeAction: () => {
        set(() => ({
            element: null,
        }));
    },
    removeTitle: () => {
        set(() => ({
            title: undefined,
        }));
    },
    setHeaderHeight: (headerHeight) => {
        set(() => ({
            headerHeight,
        }));
    },
}), Object.is);
//# sourceMappingURL=useHeaderStore.js.map