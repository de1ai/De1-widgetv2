import type { RouteExtended } from '@de1/widget-sdk'
import { resolveRoutePriceImpact } from '../utils/getPriceImpact.js'

export const usePriceImpact = (route?: RouteExtended) => {
  const priceImpact = route ? resolveRoutePriceImpact(route) : 0

  return {
    priceImpact,
  }
}
