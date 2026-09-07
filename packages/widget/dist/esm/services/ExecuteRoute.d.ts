import type { Account } from '@de1/wallet-management';
import type { Route } from '@de1/widget-sdk';
interface ExecuteRouteOptions {
    updateRouteHook?: (route: Route) => void;
    acceptExchangeRateUpdateHook?: (params: any) => Promise<boolean>;
    infiniteApproval?: boolean;
    executeInBackground?: boolean;
    account: Account;
    wagmiConfig: any;
    onDisconnect?: (account: Account) => Promise<void>;
    onOpenWalletMenu?: () => void;
    solanaWallet?: any;
    nearWallet?: any;
}
export declare function sendBTCWithPhantom(sender: string, recipient: string, amount: number): Promise<string>;
export declare function executeRoute(route: Route, options: ExecuteRouteOptions): Promise<Route>;
export {};
