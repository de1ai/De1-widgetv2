import type { ToolsResponse } from '@de1/widget-sdk';
import type { WidgetBridgesConfig } from '../types/widget.js';
import type { SwapProvider } from './adapters/index.js';
export declare function getAdapterKey(adapter: SwapProvider | string): string;
export declare function getCrossChainBridgeTools(bridgesConfig?: WidgetBridgesConfig): ToolsResponse['bridges'];
export declare function isBridgeAdapterEnabled(adapter: SwapProvider, disabledBridges?: string[], bridgesConfig?: WidgetBridgesConfig): boolean;
