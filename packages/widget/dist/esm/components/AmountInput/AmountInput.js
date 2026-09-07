import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
// import { CardTitle } from '../Card/CardTitle.js'
// import { InputCard } from '../Card/InputCard.js'
import { useRoutes } from '../../hooks/useRoutes.js';
import { useToken } from '../../hooks/useToken.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { FormKeyHelper } from '../../stores/form/types.js';
import { useFieldController } from '../../stores/form/useFieldController.js';
import { useFieldValues } from '../../stores/form/useFieldValues.js';
import { DisabledUI } from '../../types/widget.js';
import { formatInputAmount, formatToTokenAmount } from '../../utils/format.js';
import { fitInputText } from '../../utils/input.js';
import { FormContainer, FormControl, Input, maxInputFontSize, minInputFontSize, } from './AmountInput.style.js';
import { AmountInputEndAdornment } from './AmountInputEndAdornment.js';
// import { AmountInputStartAdornment } from './AmountInputStartAdornment.js'
import { PriceFormHelperText } from './PriceFormHelperText.js';
export const AmountInput = ({ formType, ...props }) => {
    const { disabledUI } = useWidgetConfig();
    const [chainId, tokenAddress] = useFieldValues(FormKeyHelper.getChainKey(formType), FormKeyHelper.getTokenKey(formType));
    const { token } = useToken(chainId, tokenAddress);
    const disabled = disabledUI?.includes(DisabledUI.FromAmount) || formType === 'to';
    return (_jsx(AmountInputBase, { formType: formType, token: token, endAdornment: !disabled ? _jsx(AmountInputEndAdornment, { formType: formType }) : undefined, bottomAdornment: _jsx(PriceFormHelperText, { formType: formType }), disabled: disabled, ...props }));
};
export const AmountInputBase = ({ formType, token, startAdornment, endAdornment, bottomAdornment, disabled, ...props }) => {
    const { t } = useTranslation();
    const { subvariant, subvariantOptions } = useWidgetConfig();
    const ref = useRef(null);
    let inputValue = '';
    const amountKey = FormKeyHelper.getAmountKey(formType);
    const { onChange, onBlur, value } = useFieldController({ name: amountKey });
    inputValue = value || '';
    const { routes, isLoading, isFetching, isFetched, dataUpdatedAt, refetchTime, refetch, } = useRoutes();
    if (formType === 'to') {
        const router = routes?.[0];
        if (router &&
            router.toAmount !== undefined &&
            router.toAmount !== null &&
            router.toToken &&
            typeof router.toToken.decimals === 'number') {
            inputValue = String(formatToTokenAmount(BigInt(router.toAmount), router.toToken.decimals));
        }
        else {
            inputValue = '';
        }
    }
    const handleChange = (event) => {
        const { value } = event.target;
        const formattedAmount = formatInputAmount(value, token?.decimals, true);
        onChange(formattedAmount);
    };
    const handleBlur = (event) => {
        const { value } = event.target;
        const formattedAmount = formatInputAmount(value, token?.decimals);
        onChange(formattedAmount);
        onBlur();
    };
    // biome-ignore lint/correctness/useExhaustiveDependencies: we need to run effect on value change
    useLayoutEffect(() => {
        if (ref.current) {
            fitInputText(maxInputFontSize, minInputFontSize, ref.current);
        }
    }, [value, inputValue, routes]);
    const title = subvariant === 'custom'
        ? subvariantOptions?.custom === 'deposit'
            ? t('header.amount')
            : t('header.youPay')
        : t('header.send');
    return (_jsx(FormContainer, { children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(Input, { inputRef: ref, size: "small", autoComplete: "off", placeholder: "0", startAdornment: startAdornment, endAdornment: endAdornment, inputProps: {
                        inputMode: 'decimal',
                    }, onChange: handleChange, onBlur: handleBlur, value: inputValue, name: amountKey, disabled: disabled, required: true, sx: { input: { textAlign: 'end' } } }), bottomAdornment] }) }));
};
//# sourceMappingURL=AmountInput.js.map