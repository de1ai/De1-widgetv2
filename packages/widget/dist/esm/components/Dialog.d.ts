import type { DialogProps, PaperProps } from '@mui/material';
import type { PropsWithChildren } from 'react';
export declare const modalProps: {
    sx: {
        position: string;
        overflow: string;
    };
};
export declare const paperProps: Partial<PaperProps>;
export declare const slotProps: {
    backdrop: {
        sx: {
            position: string;
            backgroundColor: string;
            backdropFilter: string;
        };
    };
};
export declare const Dialog: React.FC<PropsWithChildren<DialogProps>>;
