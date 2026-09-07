import { jsx as _jsx } from "react/jsx-runtime";
import { WarningRounded } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { useAvailableChains } from '../../hooks/useAvailableChains.js';
import { formatServerErrorMessage } from '../../utils/formatServerErrorMessage.js';
import { AlertMessage } from './AlertMessage.js';
export const ServerErrorMessage = ({ errorMsg, ...props }) => {
    const { getChainById } = useAvailableChains();
    const formattedErrorMsg = formatServerErrorMessage(errorMsg, getChainById);
    return (_jsx(AlertMessage, { severity: "warning", icon: _jsx(WarningRounded, {}), title: _jsx(Typography, { variant: "body2", sx: {
                color: 'text.primary',
            }, children: formattedErrorMsg }), multiline: true, ...props }));
};
//# sourceMappingURL=ServeErrorMessage.js.map