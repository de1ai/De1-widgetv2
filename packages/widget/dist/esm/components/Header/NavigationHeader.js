import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Typography } from '@mui/material';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useNavigateBack } from '../../hooks/useNavigateBack.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { useHeaderStore } from '../../stores/header/useHeaderStore.js';
import { HiddenUI } from '../../types/widget.js';
import { backButtonRoutes, navigationRoutes, navigationRoutesValues, } from '../../utils/navigationRoutes.js';
import { BackButton } from './BackButton.js';
import { CloseDrawerButton } from './CloseDrawerButton.js';
import { HeaderAppBar, HeaderControlsContainer } from './Header.style.js';
import { NavigationTabs } from './NavigationTabs.js';
import { SettingsButton } from './SettingsButton.js';
// import { TransactionHistoryButton } from './TransactionHistoryButton.js'
// import { SplitWalletMenuButton } from './WalletHeader.js'
export const NavigationHeader = () => {
    const { hiddenUI, variant, subvariant } = useWidgetConfig();
    const { navigateBack } = useNavigateBack();
    // const { account } = useAccount()
    const { element, title } = useHeaderStore((state) => state);
    const { pathname } = useLocation();
    const cleanedPathname = pathname.endsWith('/')
        ? pathname.slice(0, -1)
        : pathname;
    const path = cleanedPathname.substring(cleanedPathname.lastIndexOf('/') + 1);
    const hasPath = navigationRoutesValues.includes(path);
    const splitSubvariant = subvariant === 'split' && !hasPath;
    return (_jsxs(_Fragment, { children: [_jsxs(HeaderAppBar, { elevation: 0, children: [backButtonRoutes.includes(path) ? (_jsx(BackButton, { onClick: navigateBack })) : null, _jsx(Typography, { align: hasPath ? 'center' : 'left', noWrap: true, sx: {
                            fontSize: hasPath ? 18 : 24,
                            fontWeight: '700',
                            flex: 1,
                        }, children: title }), _jsxs(Routes, { children: [_jsx(Route, { path: navigationRoutes.home, element: _jsxs(HeaderControlsContainer, { children: [_jsx(SettingsButton, {}), variant === 'drawer' &&
                                            !hiddenUI?.includes(HiddenUI.DrawerCloseButton) ? (_jsx(CloseDrawerButton, { header: "navigation" })) : null] }) }), _jsx(Route, { path: "*", element: element || (_jsx(Box, { sx: {
                                        width: 28,
                                        height: 40,
                                    } })) })] })] }), _jsx(Box, { sx: {
                    display: pathname === navigationRoutes.home && splitSubvariant
                        ? 'block'
                        : 'none',
                }, children: _jsx(NavigationTabs, {}) })] }));
};
//# sourceMappingURL=NavigationHeader.js.map