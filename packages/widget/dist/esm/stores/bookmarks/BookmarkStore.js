import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { createBookmarksStore } from './createBookmarkStore.js';
export const BookmarkStoreContext = createContext(null);
export const BookmarkStoreProvider = ({ children, ...props }) => {
    const { toAddress } = useWidgetConfig();
    const storeRef = useRef(null);
    if (!storeRef.current) {
        storeRef.current = createBookmarksStore({ ...props, toAddress });
    }
    return (_jsx(BookmarkStoreContext.Provider, { value: storeRef.current, children: children }));
};
export function useBookmarkStore(selector, equalityFunction = shallow) {
    const useStore = useContext(BookmarkStoreContext);
    if (!useStore) {
        throw new Error(`You forgot to wrap your component in <${BookmarkStoreProvider.name}>.`);
    }
    return useStore(selector, equalityFunction);
}
//# sourceMappingURL=BookmarkStore.js.map