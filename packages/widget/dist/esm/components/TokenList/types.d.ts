import type { Account } from '@de1/wallet-management';
import type { ExtendedChain } from '@de1/widget-sdk';
import type { MouseEventHandler, MutableRefObject } from 'react';
import type { FormType } from '../../stores/form/types.js';
import type { TokenAmount } from '../../types/token.js';
export type TokenSourceFilter = 'all' | 'rwa';
export interface TokenListProps {
    parentRef: MutableRefObject<HTMLElement | null>;
    formType: FormType;
    height: number;
    tokenSourceFilter: TokenSourceFilter;
    onClick?(): void;
}
export interface VirtualizedTokenListProps {
    account: Account;
    tokens: TokenAmount[];
    scrollElementRef: MutableRefObject<HTMLElement | null>;
    isLoading: boolean;
    isBalanceLoading: boolean;
    chainId?: number;
    chain?: ExtendedChain;
    showCategories?: boolean;
    onClick(tokenAddress: string, chainId?: number): void;
}
export interface TokenListItemBaseProps {
    onClick?(tokenAddress: string, chainId?: number): void;
    size: number;
    start: number;
}
export interface TokenListItemProps extends TokenListItemBaseProps {
    accountAddress?: string;
    token: TokenAmount;
    chain?: ExtendedChain;
    isBalanceLoading?: boolean;
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
}
export interface TokenListItemButtonProps {
    onClick?: MouseEventHandler<HTMLDivElement>;
    accountAddress?: string;
    token: TokenAmount;
    chain?: ExtendedChain;
    isBalanceLoading?: boolean;
}
