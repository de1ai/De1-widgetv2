import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { LocalGasStationRounded } from '@mui/icons-material';
import { HelpOutline } from '@mui/icons-material';
import { Box, Collapse, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChain } from '../hooks/useChain.js';
import { useGasPrice } from '../hooks/useGasPrice.js';
import { usePriceImpact } from '../hooks/usePriceImpact.js';
import { useToken } from '../hooks/useToken.js';
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js';
import { useFieldValues } from '../stores/form/useFieldValues.js';
import { isRouteDone } from '../stores/routes/utils.js';
import { useSplitSubvariantStore } from '../stores/settings/useSplitSubvariantStore.js';
import { formatTokenAmount, formatTokenPrice } from '../utils/format.js';
import { Card } from './Card/Card.js';
import { IconTypography } from './IconTypography.js';
import { TokenRate } from './TokenRate/TokenRate.js';
export const TransactionDetails = ({ route, ...props }) => {
    const { t } = useTranslation();
    const { feeConfig } = useWidgetConfig();
    const [cardExpanded, setCardExpanded] = useState(true);
    const [fromChainId] = useFieldValues('fromChain');
    const [toChainId] = useFieldValues('toChain');
    const { chain } = useChain(fromChainId);
    const [state] = useSplitSubvariantStore((storeState) => [storeState.state]);
    const isBradge = route ? fromChainId !== toChainId : state === 'bridge';
    const { token } = useToken(fromChainId, chain?.nativeToken?.address);
    const { gasPrice } = useGasPrice(fromChainId?.toString() || '');
    if (!route) {
        route = {
            fromAmount: '0',
            toAmount: '0',
            fromToken: {
                name: '',
                address: '',
                symbol: '',
                chainId: 1,
                decimals: 0,
                priceUSD: '0',
            },
            toToken: {
                name: '',
                address: '',
                symbol: '',
                chainId: 1,
                decimals: 0,
                priceUSD: '0',
            },
            priceImpact: '0',
            fromAmountMin: 0,
            estimatedGas: 0,
            gas: 0,
            steps: [],
        };
    }
    const toggleCard = () => {
        setCardExpanded((cardExpanded) => !cardExpanded);
    };
    let gasCostUSD = 0;
    const feeCosts = [];
    const combinedFeesUSD = gasCostUSD + feeCosts.reduce((sum, fee) => sum + fee.costUSD, 0);
    const feeCostUSD = feeCosts.reduce((sum, fee) => sum + fee.costUSD, 0);
    const estimatedGas = route?.estimatedGas || route?.data?.estimatedGas;
    const gasCost = route?.gas || 0;
    if (token && gasPrice && estimatedGas) {
        const d = 10 ** token.decimals;
        gasCostUSD =
            Number(token.priceUSD) * ((Number(gasPrice) * Number(estimatedGas)) / d);
    }
    if (token && gasCost) {
        gasCostUSD =
            Number(token.priceUSD) * Number(gasCost);
    }
    if (isBradge) {
        gasCostUSD = route.feeCosts?.[0]?.amountUSD || 0;
    }
    const { priceImpact } = usePriceImpact(route);
    const feeCollectionStep = route.steps[0]
        ? route.steps[0].includedSteps.find((includedStep) => includedStep.tool === 'feeCollection')
        : 0;
    let feeAmountUSD = 0;
    if (feeCollectionStep) {
        const estimatedFromAmount = BigInt(feeCollectionStep.estimate.fromAmount) -
            BigInt(feeCollectionStep.estimate.toAmount);
        feeAmountUSD = formatTokenPrice(estimatedFromAmount, feeCollectionStep.action.fromToken.priceUSD, feeCollectionStep.action.fromToken.decimals);
    }
    const hasGaslessSupport = 12;
    const showIntegratorFeeCollectionDetails = (feeAmountUSD || Number.isFinite(feeConfig?.fee)) && !hasGaslessSupport;
    if (!Number(route.toAmount)) {
        return null;
    }
    return (_jsxs(Card, { selectionColor: "secondary", ...props, children: [_jsxs(Box, { sx: {
                    display: 'flex',
                    alignItems: 'center',
                    px: 2,
                    py: 1.75,
                }, children: [_jsx(Box, { sx: {
                            display: 'flex',
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'left',
                        }, children: _jsx(TokenRate, { route: route }) }), _jsx(Collapse, { timeout: 100, in: !cardExpanded, mountOnEnter: true, children: _jsxs(Box, { onClick: toggleCard, 
                            // biome-ignore lint/a11y/useSemanticElements:
                            role: "button", sx: {
                                display: 'flex',
                                alignItems: 'center',
                                px: 1,
                                cursor: 'pointer',
                            }, children: [_jsx(IconTypography, { mr: 0.5, fontSize: 16, children: _jsx(LocalGasStationRounded, { fontSize: "inherit" }) }), _jsx(Typography, { "data-value": hasGaslessSupport ? 0 : combinedFeesUSD, sx: {
                                        fontSize: 14,
                                        color: 'text.primary',
                                        fontWeight: 600,
                                        lineHeight: 1.429,
                                    }, children: hasGaslessSupport
                                        ? t('main.fees.free')
                                        : t('format.currency', { value: combinedFeesUSD }) })] }) })] }), _jsx(Collapse, { timeout: 225, in: cardExpanded, mountOnEnter: true, children: _jsxs(Box, { sx: {
                        px: 2,
                        pb: 2,
                    }, children: [route && (isBradge || route.fromChainId !== 1151111081099710) && (_jsxs(Box, { sx: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                mb: 0.5,
                            }, children: [_jsxs(Typography, { variant: "body2", sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: !isBradge ? t('main.fees.network') : 'Fee' }), isBradge ? (_jsx(Tooltip, { title: "Included gas is paid on top of the amount and covers solvers gas costs to\n        fulfill your trade", children: _jsx(HelpOutline, { sx: {
                                                    fontSize: '0.975rem',
                                                    ml: 0.5,
                                                    color: 'text.secondary',
                                                } }) })) : undefined] }), _jsx(Typography, { variant: "body2", sx: { fontWeight: 600 }, children: gasCostUSD
                                        ? t('format.currency', {
                                            value: gasCostUSD,
                                        })
                                        : '--' })] })), feeCosts.length ? (_jsxs(Box, { sx: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                mb: 0.5,
                            }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: t('main.fees.provider') }), feeCostUSD
                                    ? t('format.currency', {
                                        value: feeCostUSD,
                                    })
                                    : '--'] })) : null, showIntegratorFeeCollectionDetails ? (_jsxs(Box, { sx: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                mb: 0.5,
                            }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: feeConfig?.name
                                        ? t('main.fees.integrator', { tool: feeConfig.name })
                                        : t('main.fees.defaultIntegrator') }), feeConfig?.name ? (_jsx(Typography, { variant: "body2", sx: { fontWeight: 600 }, children: t('format.currency', {
                                        value: feeAmountUSD,
                                    }) })) : (_jsx(Typography, { variant: "body2", sx: { fontWeight: 600 }, children: t('format.currency', {
                                        value: feeAmountUSD,
                                    }) }))] })) : null, _jsxs(Box, { sx: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                mb: 0.5,
                            }, children: [_jsxs(Typography, { variant: "body2", sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: t('main.priceImpact') }), _jsx(Tooltip, { title: "The difference between market price and est. price due to trade size", children: _jsx(HelpOutline, { sx: {
                                                    fontSize: '0.975rem',
                                                    ml: 0.5,
                                                    color: 'text.secondary',
                                                } }) })] }), _jsx(Typography, { variant: "body2", sx: {
                                        fontWeight: 600,
                                        color: priceImpact
                                            ? Number(priceImpact) < 0
                                                ? Number(priceImpact) > -0.3
                                                    ? 'orange'
                                                    : 'error.main'
                                                : 'green'
                                            : '',
                                    }, children: priceImpact ? t('format.percent', { value: priceImpact }) : '--' })] }), !isBradge && (_jsx(Box, { children: !isRouteDone(route) ? (_jsxs(_Fragment, { children: [_jsxs(Box, { sx: {
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            mb: 0.5,
                                        }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: t('main.maxSlippage') }), _jsx(Typography, { variant: "body2", sx: { fontWeight: 600 }, children: t('format.percent', {
                                                    value: route.steps[0]?.action?.slippage ? route.steps[0].action.slippage / 100 : 0,
                                                }) })] }), _jsxs(Box, { sx: {
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: t('main.minReceived') }), _jsxs(Typography, { variant: "body2", sx: { fontWeight: 600 }, children: [t('format.tokenAmount', {
                                                        value: formatTokenAmount(typeof route.toAmountMin === 'string' &&
                                                            !route.toAmountMin.includes('e')
                                                            ? BigInt(Math.floor(Number(route.toAmountMin)))
                                                            : BigInt(0), route.toToken.decimals),
                                                    }), ' ', route.toToken.symbol] })] })] })) : (_jsxs(_Fragment, { children: [_jsxs(Box, { sx: {
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            mb: 0.5,
                                        }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: t('main.maxSlippage') }), _jsx(Typography, { variant: "body2", sx: { fontWeight: 600 }, children: "--" })] }), _jsxs(Box, { sx: {
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: t('main.minReceived') }), _jsx(Typography, { variant: "body2", sx: { fontWeight: 600 }, children: "--" })] })] })) }))] }) })] }));
};
//# sourceMappingURL=TransactionDetails.js.map