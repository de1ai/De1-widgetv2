import type { RouteExtended, Token } from '@de1/widget-sdk'
import { formatTokenPrice } from './format.js'

interface GetPriceImpractProps {
  fromToken: Token
  toToken: Token
  fromAmount?: bigint
  toAmount?: bigint
}

/** Parse De¹ Exchange `price_impact` (e.g. `"0.06%"`) to decimal for i18n percent formatter */
export function parseApiPriceImpact(
  value?: string | number | null
): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return undefined
  }

  const isPercent = trimmed.endsWith('%')
  const numeric = Number.parseFloat(trimmed.replace('%', ''))
  if (Number.isNaN(numeric)) {
    return undefined
  }

  return isPercent ? numeric / 100 : numeric
}

type RouteWithApiPriceImpact = RouteExtended & {
  price_impact?: string | number
  priceImpact?: string | number
}

export function resolveRoutePriceImpact(route: RouteWithApiPriceImpact): number {
  const apiPriceImpact = parseApiPriceImpact(route.price_impact)
  if (apiPriceImpact !== undefined) {
    return apiPriceImpact
  }

  return getPriceImpact({
    fromAmount: BigInt(route.fromAmount),
    toAmount: BigInt(route.toAmount),
    fromToken: route.fromToken,
    toToken: route.toToken,
  })
}

export const getPriceImpact = ({
  fromToken,
  toToken,
  fromAmount,
  toAmount,
}: GetPriceImpractProps) => {
  const fromTokenPrice = formatTokenPrice(
    fromAmount,
    fromToken.priceUSD,
    fromToken.decimals
  )
  const toTokenPrice = formatTokenPrice(
    toAmount,
    toToken.priceUSD,
    toToken.decimals
  )

  if (!fromTokenPrice || !toTokenPrice) {
    return 0
  }
  // console.log('fromTokenPrice', fromTokenPrice)
  // console.log('toTokenPrice', toTokenPrice)
  // console.log('fromTokenPrice / toTokenPrice', fromTokenPrice / toTokenPrice)
  const priceImpact = toTokenPrice / fromTokenPrice - 1

  return priceImpact
}
