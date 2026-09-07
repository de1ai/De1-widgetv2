import type { FormFieldNames } from '../stores/form/types.js';
export declare const useDebouncedWatch: <T extends FormFieldNames[]>(delay: number, ...name: T) => import("../stores/form/types.js").FormFieldArray<T>;
