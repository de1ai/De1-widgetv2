import { jsx as _jsx } from "react/jsx-runtime";
import { Wallet } from '@mui/icons-material';
import { Badge } from '@mui/material';
import { getConnectorIcon } from '@de1/wallet-management';
import { useChain } from '../../hooks/useChain.js';
import { AvatarDefault, AvatarDefaultBadge, AvatarMasked, } from './Avatar.style.js';
import { SmallAvatar } from './SmallAvatar.js';
export const AccountAvatar = ({ chainId, account, empty, toAddress, }) => {
    const { chain } = useChain(chainId);
    const avatar = empty ? (_jsx(AvatarDefault, {})) : account?.connector || toAddress?.logoURI ? (_jsx(AvatarMasked, { src: toAddress?.logoURI || getConnectorIcon(account?.connector), alt: toAddress?.name || account?.connector?.name, children: (toAddress?.name || account?.connector?.name)?.[0] })) : (_jsx(AvatarDefault, { children: _jsx(Wallet, { sx: { fontSize: 20 } }) }));
    return (_jsx(Badge, { overlap: "circular", anchorOrigin: { vertical: 'bottom', horizontal: 'right' }, badgeContent: chain ? (_jsx(SmallAvatar, { src: chain.logoURI, alt: chain.name, children: chain.name[0] })) : (_jsx(AvatarDefaultBadge, {})), children: avatar }));
};
//# sourceMappingURL=AccountAvatar.js.map