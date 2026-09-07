import { jsx as _jsx } from "react/jsx-runtime";
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AlertMessage } from './AlertMessage.js';
import { Warning as WarningIcon } from '@mui/icons-material';
export const GasSufficiencyMessageBridge = ({ ...props }) => {
    const { t } = useTranslation();
    return (_jsx(AlertMessage, { icon: _jsx(WarningIcon, {}), severity: "warning", title: _jsx(Typography, { variant: "body2", sx: {
                fontWeight: 700,
            }, children: "Not enough balance" }), ...props, children: _jsx(Typography, { variant: "body2", sx: {
                px: 2,
                pt: 1,
            }, children: "Included gas is paid on top of the amount and covers solvers gas costs to fulfill your trade" }) }));
};
//# sourceMappingURL=GasSufficiencyMessageBridge.js.map