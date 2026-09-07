import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AccessTimeFilled, LocalGasStationRounded } from '@mui/icons-material';
import { Box, Tooltip, Typography } from '@mui/material';
import { isGaslessStep } from '@de1/widget-sdk';
import { useTranslation } from 'react-i18next';
import { getAccumulatedFeeCostsBreakdown } from '../../utils/fees.js';
import { FeeBreakdownTooltip } from '../FeeBreakdownTooltip.js';
import { IconTypography } from '../IconTypography.js';
import { TokenRate } from '../TokenRate/TokenRate.js';
export const RouteCardEssentials = ({ route, }) => {
    const { t, i18n } = useTranslation();
    const executionTimeSeconds = Math.floor(route.steps.reduce((duration, step) => duration + step.estimate.executionDuration, 0));
    const executionTimeMinutes = Math.floor(executionTimeSeconds / 60);
    const { gasCosts, feeCosts, combinedFeesUSD } = getAccumulatedFeeCostsBreakdown(route);
    const hasGaslessSupport = route.steps.some(isGaslessStep);
    return (_jsxs(Box, { sx: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
            mt: 2,
        }, children: [_jsx(TokenRate, { route: route }), _jsxs(Box, { sx: {
                    display: 'flex',
                    alignItems: 'center',
                }, children: [_jsx(FeeBreakdownTooltip, { gasCosts: gasCosts, feeCosts: feeCosts, relayerSupport: hasGaslessSupport, children: _jsxs(Box, { sx: {
                                display: 'flex',
                                mr: 1.5,
                                alignItems: 'center',
                            }, children: [_jsx(IconTypography, { mr: 0.5, fontSize: 16, children: _jsx(LocalGasStationRounded, { fontSize: "inherit" }) }), _jsx(Typography, { "data-value": hasGaslessSupport ? 0 : combinedFeesUSD, sx: {
                                        fontSize: 14,
                                        color: 'text.primary',
                                        fontWeight: 600,
                                        lineHeight: 1,
                                    }, children: hasGaslessSupport
                                        ? t('main.fees.free')
                                        : t('format.currency', {
                                            value: combinedFeesUSD,
                                        }) })] }) }), _jsx(Tooltip, { title: t('tooltip.estimatedTime'), sx: { cursor: 'help' }, children: _jsxs(Box, { sx: {
                                display: 'flex',
                                alignItems: 'center',
                            }, children: [_jsx(IconTypography, { mr: 0.5, fontSize: 16, children: _jsx(AccessTimeFilled, { fontSize: "inherit" }) }), _jsx(Typography, { sx: {
                                        fontSize: 14,
                                        color: 'text.primary',
                                        fontWeight: 600,
                                        lineHeight: 1,
                                    }, children: (executionTimeSeconds < 60
                                        ? executionTimeSeconds
                                        : executionTimeMinutes).toLocaleString(i18n.language, {
                                        style: 'unit',
                                        unit: executionTimeSeconds < 60 ? 'second' : 'minute',
                                        unitDisplay: 'narrow',
                                    }) })] }) })] })] }));
};
//# sourceMappingURL=RouteCardEssentials.js.map