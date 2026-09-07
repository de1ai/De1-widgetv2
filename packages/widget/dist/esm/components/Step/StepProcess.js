import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { OpenInNewRounded } from '@mui/icons-material';
import { Box, Link, Typography } from '@mui/material';
import { useExplorer } from '../../hooks/useExplorer.js';
import { useProcessMessage } from '../../hooks/useProcessMessage.js';
import { CardIconButton } from '../Card/CardIconButton.js';
import { CircularProgress } from './CircularProgress.js';
export const StepProcess = ({ step, process }) => {
    const { title, message } = useProcessMessage(step, process);
    const { getTransactionLink } = useExplorer();
    return (_jsxs(Box, { sx: {
            px: 2,
            py: 1,
        }, children: [_jsxs(Box, { sx: {
                    display: 'flex',
                    alignItems: 'center',
                }, children: [_jsx(CircularProgress, { process: process }), _jsx(Typography, { sx: {
                            marginLeft: 2,
                            marginRight: 0.5,
                            flex: 1,
                            fontSize: 14,
                            fontWeight: process.error ? 600 : 400,
                        }, children: title }), process.txHash || process.txLink ? (_jsx(CardIconButton, { size: "small", LinkComponent: Link, href: process.txHash
                            ? getTransactionLink({
                                txHash: process.txHash,
                                chain: step.action.fromChainId,
                            })
                            : getTransactionLink({
                                txLink: process.txLink,
                                chain: step.action.fromChainId,
                            }), target: "_blank", rel: "nofollow noreferrer", children: _jsx(OpenInNewRounded, { fontSize: "inherit" }) })) : null] }), message ? (_jsx(Typography, { sx: {
                    ml: 7,
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'text.secondary',
                }, children: message })) : null] }));
};
//# sourceMappingURL=StepProcess.js.map