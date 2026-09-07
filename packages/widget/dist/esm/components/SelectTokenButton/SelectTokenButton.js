import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Skeleton, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useChain } from '../../hooks/useChain.js';
import { useSwapOnly } from '../../hooks/useSwapOnly.js';
import { useToken } from '../../hooks/useToken.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { FormKeyHelper } from '../../stores/form/types.js';
import { useFieldValues } from '../../stores/form/useFieldValues.js';
import { navigationRoutes } from '../../utils/navigationRoutes.js';
import { AvatarBadgedDefault, AvatarBadgedSkeleton } from '../Avatar/Avatar.js';
import { TokenAvatar } from '../Avatar/TokenAvatar.js';
import { CardTitle } from '../Card/CardTitle.js';
import { AmountInput } from '../AmountInput/AmountInput.js';
import { CardContent, SelectTokenCard, SelectTokenCardHeader, } from './SelectTokenButton.style.js';
export const SelectTokenButton = ({ formType, compact }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { disabledUI, subvariant } = useWidgetConfig();
    const swapOnly = useSwapOnly();
    const tokenKey = FormKeyHelper.getTokenKey(formType);
    const [chainId, tokenAddress] = useFieldValues(FormKeyHelper.getChainKey(formType), tokenKey);
    const { chain, isLoading: isChainLoading } = useChain(chainId);
    const { token, isLoading: isTokenLoading } = useToken(chainId, tokenAddress);
    const handleClick = () => {
        navigate(formType === 'from'
            ? navigationRoutes.fromToken
            : subvariant === 'refuel'
                ? navigationRoutes.toTokenNative
                : navigationRoutes.toToken);
    };
    const isSelected = !!(chain && token);
    const onClick = !disabledUI?.includes(tokenKey) ? handleClick : undefined;
    const defaultPlaceholder = formType === 'to' && subvariant === 'refuel'
        ? t('main.selectChain')
        : formType === 'to' && swapOnly
            ? t('main.selectToken')
            : t('main.selectChainAndToken');
    const cardTitle = formType === 'from' && subvariant === 'custom'
        ? t('header.payWith')
        : t(`main.${formType}`);
    return (_jsx(SelectTokenCard, { component: "div", children: _jsxs(CardContent, { formType: formType, compact: compact, children: [_jsx(CardTitle, { children: cardTitle }), _jsxs(Box, { sx: { display: 'flex', flexDirection: 'row' }, children: [_jsx(Box, { flex: 1, display: "flex", alignItems: "center", justifyContent: "start", children: chainId && tokenAddress && (isChainLoading || isTokenLoading) ? (_jsx(SelectTokenCardHeader, { sx: { width: '50%' }, onClick: onClick, avatar: _jsx(AvatarBadgedSkeleton, {}), title: _jsx(Skeleton, { variant: "text", width: 64, height: 24 }), subheader: _jsx(Skeleton, { variant: "text", width: 72, height: 16 }), compact: compact })) : (_jsx(SelectTokenCardHeader, { sx: { width: '50%' }, onClick: onClick, avatar: isSelected ? (_jsx(TokenAvatar, { token: token, chain: chain })) : (_jsx(AvatarBadgedDefault, {})), title: isSelected ? token.symbol : defaultPlaceholder, titleTypographyProps: {
                                    title: isSelected ? token.symbol : defaultPlaceholder,
                                }, subheader: isSelected ? chain.name : null, subheaderTypographyProps: isSelected
                                    ? {
                                        title: chain.name,
                                    }
                                    : undefined, selected: isSelected, compact: compact })) }), _jsx(Box, { flex: 1, display: "flex", alignItems: "center", justifyContent: "end", children: _jsx(AmountInput, { sx: { width: '50%' }, formType: formType }) })] })] }) }));
};
//# sourceMappingURL=SelectTokenButton.js.map