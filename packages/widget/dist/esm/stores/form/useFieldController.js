import { useCallback } from 'react';
import { useFieldActions } from './useFieldActions.js';
import { useFieldValues } from './useFieldValues.js';
export const useFieldController = ({ name }) => {
    const [fieldValue] = useFieldValues(name);
    const { setFieldValue, setAsTouched } = useFieldActions();
    const onChange = useCallback((newValue) => {
        setFieldValue(name, newValue, { isDirty: true, isTouched: true });
    }, [name, setFieldValue]);
    const onBlur = useCallback(() => {
        setAsTouched(name);
    }, [name, setAsTouched]);
    return {
        onChange,
        onBlur,
        name,
        value: fieldValue,
    };
};
//# sourceMappingURL=useFieldController.js.map