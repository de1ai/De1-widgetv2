import type { PersistStoreProps } from '../types.js';
import type { RouteExecutionState } from './types.js';
export declare const createRouteExecutionStore: ({ namePrefix }: PersistStoreProps) => import("zustand/traditional").UseBoundStoreWithEqualityFn<import("zustand").StoreApi<RouteExecutionState>>;
