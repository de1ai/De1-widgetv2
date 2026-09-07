import type { SxProps, Theme } from '@mui/material';
import type { Chain, StaticToken } from '@de1/widget-sdk';
export declare const TokenAvatar: React.FC<{
    token?: StaticToken;
    chain?: Chain;
    isLoading?: boolean;
    sx?: SxProps<Theme>;
}>;
export declare const TokenAvatarFallback: React.FC<{
    token?: StaticToken;
    isLoading?: boolean;
    sx?: SxProps<Theme>;
}>;
export declare const TokenAvatarBase: React.FC<{
    token?: StaticToken;
    chain?: Chain;
    isLoading?: boolean;
    sx?: SxProps<Theme>;
}>;
