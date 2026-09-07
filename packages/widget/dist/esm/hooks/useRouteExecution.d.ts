import type { ExchangeRateUpdateParams } from '@de1/widget-sdk';
interface RouteExecutionProps {
    routeId: string;
    executeInBackground?: boolean;
    onAcceptExchangeRateUpdate?(resolver: (value: boolean) => void, data: ExchangeRateUpdateParams): void;
}
export declare const useRouteExecution: ({ routeId, executeInBackground, onAcceptExchangeRateUpdate, }: RouteExecutionProps) => {
    executeRoute: () => void;
    restartRoute: () => void;
    deleteRoute: () => void;
    route: import("@de1/widget-sdk").RouteExtended;
    status: import("../stores/routes/types.js").RouteExecutionStatus;
};
export {};
