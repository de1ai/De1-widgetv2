import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Box, Collapse } from '@mui/material';
import { isGaslessStep } from '@de1/widget-sdk';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { HiddenUI } from '../../types/widget.js';
import { Card } from '../Card/Card.js';
import { CardIconButton } from '../Card/CardIconButton.js';
import { CardLabel, CardLabelTypography } from '../Card/CardLabel.js';
import { StepActions } from '../StepActions/StepActions.js';
import { Token } from '../Token/Token.js';
import { TokenContainer } from './RouteCard.style.js';
import { RouteCardEssentials } from './RouteCardEssentials.js';
import { RouteCardEssentialsExpanded } from './RouteCardEssentialsExpanded.js';
import { getMatchingLabels } from './getMatchingLabels.js';
export const RouteCard = ({ route, active, variant = 'default', expanded: defaulExpanded, ...other }) => {
    const { t } = useTranslation();
    const { subvariant, subvariantOptions, routeLabels, hiddenUI } = useWidgetConfig();
    const [cardExpanded, setCardExpanded] = useState(defaulExpanded);
    const handleExpand = (e) => {
        e.stopPropagation();
        setCardExpanded((expanded) => !expanded);
    };
    const token = subvariant === 'custom' && subvariantOptions?.custom !== 'deposit'
        ? { ...route.fromToken, amount: BigInt(route.fromAmount) }
        : { ...route.toToken, amount: BigInt(route.toAmount) };
    const impactToken = subvariant !== 'custom'
        ? { ...route.fromToken, amount: BigInt(route.fromAmount) }
        : undefined;
    const customLabels = getMatchingLabels(route, routeLabels);
    const mainTag = route.tags?.find((tag) => tag === 'CHEAPEST' || tag === 'FASTEST');
    const tags = mainTag ? [mainTag] : [];
    const hasGaslessSupport = route.steps.some(isGaslessStep);
    if (hasGaslessSupport) {
        tags.push('GASLESS');
    }
    const cardContent = (_jsxs(Box, { sx: {
            flex: 1,
        }, children: [subvariant !== 'refuel' && (tags.length || customLabels.length) ? (_jsxs(Box, { sx: {
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    gap: 1,
                    flexWrap: 'wrap',
                }, children: [tags?.map((tag) => (_jsx(CardLabel, { variant: tag === 'GASLESS' ? 'success' : active ? 'secondary' : undefined, children: _jsx(CardLabelTypography, { children: t(`main.tags.${tag.toLowerCase()}`) }) }, tag))), customLabels.map((label, index) => (_jsx(CardLabel, { sx: label.sx, children: _jsx(CardLabelTypography, { children: label.text }) }, index)))] })) : null, _jsxs(TokenContainer, { children: [_jsx(Token, { token: token, impactToken: impactToken, step: route.steps[0], stepVisible: !cardExpanded, disableDescription: hiddenUI?.includes(HiddenUI.RouteTokenDescription) }), !defaulExpanded ? (_jsx(CardIconButton, { onClick: handleExpand, size: "small", children: cardExpanded ? (_jsx(ExpandLess, { fontSize: "inherit" })) : (_jsx(ExpandMore, { fontSize: "inherit" })) })) : null] }), _jsxs(Collapse, { timeout: 225, in: cardExpanded, mountOnEnter: true, unmountOnExit: true, children: [route.steps.map((step) => (_jsx(StepActions, { step: step, mt: 2 }, step.id))), _jsx(RouteCardEssentialsExpanded, { route: route })] }), _jsx(RouteCardEssentials, { route: route })] }));
    return subvariant === 'refuel' || variant === 'cardless' ? (cardContent) : (_jsx(Card, { type: active ? 'selected' : 'default', selectionColor: "secondary", indented: true, ...other, children: cardContent }));
};
//# sourceMappingURL=RouteCard.js.map