import type { Account } from '@de1/wallet-management';
import type { ToAddress } from '../../types/widget.js';
interface AccountAvatarProps {
    chainId?: number;
    account?: Account;
    toAddress?: ToAddress;
    empty?: boolean;
}
export declare const AccountAvatar: ({ chainId, account, empty, toAddress, }: AccountAvatarProps) => import("react/jsx-runtime").JSX.Element;
export {};
