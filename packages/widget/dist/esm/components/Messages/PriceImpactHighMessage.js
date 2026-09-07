import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { WarningRounded } from '@mui/icons-material';
import { Checkbox, FormControlLabel, Typography, } from '@mui/material';
import { AlertMessage } from './AlertMessage.js';
import { useStorePriceImpactAcknowledged } from './useMessageQueue.js';
export const PriceImpactHighMessage = ({ onAcknowledge, ...props }) => {
    const acknowledged = useStorePriceImpactAcknowledged((state) => state.priceImpactAcknowledged);
    const setAcknowledged = useStorePriceImpactAcknowledged((state) => state.setPriceImpactAcknowledged);
    const handleChange = (event) => {
        const newValue = event.target.checked;
        setAcknowledged(newValue);
        onAcknowledge?.(newValue);
    };
    return (_jsxs(AlertMessage, { severity: "warning", icon: _jsx(WarningRounded, {}), title: _jsx(Typography, { variant: "body2", sx: { color: 'text.primary' }, children: "Price impact is too high" }), ...props, children: [_jsx(Typography, { variant: "body2", sx: {
                    px: 2,
                    pt: 1,
                }, children: "I acknowledge the risk and confirm to continue the trade despite loss of funds" }), _jsx(FormControlLabel, { control: _jsx(Checkbox, { checked: acknowledged, onChange: handleChange }), label: "I understand and accept the risk", sx: { alignItems: 'center', px: 2, pt: 1 } })] }));
};
//# sourceMappingURL=PriceImpactHighMessage.js.map