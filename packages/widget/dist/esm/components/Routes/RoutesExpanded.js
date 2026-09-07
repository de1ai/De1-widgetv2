import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Collapse, Grow, Stack, Typography } from '@mui/material';
import { useAccount } from '@de1/wallet-management';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useRoutes as useDOMRoutes, useNavigate } from 'react-router-dom';
import { useRoutes } from '../../hooks/useRoutes.js';
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js';
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { useFieldValues } from '../../stores/form/useFieldValues.js';
import { WidgetEvent } from '../../types/events.js';
import { navigationRoutes } from '../../utils/navigationRoutes.js';
import { PageContainer } from '../PageContainer.js';
import { ProgressToNextUpdate } from '../ProgressToNextUpdate.js';
import { RouteCard } from '../RouteCard/RouteCard.js';
import { RouteCardSkeleton } from '../RouteCard/RouteCardSkeleton.js';
import { RouteNotFoundCard } from '../RouteCard/RouteNotFoundCard.js';
import { CollapseContainer, Container, Header, RouteTopLevelGrow, RoutesExpandedCollapse, ScrollableContainer, } from './RoutesExpanded.style.js';
const timeout = { enter: 225, exit: 225, appear: 0 };
const routes = [
    {
        path: '/',
        element: true,
    },
    {
        path: '*',
        element: null,
    },
];
export const RoutesExpanded = () => {
    const element = useDOMRoutes(routes);
    const match = Boolean(element?.props?.children);
    return (_jsx(CollapseContainer, { children: _jsx(Collapse, { timeout: timeout, in: match, orientation: "horizontal", children: _jsx(RouteTopLevelGrow, { timeout: timeout, in: match, mountOnEnter: true, unmountOnExit: true, children: _jsx("div", { children: _jsx(RoutesExpandedElement, {}) }) }) }) }));
};
export const RoutesExpandedElement = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { subvariant, subvariantOptions } = useWidgetConfig();
    const routesRef = useRef(undefined);
    const emitter = useWidgetEvents();
    const routesActiveRef = useRef(false);
    const { routes, isLoading, isFetching, isFetched, dataUpdatedAt, refetchTime, fromChain, refetch, setReviewableRoute, } = useRoutes();
    const { account } = useAccount({ chainType: fromChain?.chainType });
    const [toAddress] = useFieldValues('toAddress');
    const { requiredToAddress } = useToAddressRequirements();
    const handleRouteClick = (route) => {
        setReviewableRoute(route);
        navigate(navigationRoutes.transactionExecution, {
            state: { routeId: route.id },
        });
        emitter.emit(WidgetEvent.RouteSelected, { route, routes: routes });
    };
    const onExit = () => {
        // Clean routes cache on exit
        routesRef.current = undefined;
    };
    // We cache routes results in ref for a better exit animation
    if (routesRef.current && !routes) {
        routesActiveRef.current = false;
    }
    else {
        routesRef.current = routes;
        routesActiveRef.current = Boolean(routes);
    }
    const currentRoute = routesRef.current?.[0];
    const expanded = Boolean(routesActiveRef.current || isLoading || isFetching || isFetched);
    const routeNotFound = !currentRoute && !isLoading && !isFetching && expanded;
    const toAddressUnsatisfied = currentRoute && requiredToAddress && !toAddress;
    const allowInteraction = account.isConnected && !toAddressUnsatisfied;
    useEffect(() => {
        emitter.emit(WidgetEvent.WidgetExpanded, expanded);
    }, [emitter, expanded]);
    const title = subvariant === 'custom'
        ? subvariantOptions?.custom === 'deposit'
            ? t('header.deposit')
            : t('header.youPay')
        : t('header.receive');
    return (_jsx(RoutesExpandedCollapse, { timeout: timeout.enter, in: expanded, orientation: "horizontal", onExited: onExit, children: _jsx(Grow, { timeout: timeout.enter, in: expanded, mountOnEnter: true, unmountOnExit: true, children: _jsx(Container, { enableColorScheme: true, minimumHeight: isLoading, children: _jsxs(ScrollableContainer, { children: [_jsxs(Header, { children: [_jsx(Typography, { noWrap: true, sx: {
                                        fontSize: 18,
                                        fontWeight: '700',
                                        flex: 1,
                                    }, children: title }), _jsx(ProgressToNextUpdate, { updatedAt: dataUpdatedAt || new Date().getTime(), timeToUpdate: refetchTime, isLoading: isFetching, onClick: () => refetch(), sx: { marginRight: -1 } })] }), _jsx(PageContainer, { children: _jsx(Stack, { direction: "column", spacing: 2, sx: {
                                    flex: 1,
                                    paddingBottom: 3,
                                }, children: routeNotFound ? (_jsx(RouteNotFoundCard, {})) : isLoading || (isFetching && !routesRef.current?.length) ? (Array.from({ length: 3 }).map((_, index) => (_jsx(RouteCardSkeleton, {}, index)))) : (routesRef.current?.map((route, index) => (_jsx(RouteCard, { route: route, onClick: allowInteraction
                                        ? () => handleRouteClick(route)
                                        : undefined, active: index === 0, expanded: routesRef.current?.length === 1 }, index)))) }) })] }) }) }) }));
};
//# sourceMappingURL=RoutesExpanded.js.map