import { jsx as _jsx } from "react/jsx-runtime";
import { Avatar, Skeleton, styled } from '@mui/material';
import { AvatarSkeletonContainer } from './Avatar.style.js';
export const SmallAvatar = styled(Avatar)(({ theme }) => ({
    background: theme.palette.background.paper,
    width: 16,
    height: 16,
}));
export const SmallAvatarSkeleton = () => {
    return (_jsx(AvatarSkeletonContainer, { children: _jsx(Skeleton, { width: 16, height: 16, variant: "circular" }) }));
};
//# sourceMappingURL=SmallAvatar.js.map