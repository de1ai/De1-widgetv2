import { persist } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';
import { hasEnumFlag } from '../../utils/enum.js';
import { RouteExecutionStatus } from './types.js';
import { isRouteDone, isRouteFailed, isRoutePartiallyDone, isRouteRefunded, } from './utils.js';
const replaceBigInts = (obj, visited = new WeakSet()) => {
    if (obj === null || obj === undefined) {
        return obj;
    }
    if (typeof obj === 'bigint') {
        return obj.toString();
    }
    // Detect circular references
    if (typeof obj === 'object' && visited.has(obj)) {
        return '[Circular Reference]';
    }
    if (Array.isArray(obj)) {
        visited.add(obj);
        const result = obj.map((item) => replaceBigInts(item, visited));
        visited.delete(obj);
        return result;
    }
    if (typeof obj === 'object') {
        visited.add(obj);
        const result = Object.fromEntries(Object.entries(obj).map(([key, value]) => [
            key,
            replaceBigInts(value, visited),
        ]));
        visited.delete(obj);
        return result;
    }
    return obj;
};
export const createRouteExecutionStore = ({ namePrefix }) => createWithEqualityFn(persist((set, get) => ({
    routes: {},
    setExecutableRoute: (route, observableRouteIds) => {
        if (!get().routes[route.id]) {
            set((state) => {
                const routes = { ...state.routes };
                // clean previous idle and done routes
                Object.keys(routes)
                    .filter((routeId) => (!observableRouteIds?.includes(routeId) &&
                    hasEnumFlag(routes[routeId].status, RouteExecutionStatus.Idle)) ||
                    hasEnumFlag(routes[routeId].status, RouteExecutionStatus.Done))
                    .forEach((routeId) => delete routes[routeId]);
                // Process BigInt before storing route
                const processedRoute = replaceBigInts(route);
                routes[route.id] = {
                    route: processedRoute,
                    status: RouteExecutionStatus.Idle,
                };
                return {
                    routes,
                };
            });
        }
    },
    updateRoute: (route) => {
        if (get().routes[route.id]) {
            const processedRoute = replaceBigInts(route);
            set((state) => {
                const updatedState = {
                    routes: {
                        ...state.routes,
                        [route.id]: {
                            ...state.routes[route.id],
                            route: processedRoute,
                        },
                    },
                };
                const isFailed = isRouteFailed(route);
                if (isFailed) {
                    updatedState.routes[route.id].status =
                        RouteExecutionStatus.Failed;
                    return updatedState;
                }
                const isDone = isRouteDone(route);
                if (isDone) {
                    updatedState.routes[route.id].status =
                        RouteExecutionStatus.Done;
                    if (isRoutePartiallyDone(route)) {
                        updatedState.routes[route.id].status |=
                            RouteExecutionStatus.Partial;
                    }
                    else if (isRouteRefunded(route)) {
                        updatedState.routes[route.id].status |=
                            RouteExecutionStatus.Refunded;
                    }
                    return updatedState;
                }
                const isLoading = route.steps.some((step) => step.execution);
                if (isLoading) {
                    updatedState.routes[route.id].status =
                        RouteExecutionStatus.Pending;
                }
                return updatedState;
            });
        }
    },
    restartRoute: (routeId) => {
        if (get().routes[routeId]) {
            set((state) => ({
                routes: {
                    ...state.routes,
                    [routeId]: {
                        ...state.routes[routeId],
                        status: RouteExecutionStatus.Pending,
                    },
                },
            }));
        }
    },
    deleteRoute: (routeId) => {
        if (get().routes[routeId]) {
            set((state) => {
                const routes = { ...state.routes };
                delete routes[routeId];
                return {
                    routes,
                };
            });
        }
    },
    deleteRoutes: (type) => set((state) => {
        const routes = { ...state.routes };
        Object.keys(routes)
            .filter((routeId) => type === 'completed'
            ? hasEnumFlag(routes[routeId]?.status ?? 0, RouteExecutionStatus.Done)
            : !hasEnumFlag(routes[routeId]?.status ?? 0, RouteExecutionStatus.Done))
            .forEach((routeId) => delete routes[routeId]);
        return {
            routes,
        };
    }),
}), {
    name: `${namePrefix || 'de1'}-widget-routes`,
    version: 2,
    partialize: (state) => ({ routes: state.routes }),
    merge: (persistedState, currentState) => {
        const state = {
            ...currentState,
            ...persistedState,
        };
        try {
            // Remove failed transactions from history after 1 day
            const currentTime = new Date().getTime();
            const oneDay = 1000 * 60 * 60 * 24;
            Object.values(state.routes).forEach((routeExecution) => {
                const startedAt = routeExecution?.route.steps
                    ?.find((step) => step.execution?.status === 'FAILED')
                    ?.execution?.process.find((process) => process.startedAt)
                    ?.startedAt ?? 0;
                const outdated = startedAt > 0 && currentTime - startedAt > oneDay;
                if (routeExecution?.route && outdated) {
                    delete state.routes[routeExecution.route.id];
                }
            });
        }
        catch (error) {
            console.error(error);
        }
        return state;
    },
}), Object.is);
//# sourceMappingURL=createRouteExecutionStore.js.map