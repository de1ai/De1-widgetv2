import { jsx as _jsx } from "react/jsx-runtime";
import { Badge } from '@mui/material';
import { useChain } from '../../hooks/useChain.js';
import { useToken } from '../../hooks/useToken.js';
import { AvatarBadgedSkeleton } from './Avatar.js';
import { AvatarDefaultBadge, AvatarMasked } from './Avatar.style.js';
import { SmallAvatar } from './SmallAvatar.js';
export const TokenAvatar = ({ token, chain, isLoading, sx }) => {
    if (!chain || !token?.logoURI) {
        return _jsx(TokenAvatarFallback, { token: token, isLoading: isLoading, sx: sx });
    }
    return (_jsx(TokenAvatarBase, { token: token, chain: chain, isLoading: isLoading, sx: sx }));
};
export const TokenAvatarFallback = ({ token, isLoading, sx }) => {
    const { chain } = useChain(token?.chainId);
    const { token: chainToken, isLoading: isLoadingToken } = useToken(token?.chainId, token?.address);
    return (_jsx(TokenAvatarBase, { token: chainToken ?? token, isLoading: isLoading || isLoadingToken, chain: chain, sx: sx }));
};
export const TokenAvatarBase = ({ token, chain, isLoading, sx }) => {
    return isLoading ? (_jsx(AvatarBadgedSkeleton, {})) : (_jsx(Badge, { overlap: "circular", anchorOrigin: { vertical: 'bottom', horizontal: 'right' }, badgeContent: chain ? (_jsx(SmallAvatar, { src: chain.logoURI, alt: chain.name, children: chain.name[0] })) : (_jsx(AvatarDefaultBadge, {})), sx: sx, children: _jsx(AvatarMasked, { src: token?.logoURI, alt: token?.symbol, children: token?.symbol?.[0] }) }));
};
//# sourceMappingURL=TokenAvatar.js.map