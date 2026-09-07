import { shallow } from 'zustand/shallow';
import { useBookmarkStore } from './BookmarkStore.js';
export const useBookmarks = () => {
    const [bookmarks, selectedBookmark, recentWallets] = useBookmarkStore((store) => [store.bookmarks, store.selectedBookmark, store.recentWallets], shallow);
    return {
        bookmarks,
        selectedBookmark,
        recentWallets,
    };
};
//# sourceMappingURL=useBookmarks.js.map