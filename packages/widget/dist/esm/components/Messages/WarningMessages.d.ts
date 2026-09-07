import type { BoxProps } from '@mui/material';
import type { Route } from '@de1/widget-sdk';
type WarningMessagesProps = BoxProps & {
    route?: Route;
    allowInteraction?: boolean;
};
export declare const WarningMessages: React.FC<WarningMessagesProps>;
export {};
