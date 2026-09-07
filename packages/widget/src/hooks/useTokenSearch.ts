import type { TokensResponse } from '@de1/widget-sdk'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { De1Service } from '../services/De1Service.js'
import type { TokenAmount } from '../types/token.js'

export const useTokenSearch = (
  chainId?: number,
  tokenQuery?: string,
  enabled?: boolean
) => {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['token-search', chainId, tokenQuery],
    queryFn: async ({ queryKey: [, chainId, tokenQuery], signal }) => {
      const token = await De1Service.getTokenInfo(
        chainId?.toString() || '',
        tokenQuery as string
      )

      if (token) {
        queryClient.setQueriesData<TokensResponse>(
          { queryKey: ['tokens'] },
          (data) => {
            if (
              data &&
              !data.tokens[chainId as number]?.some(
                (t) => t.address === token.address
              )
            ) {
              const clonedData = { ...data }
              clonedData.tokens[chainId as number]?.push(token as TokenAmount)
              return clonedData
            }
          }
        )
      }
      return token as TokenAmount
    },
    enabled: Boolean(chainId && tokenQuery && enabled),
    retry: false,
  })
  return {
    token: data,
    isLoading,
  }
}
