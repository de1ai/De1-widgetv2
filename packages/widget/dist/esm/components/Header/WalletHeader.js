import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ExpandMore, Wallet } from '@mui/icons-material';
import { Avatar, Badge } from '@mui/material';
import { getConnectorIcon, useAccount, useWalletMenu, } from '@de1/wallet-management';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChain } from '../../hooks/useChain.js';
import { useExternalWalletProvider } from '../../providers/WalletProvider/useExternalWalletProvider.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { useFieldValues } from '../../stores/form/useFieldValues.js';
import { HiddenUI } from '../../types/widget.js';
import { shortenAddress } from '../../utils/wallet.js';
import { SmallAvatar } from '../Avatar/SmallAvatar.js';
import { CloseDrawerButton } from './CloseDrawerButton.js';
import { DrawerWalletContainer, HeaderAppBar, WalletAvatar, WalletButton, } from './Header.style.js';
import { WalletMenu } from './WalletMenu.js';
import { WalletMenuContainer } from './WalletMenu.style.js';
const useInternalWalletManagement = () => {
    const { subvariant, hiddenUI } = useWidgetConfig();
    const { useExternalWalletProvidersOnly } = useExternalWalletProvider();
    const isSplitVariant = subvariant === 'split';
    const isWalletMenuHidden = hiddenUI?.includes(HiddenUI.WalletMenu);
    const shouldShowWalletMenu = !useExternalWalletProvidersOnly && !isWalletMenuHidden;
    return {
        shouldShowWalletMenu,
        isSplitVariant,
    };
};
export const WalletHeader = () => {
    const { shouldShowWalletMenu } = useInternalWalletManagement();
    return shouldShowWalletMenu ? (_jsx(HeaderAppBar, { elevation: 0, sx: { justifyContent: 'flex-end' }, children: _jsx(WalletMenuButton, {}) })) : null;
};
export const SplitWalletMenuButton = () => {
    const { shouldShowWalletMenu } = useInternalWalletManagement();
    return shouldShowWalletMenu ? _jsx(WalletMenuButton, {}) : null;
};
export const WalletMenuButton = () => {
    const { variant, hiddenUI } = useWidgetConfig();
    const { account, accounts } = useAccount();
    const [fromChainId] = useFieldValues('fromChain');
    const { chain: fromChain } = useChain(fromChainId);
    const activeAccount = (fromChain
        ? accounts.find((account) => account.chainType === fromChain.chainType)
        : undefined) || account;
    if (variant === 'drawer') {
        return (_jsxs(DrawerWalletContainer, { children: [activeAccount.isConnected ? (_jsx(ConnectedButton, { account: activeAccount })) : (_jsx(ConnectButton, {})), !hiddenUI?.includes(HiddenUI.DrawerCloseButton) ? (_jsx(CloseDrawerButton, { header: "wallet" })) : null] }));
    }
    return activeAccount.isConnected ? (_jsx(ConnectedButton, { account: activeAccount })) : (_jsx(ConnectButton, {}));
};
const ConnectButton = () => {
    const { t } = useTranslation();
    const { walletConfig, subvariant, variant } = useWidgetConfig();
    const { openWalletMenu } = useWalletMenu();
    const connect = async () => {
        if (!walletConfig?.usePartialWalletManagement && walletConfig?.onConnect) {
            walletConfig.onConnect();
            return;
        }
        openWalletMenu();
    };
    return (_jsx(WalletButton, { subvariant: subvariant, endIcon: variant !== 'drawer' && subvariant !== 'split' ? _jsx(Wallet, {}) : undefined, startIcon: variant === 'drawer' || subvariant === 'split' ? (_jsx(Wallet, { sx: { marginLeft: -0.25 } })) : undefined, onClick: connect, children: t('button.connectWallet') }));
};
const ConnectedButton = ({ account }) => {
    const { subvariant } = useWidgetConfig();
    const { chain } = useChain(account.chainId);
    const [anchorEl, setAnchorEl] = useState(null);
    const walletAddress = shortenAddress(account.address);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (_jsxs(_Fragment, { children: [_jsx(WalletButton, { subvariant: subvariant, endIcon: _jsx(ExpandMore, {}), startIcon: chain?.logoURI ? (_jsx(Badge, { overlap: "circular", anchorOrigin: { vertical: 'bottom', horizontal: 'right' }, badgeContent: _jsx(SmallAvatar, { src: chain?.logoURI, alt: chain?.name, sx: { width: 12, height: 12 }, children: chain?.name[0] }), children: _jsx(WalletAvatar, { src: getConnectorIcon(account.connector), alt: account.connector?.name, children: account.connector?.name[0] }) })) : (_jsx(Avatar, { src: getConnectorIcon(account.connector), alt: account.connector?.name, sx: { width: 24, height: 24 }, children: account.connector?.name[0] })), onClick: handleClick, children: walletAddress }), _jsx(WalletMenuContainer, { anchorEl: anchorEl, open: Boolean(anchorEl), onClose: handleClose, children: _jsx(WalletMenu, { onClose: handleClose }) })] }));
};
//# sourceMappingURL=WalletHeader.js.map