import type { Dispatch, SetStateAction } from 'react';
export interface RouteTrackerProps {
    observableRouteId: string;
    onChange: Dispatch<SetStateAction<string>>;
    onFetching: Dispatch<SetStateAction<boolean>>;
}
export declare const RouteTracker: ({ observableRouteId, onChange, onFetching, }: RouteTrackerProps) => import("react/jsx-runtime").JSX.Element;
