import { shallow } from 'zustand/shallow';
import type { FormValuesState } from './types.js';
export declare function useFormStore<T>(selector: (state: FormValuesState) => T, equalityFn?: typeof shallow): T;
