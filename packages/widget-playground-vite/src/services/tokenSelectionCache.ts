import type { WidgetConfig } from '@de1/widget'

export const TOKEN_SELECTION_CACHE_KEY = 'de1-widget-token-selection'

export type CachedTokenSelection = Pick<
  WidgetConfig,
  'fromChain' | 'fromToken' | 'toChain' | 'toToken'
>

export function isSwapSelection(
  selection: Partial<CachedTokenSelection>
): selection is CachedTokenSelection {
  const { fromChain, toChain, fromToken, toToken } = selection

  return (
    fromChain !== undefined &&
    fromChain === toChain &&
    Boolean(fromToken) &&
    Boolean(toToken)
  )
}

export function loadTokenSelection(): CachedTokenSelection | null {
  try {
    const raw = localStorage.getItem(TOKEN_SELECTION_CACHE_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as CachedTokenSelection
    if (!isSwapSelection(parsed)) {
      return null
    }

    return parsed
  } catch {
    return null
  }
}

export function saveTokenSelection(selection: CachedTokenSelection): void {
  if (!isSwapSelection(selection)) {
    return
  }

  try {
    localStorage.setItem(TOKEN_SELECTION_CACHE_KEY, JSON.stringify(selection))
  } catch {
    // ignore quota / private mode errors
  }
}

export function clearTokenSelection(): void {
  try {
    localStorage.removeItem(TOKEN_SELECTION_CACHE_KEY)
  } catch {
    // ignore
  }
}

export function applyTokenSelectionCache(
  config: Partial<WidgetConfig>
): Partial<WidgetConfig> {
  const cached = loadTokenSelection()
  if (!cached) {
    return config
  }

  return {
    ...config,
    fromChain: config.fromChain ?? cached.fromChain,
    fromToken: config.fromToken ?? cached.fromToken,
    toChain: config.toChain ?? cached.toChain,
    toToken: config.toToken ?? cached.toToken,
  }
}
