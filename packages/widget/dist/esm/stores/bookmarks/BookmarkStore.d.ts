import { shallow } from 'zustand/shallow';
import type { PersistStoreProviderProps } from '../types.js';
import type { BookmarkState, BookmarkStore } from './types.js';
export declare const BookmarkStoreContext: import("react").Context<BookmarkStore>;
export declare const BookmarkStoreProvider: React.FC<PersistStoreProviderProps>;
export declare function useBookmarkStore<T>(selector: (store: BookmarkState) => T, equalityFunction?: typeof shallow): T;
