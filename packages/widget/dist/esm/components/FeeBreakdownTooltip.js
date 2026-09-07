import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { formatTokenAmount } from '../utils/format.js';
export const FeeBreakdownTooltip = ({ gasCosts, feeCosts, relayerSupport, children, }) => {
    const { t } = useTranslation();
    return (_jsx(Tooltip, { title: _jsxs(Box, { children: [relayerSupport ? _jsx(Box, { children: t('tooltip.relayerService') }) : null, gasCosts?.length && !relayerSupport ? (_jsxs(Box, { children: [t('main.fees.network'), getFeeBreakdownTypography(gasCosts, t)] })) : null, feeCosts?.length && !relayerSupport ? (_jsxs(Box, { sx: {
                        mt: 0.5,
                    }, children: [t('main.fees.provider'), getFeeBreakdownTypography(feeCosts, t)] })) : null] }), sx: { cursor: 'help' }, children: children }));
};
export const getFeeBreakdownTypography = (fees, t) => fees.map((fee, index) => (_jsxs(Typography, { color: "inherit", sx: {
        fontSize: 12,
        fontWeight: '500',
    }, children: [t('format.currency', { value: fee.amountUSD }), " (", t('format.tokenAmount', {
            value: formatTokenAmount(fee.amount, fee.token.decimals),
        }), ' ', fee.token.symbol, ")"] }, `${fee.token.address}${index}`)));
//# sourceMappingURL=FeeBreakdownTooltip.js.map