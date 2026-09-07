import { useAccount } from '@de1/wallet-management'
import { useMemo } from 'react'
import type { TokenAmount } from '../types/token.js'
import { useToken } from './useToken.js'
import { useTokenBalance } from './useTokenBalance.js'
import { useTokenBalances } from './useTokenBalances.js'
import { isNativeToken } from './useTokens.js'

function isSameTokenAddress(addressA?: string, addressB?: string): boolean {
  if (!addressA || !addressB) {
    return false
  }

  if (addressA.toLowerCase() === addressB.toLowerCase()) {
    return true
  }

  return isNativeToken(addressA) && isNativeToken(addressB)
}

export const useTokenAddressBalance = (
  chainId?: number,
  tokenAddress?: string
) => {
  const {
    tokens,
    tokensWithBalance,
    chain,
    isBalanceLoading,
    refetch: refetchBulkBalances,
  } = useTokenBalances(chainId)
  const { account } = useAccount({ chainType: chain?.chainType })
  const { token: tokenMeta, isLoading: isTokenMetaLoading } = useToken(
    chainId,
    tokenAddress
  )

  const bulkToken = useMemo(() => {
    if (!tokenAddress || !chainId) {
      return undefined
    }

    return (tokensWithBalance ?? tokens)?.find(
      (token: TokenAmount) =>
        token.chainId === chainId &&
        isSameTokenAddress(token.address, tokenAddress)
    )
  }, [chainId, tokenAddress, tokens, tokensWithBalance])

  const needsIndividualBalance = Boolean(
    account?.address &&
      tokenMeta &&
      (!bulkToken || bulkToken.amount === undefined)
  )

  const {
    token: individualBalance,
    isLoading: isIndividualBalanceLoading,
    refetch: refetchIndividualBalance,
  } = useTokenBalance(
    needsIndividualBalance ? account?.address : undefined,
    needsIndividualBalance ? tokenMeta : undefined
  )

  const token = useMemo(() => {
    if (bulkToken?.amount !== undefined) {
      return bulkToken
    }

    if (individualBalance) {
      return individualBalance
    }

    return bulkToken ?? tokenMeta
  }, [bulkToken, individualBalance, tokenMeta])

  const refetch = async () => {
    await refetchBulkBalances()
    if (needsIndividualBalance) {
      await refetchIndividualBalance()
    }
  }

  return {
    token,
    chain,
    isLoading:
      isBalanceLoading ||
      isTokenMetaLoading ||
      (needsIndividualBalance && isIndividualBalanceLoading),
    refetch,
  }
}
