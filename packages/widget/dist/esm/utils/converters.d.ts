import type { FullStatusData, ToolsResponse } from '@de1/widget-sdk';
import type { RouteExecution } from '../stores/routes/types.js';
export declare const buildRouteFromTxHistory: (tx: FullStatusData, tools?: ToolsResponse) => RouteExecution;
