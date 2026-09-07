import type { Route } from '@de1/widget-sdk';
import type { RouteLabel, RouteLabelRule } from '../../types/widget.js';
export declare const getMatchingLabels: (route: Route, routeLabels?: RouteLabelRule[]) => RouteLabel[];
