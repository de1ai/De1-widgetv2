import type { Route } from '@de1/widget-sdk';
interface RoutesProps {
    observableRoute?: Route;
}
export declare const useRoutes: ({ observableRoute }?: RoutesProps) => {
    routes: Route[];
    isLoading: boolean;
    isFetching: boolean;
    isFetched: boolean;
    dataUpdatedAt: number;
    refetchTime: number;
    refetch: (options?: import("@tanstack/react-query").RefetchOptions) => Promise<import("@tanstack/react-query").QueryObserverResult<Route[], Error>>;
    fromChain: import("@de1/widget-sdk").ExtendedChain;
    toChain: import("@de1/widget-sdk").ExtendedChain;
    queryKey: readonly ["routes", string, number, string, string, string, number, string, string, import("@de1/widget-sdk").ContractCall[], string, boolean, string[], string[], string[], string[], "RECOMMENDED" | "FASTEST" | "CHEAPEST" | "SAFEST", import("../index.js").WidgetSubvariant, boolean, boolean, string, number, string, string, boolean, string];
    setReviewableRoute: (route: Route) => void;
};
export {};
