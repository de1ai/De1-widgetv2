import {
  ChainId,
  getGasRecommendation,
} from '@de1/widget-sdk'
import { useQuery } from '@tanstack/react-query'
import { useAvailableChains } from './useAvailableChains.js'

const refetchInterval = 60_000

export const useGasRecommendation = (
  toChainId?: ChainId,
  fromChain?: ChainId,
  fromToken?: string
) => {
  const { chains } = useAvailableChains()

  const fromIsNear = fromChain === ChainId.NEAR

  const checkRecommendationLiFuel =
    Boolean(toChainId) &&
    Boolean(fromChain) &&
    !fromIsNear &&
    Boolean(fromToken) &&
    Boolean(chains?.length)

  const checkRecommendationMaxButton =
    Boolean(toChainId) && !fromChain && !fromToken && Boolean(chains?.length)

  return useQuery({
    queryKey: ['gas-recommendation', toChainId, fromChain, fromToken],
    queryFn: async ({
      queryKey: [_, toChainId, fromChain, fromToken],
      signal,
    }) => {
      // Li.Fuel / gas estimates are not supported when the source chain is Near
      if (fromChain === ChainId.NEAR) {
        return null
      }
      if (!chains?.some((chain) => chain.id === toChainId)) {
        return null
      }
      const gasRecommendation = await getGasRecommendation(
        {
          chainId: toChainId as ChainId,
          fromChain: fromChain as ChainId,
          fromToken: fromToken as string,
        },
        { signal }
      )
      return gasRecommendation
    },
    enabled: checkRecommendationLiFuel || checkRecommendationMaxButton,
    refetchInterval,
    staleTime: refetchInterval,
  })
}
