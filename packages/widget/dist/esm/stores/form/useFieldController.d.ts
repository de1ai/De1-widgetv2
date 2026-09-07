import type { FormFieldNames } from './types.js';
interface UseFieldControllerProps {
    name: FormFieldNames;
}
export declare const useFieldController: ({ name }: UseFieldControllerProps) => {
    onChange: (newValue: string | number | undefined) => void;
    onBlur: () => void;
    name: keyof import("./types.js").DefaultValues;
    value: string | number | import("@de1/widget-sdk").ContractCall[];
};
export {};
