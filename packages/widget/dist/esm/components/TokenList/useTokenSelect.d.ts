import type { FormType } from '../../stores/form/types.js';
export type UseTokenSelectArgs = {
    formType: FormType;
    onClick?: () => void;
};
export declare const useTokenSelect: (formType: FormType, onClick?: () => void) => (tokenAddress: string, chainId?: number) => void;
