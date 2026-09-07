import type { CardProps } from '@mui/material';
import type { RouteExtended } from '@de1/widget-sdk';
interface TransactionDetailsProps extends CardProps {
    route?: RouteExtended;
}
export declare const TransactionDetails: React.FC<TransactionDetailsProps>;
export {};
