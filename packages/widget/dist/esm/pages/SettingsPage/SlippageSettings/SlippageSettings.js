import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { WarningRounded } from '@mui/icons-material';
import { Box, Typography, debounce } from '@mui/material';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingMonitor } from '../../../hooks/useSettingMonitor.js';
import { useSettings } from '../../../stores/settings/useSettings.js';
import { useSettingsActions } from '../../../stores/settings/useSettingsActions.js';
import { defaultSlippage } from '../../../stores/settings/useSettingsStore.js';
import { formatSlippage } from '../../../utils/format.js';
import { BadgedValue } from '../SettingsCard/BadgedValue.js';
import { SettingCardExpandable } from '../SettingsCard/SettingCardExpandable.js';
import { SettingsFieldSet, SlippageCustomInput, SlippageDefaultButton, SlippageLimitsWarningContainer, } from './SlippageSettings.style.js';
const DEFAULT_CUSTOM_INPUT_VALUE = '0.5';
const list = [
    {
        name: '0.5%',
        value: '0.5',
    },
    {
        name: '1%',
        value: '1',
    },
    {
        name: '3%',
        value: '3',
    },
];
export const SlippageSettings = () => {
    const { t } = useTranslation();
    const { isSlippageNotRecommended, isSlippageUnderRecommendedLimits, isSlippageOutsideRecommendedLimits, isSlippageChanged, } = useSettingMonitor();
    const { slippage } = useSettings(['slippage']);
    const { setValue } = useSettingsActions();
    const defaultValue = useRef(slippage);
    const [focused, setFocused] = useState();
    const customInputValue = !slippage || slippage === defaultSlippage
        ? DEFAULT_CUSTOM_INPUT_VALUE
        : slippage;
    const [inputValue, setInputValue] = useState(customInputValue);
    const handleDefaultClick = (value) => {
        setValue('slippage', value);
        setInputValue('');
    };
    const debouncedSetValue = useMemo(() => debounce(setValue, 500), [setValue]);
    const handleInputUpdate = useCallback((event) => {
        const { value } = event.target;
        const formattedValue = formatSlippage(value, defaultValue.current, true);
        setInputValue(formattedValue);
        debouncedSetValue('slippage', formattedValue.length ? formattedValue : defaultSlippage);
    }, [debouncedSetValue]);
    const handleInputFocus = (event) => {
        setFocused('input');
        const { value } = event.target;
        const formattedValue = formatSlippage(value, defaultValue.current);
        setInputValue(formattedValue);
        setValue('slippage', formattedValue.length ? formattedValue : defaultSlippage);
    };
    const badgeColor = isSlippageNotRecommended
        ? 'warning'
        : isSlippageChanged
            ? 'info'
            : undefined;
    const slippageWarningText = isSlippageOutsideRecommendedLimits
        ? t('warning.message.slippageOutsideRecommendedLimits')
        : isSlippageUnderRecommendedLimits
            ? t('warning.message.slippageUnderRecommendedLimits')
            : '';
    return (_jsx(SettingCardExpandable, { value: _jsx(BadgedValue, { badgeColor: badgeColor, showBadge: !!badgeColor, children: slippage ? `${slippage}%` : t('button.auto') }), icon: null, title: t('settings.slippage'), children: _jsxs(Box, { sx: {
                mt: 1.5,
            }, children: [_jsxs(SettingsFieldSet, { children: [list.map((item, i) => (_jsx(SlippageDefaultButton, { selected: item.value === slippage && focused !== 'input', onFocus: () => {
                                setFocused('button');
                            }, onBlur: () => {
                                setFocused(undefined);
                            }, onClick: () => handleDefaultClick(item.value), disableRipple: true, children: item.name }, i))), _jsx(SlippageCustomInput, { selected: true, placeholder: focused === 'input' ? '' : t('settings.custom'), inputProps: {
                                inputMode: 'decimal',
                            }, onChange: handleInputUpdate, onFocus: handleInputFocus, value: inputValue, autoComplete: "off", onBlur: () => setFocused(undefined) })] }), isSlippageNotRecommended && (_jsxs(SlippageLimitsWarningContainer, { children: [_jsx(WarningRounded, { color: "warning" }), _jsx(Typography, { sx: {
                                fontSize: 13,
                                fontWeight: 400,
                            }, children: slippageWarningText })] }))] }) }));
};
//# sourceMappingURL=SlippageSettings.js.map