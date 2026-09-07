import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Typography, styled, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useRoutes } from '../../hooks/useRoutes.js';
import { usePriceImpact } from '../../hooks/usePriceImpact.js';
import { formatTokenAmount } from '../../utils/format.js';
import { HelpOutline } from '@mui/icons-material';
const SummaryBox = styled(Box)(({ theme }) => ({
    padding: '1rem',
    borderRadius: '15px',
    borderWidth: '1px',
    borderColor: theme.palette.mode === 'dark' ? '#373D3A' : 'var(--dark-background)',
    width: '100%',
    marginTop: '0.5rem',
}));
const SummaryRow = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.4rem',
});
export const SwapSummary = () => {
    const { t } = useTranslation();
    const { routes } = useRoutes();
    const route = routes?.[0];
    const { priceImpact } = usePriceImpact(route);
    let minReceive = '0';
    let minReceiveUsd = '0';
    let estGasFee = '0';
    let priceImpactDisplay = '--';
    if (route) {
        const minOut = +formatTokenAmount(BigInt(route.toAmountMin), route.toToken.decimals);
        minReceive = `${Number(minOut.toFixed(4))} ${route.toToken.symbol}`;
        minReceiveUsd = `~ $${Number((minOut * Number(route.toToken.priceUSD || 0)).toFixed(2))}`;
        estGasFee = route.estimatedGasFee || '0';
        const apiPriceImpact = route.price_impact;
        priceImpactDisplay = apiPriceImpact
            ? apiPriceImpact
            : priceImpact
                ? t('format.percent', { value: priceImpact })
                : '--';
    }
    return (_jsxs(SummaryBox, { children: [_jsxs(SummaryRow, { children: [_jsx(Typography, { variant: "body2", color: "text.secondary", sx: { display: 'flex', alignItems: 'center' }, children: _jsx(Typography, { component: "span", color: "text.secondary", sx: { fontSize: '0.875rem' }, children: "Minimum Receive" }) }), _jsxs(Typography, { variant: "body2", children: [_jsx(Typography, { component: "span", color: "text.secondary", sx: { fontSize: '0.875rem' }, children: minReceiveUsd }), _jsx(Typography, { component: "span", sx: { fontSize: '0.875rem', ml: 1 }, children: minReceive })] })] }), _jsxs(SummaryRow, { children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Est. Gas Fee" }), _jsx(Typography, { variant: "body2", children: "1" })] }), _jsxs(SummaryRow, { children: [_jsxs(Typography, { variant: "body2", color: "text.secondary", sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Price Impact" }), _jsx(Tooltip, { title: "The difference between market price and est. price due to trade size", children: _jsx(HelpOutline, { sx: { fontSize: '0.975rem', ml: 0.5 } }) })] }), _jsx(Typography, { variant: "body2", children: priceImpactDisplay })] })] }));
};
//# sourceMappingURL=SwapSummary.js.map