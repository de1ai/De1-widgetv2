import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/Card/Card.js';
import { CardTitle } from '../../components/Card/CardTitle.js';
import { Token } from '../../components/Token/Token.js';
import { useExplorer } from '../../hooks/useExplorer.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { shortenAddress } from '../../utils/wallet.js';
import { StepTimer } from '../Timer/StepTimer.js';
import { DestinationWalletAddress } from './DestinationWalletAddress.js';
import { StepProcess } from './StepProcess.js';
export const Step = ({ step, fromToken, toToken, impactToken, toAddress }) => {
    const { t } = useTranslation();
    const { subvariant, subvariantOptions } = useWidgetConfig();
    const { getAddressLink } = useExplorer();
    const stepHasError = step.execution?.process.some((process) => process.status === 'FAILED');
    const getCardTitle = () => {
        // const hasBridgeStep = step.includedSteps.some(
        //   (step) => step.type === 'cross'
        // )
        // const hasSwapStep = step.includedSteps.some((step) => step.type === 'swap')
        const hasCustomStep = step.includedSteps.some((step) => step.type === 'custom');
        const isCustomVariant = hasCustomStep && subvariant === 'custom';
        switch (step.type) {
            // case 'de1': {
            //   if (hasBridgeStep && hasSwapStep) {
            //     return isCustomVariant
            //       ? subvariantOptions?.custom === 'deposit'
            //         ? t('main.stepBridgeAndDeposit')
            //         : t('main.stepBridgeAndBuy')
            //       : t('main.stepSwapAndBridge')
            //   }
            //   if (hasBridgeStep) {
            //     return isCustomVariant
            //       ? subvariantOptions?.custom === 'deposit'
            //         ? t('main.stepBridgeAndDeposit')
            //         : t('main.stepBridgeAndBuy')
            //       : t('main.stepBridge')
            //   }
            //   if (hasSwapStep) {
            //     return isCustomVariant
            //       ? subvariantOptions?.custom === 'deposit'
            //         ? t('main.stepSwapAndDeposit')
            //         : t('main.stepSwapAndBuy')
            //       : t('main.stepSwap')
            //   }
            //   return isCustomVariant
            //     ? subvariantOptions?.custom === 'deposit'
            //       ? t('main.stepDeposit')
            //       : t('main.stepBuy')
            //     : t('main.stepSwap')
            // }
            case 'bridge': {
                return t('main.stepBridge');
            }
            case 'swap': {
                return t('main.stepSwap');
            }
            default:
                return isCustomVariant
                    ? subvariantOptions?.custom === 'deposit'
                        ? t('main.stepDeposit')
                        : t('main.stepBuy')
                    : t('main.stepSwap');
        }
    };
    const formattedToAddress = shortenAddress(toAddress);
    const toAddressLink = toAddress
        ? getAddressLink(toAddress, step.action.toChainId)
        : undefined;
    return (_jsxs(Card, { type: stepHasError ? 'error' : 'default', children: [_jsxs(Box, { sx: {
                    display: 'flex',
                    flex: 1,
                }, children: [_jsx(CardTitle, { flex: 1, children: getCardTitle() }), _jsx(CardTitle, { sx: { fontWeight: 600 }, children: _jsx(StepTimer, { step: step }) })] }), _jsxs(Box, { sx: {
                    py: 1,
                }, children: [fromToken ? _jsx(Token, { token: fromToken, px: 2, py: 1 }) : null, step.execution?.process.map((process, index) => (_jsx(StepProcess, { step: step, process: process }, index))), formattedToAddress && toAddressLink ? (_jsx(DestinationWalletAddress, { step: step, toAddress: formattedToAddress, toAddressLink: toAddressLink })) : null, toToken ? (_jsx(Token, { token: toToken, impactToken: impactToken, enableImpactTokenTooltip: true, px: 2, py: 1 })) : null] })] }));
};
//# sourceMappingURL=Step.js.map