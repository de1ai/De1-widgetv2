import { jsx as _jsx } from "react/jsx-runtime";
import { CloseRounded } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDrawer } from '../../AppDrawerContext.js';
import { useExternalWalletProvider } from '../../providers/WalletProvider/useExternalWalletProvider.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
export const CloseDrawerButton = ({ header }) => {
    const { t } = useTranslation();
    const { subvariant } = useWidgetConfig();
    const { closeDrawer } = useDrawer();
    const { useExternalWalletProvidersOnly } = useExternalWalletProvider();
    const showInNavigationHeader = header === 'navigation' &&
        (useExternalWalletProvidersOnly || subvariant === 'split');
    const showInWalletHeader = header === 'wallet' && subvariant !== 'split';
    return showInNavigationHeader || showInWalletHeader ? (_jsx(Tooltip, { title: t('button.close'), children: _jsx(IconButton, { size: "medium", onClick: closeDrawer, children: _jsx(CloseRounded, {}) }) })) : null;
};
//# sourceMappingURL=CloseDrawerButton.js.map