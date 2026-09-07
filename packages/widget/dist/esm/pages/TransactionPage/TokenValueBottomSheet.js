import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { WarningRounded } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { isGaslessStep } from '@de1/widget-sdk';
import { forwardRef, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BottomSheet } from '../../components/BottomSheet/BottomSheet.js';
import { FeeBreakdownTooltip } from '../../components/FeeBreakdownTooltip.js';
import { useSetContentHeight } from '../../hooks/useSetContentHeight.js';
import { useFieldValues } from '../../stores/form/useFieldValues.js';
import { getAccumulatedFeeCostsBreakdown } from '../../utils/fees.js';
import { CenterContainer, IconCircle } from './StatusBottomSheet.style.js';
import { calculateValueLossPercentage } from './utils.js';
export const TokenValueBottomSheet = forwardRef(({ route, onContinue, onCancel }, ref) => {
    const handleCancel = () => {
        ;
        ref.current?.close();
        onCancel?.();
    };
    return (_jsx(BottomSheet, { ref: ref, onClose: onCancel, children: _jsx(TokenValueBottomSheetContent, { route: route, onContinue: onContinue, onCancel: handleCancel }) }));
});
const TokenValueBottomSheetContent = ({ route, onCancel, onContinue, }) => {
    const [fromChainId] = useFieldValues('fromChain');
    const [toChainId] = useFieldValues('toChain');
    const isBradge = fromChainId !== toChainId;
    const { t } = useTranslation();
    const ref = useRef(null);
    useSetContentHeight(ref);
    let { gasCosts, feeCosts, gasCostUSD, feeCostUSD } = getAccumulatedFeeCostsBreakdown(route);
    const fromAmountUSD = Number.parseFloat(route.fromAmountUSD);
    const toAmountUSD = Number.parseFloat(route.toAmountUSD);
    const hasGaslessSupport = route.steps.some(isGaslessStep);
    if (isBradge && route?.data?.prependedOperatingExpenseCost) {
        const decimals = 10 ** route.fromToken.decimals;
        gasCostUSD =
            (route.data.prependedOperatingExpenseCost / decimals) *
                Number(route.fromToken.priceUSD);
    }
    return (_jsxs(Box, { ref: ref, sx: {
            p: 3,
        }, children: [_jsxs(CenterContainer, { children: [_jsx(IconCircle, { status: "warning", mb: 1, children: _jsx(WarningRounded, { color: "warning" }) }), _jsx(Typography, { sx: {
                            py: 1,
                            fontSize: 18,
                            fontWeight: 700,
                        }, children: t('warning.title.highValueLoss') })] }), _jsx(Typography, { sx: {
                    py: 1,
                }, children: t('warning.message.highValueLoss') }), _jsxs(Box, { sx: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 1,
                }, children: [_jsx(Typography, { children: t('main.sending') }), _jsx(Typography, { sx: {
                            fontWeight: 600,
                        }, children: t('format.currency', { value: route.fromAmountUSD }) })] }), _jsxs(Box, { sx: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 0.25,
                }, children: [_jsx(Typography, { children: isBradge ? 'Fee' : t('main.fees.network') }), _jsx(FeeBreakdownTooltip, { gasCosts: gasCosts, relayerSupport: hasGaslessSupport, children: _jsx(Typography, { sx: {
                                fontWeight: 600,
                            }, children: hasGaslessSupport
                                ? t('main.fees.free')
                                : t('format.currency', { value: gasCostUSD }) }) })] }), feeCostUSD ? (_jsxs(Box, { sx: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 0.25,
                }, children: [_jsx(Typography, { children: t('main.fees.provider') }), _jsx(FeeBreakdownTooltip, { feeCosts: feeCosts, children: _jsx(Typography, { sx: {
                                fontWeight: 600,
                            }, children: t('format.currency', { value: feeCostUSD }) }) })] })) : null, _jsxs(Box, { sx: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 0.25,
                }, children: [_jsx(Typography, { children: t('main.receiving') }), _jsx(Typography, { sx: {
                            fontWeight: 600,
                        }, children: t('format.currency', { value: route.toAmountUSD }) })] }), _jsxs(Box, { sx: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 0.25,
                }, children: [_jsx(Typography, { children: t('main.valueLoss') }), _jsxs(Typography, { sx: {
                            fontWeight: 600,
                        }, children: [calculateValueLossPercentage(fromAmountUSD, toAmountUSD, gasCostUSD, feeCostUSD), "%"] })] }), _jsxs(Box, { sx: {
                    display: 'flex',
                    mt: 3,
                }, children: [_jsx(Button, { variant: "text", onClick: onCancel, fullWidth: true, children: t('button.cancel') }), _jsx(Box, { sx: {
                            display: 'flex',
                            p: 1,
                        } }), _jsx(Button, { variant: "contained", onClick: onContinue, fullWidth: true, children: t('button.continue') })] })] }));
};
//# sourceMappingURL=TokenValueBottomSheet.js.map