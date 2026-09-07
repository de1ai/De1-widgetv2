import { jsx as _jsx } from "react/jsx-runtime";
import { Dialog as MuiDialog } from '@mui/material';
import { useGetScrollableContainer } from '../hooks/useScrollableContainer.js';
export const modalProps = {
    sx: {
        position: 'absolute',
        overflow: 'hidden',
    },
};
export const paperProps = {
    sx: (theme) => ({
        position: 'absolute',
        backgroundImage: 'none',
        backgroundColor: theme.palette.background.default,
        borderTopLeftRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
    }),
};
export const slotProps = {
    backdrop: {
        sx: {
            position: 'absolute',
            backgroundColor: 'rgb(0 0 0 / 32%)',
            backdropFilter: 'blur(3px)',
        },
    },
};
export const Dialog = ({ children, open, onClose, }) => {
    const getContainer = useGetScrollableContainer();
    return (_jsx(MuiDialog, { container: getContainer, open: open, onClose: onClose, sx: modalProps.sx, PaperProps: paperProps, slotProps: slotProps, children: children }));
};
//# sourceMappingURL=Dialog.js.map