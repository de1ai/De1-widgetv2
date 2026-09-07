import { jsx as _jsx } from "react/jsx-runtime";
import { Badge, Skeleton } from '@mui/material';
import { AvatarDefault, AvatarDefaultBadge, AvatarSkeletonMaskedContainer, } from './Avatar.style.js';
import { SmallAvatarSkeleton } from './SmallAvatar.js';
export const AvatarBadgedDefault = ({ sx }) => {
    return (_jsx(Badge, { overlap: "circular", anchorOrigin: { vertical: 'bottom', horizontal: 'right' }, badgeContent: _jsx(AvatarDefaultBadge, {}), sx: sx, children: _jsx(AvatarDefault, {}) }));
};
export const AvatarBadgedSkeleton = ({ sx }) => {
    return (_jsx(Badge, { overlap: "circular", anchorOrigin: { vertical: 'bottom', horizontal: 'right' }, badgeContent: _jsx(SmallAvatarSkeleton, {}), sx: sx, children: _jsx(AvatarSkeleton, {}) }));
};
export const AvatarSkeleton = () => {
    return (_jsx(AvatarSkeletonMaskedContainer, { children: _jsx(Skeleton, { width: 40, height: 40, variant: "circular" }) }));
};
//# sourceMappingURL=Avatar.js.map