import type { RefObject } from 'react';
interface UseContentHeightProps {
    listParentRef: RefObject<HTMLUListElement | HTMLDivElement | null>;
    headerRef?: RefObject<HTMLElement | null>;
}
export declare const defaultMinListHeight = 360;
export declare const minMobileListHeight = 160;
export declare const useListHeight: ({ listParentRef, headerRef, }: UseContentHeightProps) => {
    minListHeight: number;
    listHeight: number;
};
export {};
