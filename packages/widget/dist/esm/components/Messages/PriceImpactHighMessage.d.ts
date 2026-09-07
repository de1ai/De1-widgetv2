import { type BoxProps } from '@mui/material';
interface PriceImpactHighMessageProps extends BoxProps {
    onAcknowledge?: (acknowledged: boolean) => void;
}
export declare const PriceImpactHighMessage: React.FC<PriceImpactHighMessageProps>;
export {};
