import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { List, ListItemAvatar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TokenAvatar } from '../components/Avatar/TokenAvatar.js';
import { ListItemButton } from '../components/ListItemButton.js';
import { ListItemText } from '../components/ListItemText.js';
import { PageContainer } from '../components/PageContainer.js';
import { useTokenSelect } from '../components/TokenList/useTokenSelect.js';
import { useChains } from '../hooks/useChains.js';
import { useNavigateBack } from '../hooks/useNavigateBack.js';
export const SelectNativeTokenPage = ({ formType, }) => {
    const { t } = useTranslation();
    const { navigateBack } = useNavigateBack();
    const { chains } = useChains();
    const selectToken = useTokenSelect(formType, navigateBack);
    return (_jsx(PageContainer, { disableGutters: true, children: _jsx(List, { sx: {
                paddingTop: 0,
                paddingLeft: 1.5,
                paddingRight: 1.5,
                paddingBottom: 1.5,
            }, children: chains?.map((chain) => (_jsxs(ListItemButton, { onClick: () => selectToken(chain.nativeToken.address, chain.id), children: [_jsx(ListItemAvatar, { children: _jsx(TokenAvatar, { token: chain.nativeToken, chain: chain }) }), _jsx(ListItemText, { primary: chain.nativeToken.symbol, secondary: t('main.onChain', { chainName: chain.name }) })] }, chain.id))) }) }));
};
//# sourceMappingURL=SelectNativeTokenPage.js.map