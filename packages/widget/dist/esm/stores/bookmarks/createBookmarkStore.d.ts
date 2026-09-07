import type { ToAddress } from '../../types/widget.js';
import type { PersistStoreProps } from '../types.js';
import type { BookmarkState } from './types.js';
interface PersistBookmarkProps extends PersistStoreProps {
    toAddress?: ToAddress;
}
export declare const createBookmarksStore: ({ namePrefix, toAddress, }: PersistBookmarkProps) => import("zustand/traditional").UseBoundStoreWithEqualityFn<import("zustand").StoreApi<BookmarkState>>;
export {};
