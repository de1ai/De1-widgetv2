import type { ChangeEventHandler, FocusEventHandler } from 'react';
/** Matches MUI InputBase inputProps: the underlying element may be input or textarea */
interface SearchInputProps {
    name?: string;
    value?: string;
    placeholder?: string;
    onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    autoFocus?: boolean;
}
export declare const SearchInput: ({ name, placeholder, onChange, onBlur, value, autoFocus, }: SearchInputProps) => import("react/jsx-runtime").JSX.Element;
export declare const StickySearchInput: (props: SearchInputProps) => import("react/jsx-runtime").JSX.Element;
export {};
