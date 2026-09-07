import type { BoxProps } from '@mui/material';
import type { De1Step, TokenAmount } from '@de1/widget-sdk';
import type { FC } from 'react';
interface TokenProps {
    token: TokenAmount;
    impactToken?: TokenAmount;
    enableImpactTokenTooltip?: boolean;
    step?: De1Step;
    stepVisible?: boolean;
    disableDescription?: boolean;
    isLoading?: boolean;
}
export declare const Token: FC<TokenProps & BoxProps>;
export declare const TokenFallback: FC<TokenProps & BoxProps>;
export declare const TokenBase: FC<TokenProps & BoxProps>;
export declare const TokenSkeleton: FC<Partial<TokenProps> & BoxProps>;
export {};
