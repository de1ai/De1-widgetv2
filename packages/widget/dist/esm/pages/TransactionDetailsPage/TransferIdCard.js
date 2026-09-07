import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ContentCopyRounded, OpenInNew } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/Card/Card.js';
import { CardIconButton } from '../../components/Card/CardIconButton.js';
import { CardTitle } from '../../components/Card/CardTitle.js';
import { useExplorer } from '../../hooks/useExplorer.js';
const getTxHash = (transferId) => transferId.indexOf('_') !== -1
    ? transferId.substring(0, transferId.indexOf('_'))
    : transferId;
export const TransferIdCard = ({ transferId, chain }) => {
    const { t } = useTranslation();
    const { getTransactionLink } = useExplorer();
    const copyTransferId = async () => {
        await navigator.clipboard.writeText(transferId);
    };
    const openTransferIdInExplorer = () => {
        const txHash = getTxHash(transferId);
        window.open(getTransactionLink({ txHash, chain }), '_blank');
    };
    return (_jsxs(Card, { sx: { marginTop: 2 }, children: [_jsxs(Box, { sx: {
                    display: 'flex',
                    flex: 1,
                }, children: [_jsx(CardTitle, { flex: 1, children: t('translation:main.transferId') }), _jsxs(Box, { sx: {
                            gap: 1,
                            display: 'flex',
                            marginRight: 2,
                            marginTop: 1,
                        }, children: [_jsx(CardIconButton, { size: "small", onClick: copyTransferId, children: _jsx(ContentCopyRounded, { fontSize: "inherit" }) }), _jsx(CardIconButton, { size: "small", onClick: openTransferIdInExplorer, children: _jsx(OpenInNew, { fontSize: "inherit" }) })] })] }), _jsx(Typography, { variant: "body2", sx: {
                    pt: 1,
                    pb: 2,
                    px: 2,
                    wordBreak: 'break-all',
                }, children: transferId })] }));
};
//# sourceMappingURL=TransferIdCard.js.map