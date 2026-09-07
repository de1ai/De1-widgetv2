import type { DefaultValues, FormValuesState } from './types.js';
export declare const formDefaultValues: DefaultValues;
export declare const createFormStore: (defaultValues?: DefaultValues) => import("zustand/traditional").UseBoundStoreWithEqualityFn<import("zustand").StoreApi<FormValuesState>>;
