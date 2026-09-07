import type { ToolsResponse } from '@de1/widget-sdk'
import type { WidgetBridgesConfig } from '../types/widget.js'
import { isItemAllowed } from '../utils/item.js'
import type { SwapProvider } from './adapters/index.js'
import { CrossChainSwapFactory } from './factory.js'

export function getAdapterKey(adapter: SwapProvider | string): string {
  const name = typeof adapter === 'string' ? adapter : adapter.getName()
  return name.toLowerCase()
}

export function getCrossChainBridgeTools(
  bridgesConfig?: WidgetBridgesConfig
): ToolsResponse['bridges'] {
  return CrossChainSwapFactory.getAllAdapters()
    .map((adapter) => ({
      key: getAdapterKey(adapter),
      name: adapter.getName(),
      logoURI: adapter.getIcon(),
      supportedChains: [],
    }))
    .filter((bridge) => isItemAllowed(bridge.key, bridgesConfig))
}

export function isBridgeAdapterEnabled(
  adapter: SwapProvider,
  disabledBridges: string[] = [],
  bridgesConfig?: WidgetBridgesConfig
): boolean {
  const key = getAdapterKey(adapter)
  if (!isItemAllowed(key, bridgesConfig)) {
    return false
  }
  return !disabledBridges.includes(key)
}
