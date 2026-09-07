import type {
  ChainId,
  Token,
  TokenAmount,
} from '@de1/widget-types'
import type { Address } from 'viem'
import {
  getBalance,
  getBlockNumber,
  multicall,
  readContract,
} from 'viem/actions'
import { isZeroAddress } from '../../utils/isZeroAddress.js'
import { balanceOfAbi, getEthBalanceAbi } from './abi.js'
import { getPublicClient } from './publicClient.js'
import { getMulticallAddress } from './utils.js'

const MULTICALL_BATCH_SIZE = 200
const DEFAULT_BATCH_SIZE = 25
const DEFAULT_BATCH_CONCURRENCY = 4

const chunk = <T>(arr: T[], size: number): T[][] => {
  if (size <= 0) return [arr]
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size))
  }
  return out
}

const runWithConcurrency = async <T>(
  tasks: (() => Promise<T>)[],
  concurrency: number
): Promise<T[]> => {
  const results: T[] = new Array(tasks.length)
  let next = 0
  const workers = Array.from({ length: Math.max(1, concurrency) }, async () => {
    while (true) {
      const i = next++
      if (i >= tasks.length) return
      results[i] = await tasks[i]()
    }
  })
  await Promise.all(workers)
  return results
}

export const getEVMBalance = async (
  walletAddress: Address,
  tokens: Token[]
): Promise<TokenAmount[]> => {
  if (tokens.length === 0) {
    return []
  }
  const { chainId } = tokens[0]
  for (const token of tokens) {
    if (token.chainId !== chainId) {
      console.warn('Requested tokens have to be on the same chain.')
    }
  }

  const multicallAddress = await getMulticallAddress(chainId)

  if (multicallAddress && tokens.length > 1) {
    return getEVMBalanceMulticall(
      chainId,
      tokens,
      walletAddress,
      multicallAddress
    )
  }
  return getEVMBalanceDefault(chainId, tokens, walletAddress)
}

const getEVMBalanceMulticall = async (
  chainId: ChainId,
  tokens: Token[],
  walletAddress: string,
  multicallAddress: string
): Promise<TokenAmount[]> => {
  const client = await getPublicClient(chainId)

  const contracts = tokens.map((token) => {
    if (isZeroAddress(token.address)) {
      return {
        address: multicallAddress as Address,
        abi: getEthBalanceAbi,
        functionName: 'getEthBalance',
        args: [walletAddress],
      }
    }
    return {
      address: token.address as Address,
      abi: balanceOfAbi,
      functionName: 'balanceOf',
      args: [walletAddress],
    }
  })

  const batches = chunk(contracts, MULTICALL_BATCH_SIZE)
  const batchedResults = await runWithConcurrency(
    batches.map(
      (batch) => () =>
        multicall(client, {
          contracts: batch,
          multicallAddress: multicallAddress as Address,
        })
    ),
    2
  )

  const flatResults = batchedResults.flat()
  if (!flatResults.length) {
    return []
  }

  let blockNumber: bigint | undefined
  try {
    blockNumber = await getBlockNumber(client)
  } catch {
    blockNumber = undefined
  }

  return tokens.map((token, i: number) => {
    return {
      ...token,
      amount: flatResults[i].result as bigint,
      blockNumber,
    }
  })
}

const getEVMBalanceDefault = async (
  chainId: ChainId,
  tokens: Token[],
  walletAddress: Address
): Promise<TokenAmount[]> => {
  const client = await getPublicClient(chainId)
  let blockNumber: bigint | undefined

  const tasks = tokens.map((token) => async () => {
    try {
      if (isZeroAddress(token.address)) {
        return await getBalance(client, {
          address: walletAddress as Address,
        })
      }
      return (await readContract(client, {
        address: token.address as Address,
        abi: balanceOfAbi,
        functionName: 'balanceOf',
        args: [walletAddress],
      })) as bigint
    } finally {
      if (blockNumber === undefined) {
        try {
          blockNumber = await getBlockNumber(client)
        } catch {
          blockNumber = undefined
        }
      }
    }
  })

  const batches = chunk(tasks, DEFAULT_BATCH_SIZE)
  const batchedResults = await runWithConcurrency(
    batches.map(
      (batch) => () => Promise.allSettled(batch.map((run) => run()))
    ),
    DEFAULT_BATCH_CONCURRENCY
  )

  if (blockNumber === undefined) {
    try {
      blockNumber = await getBlockNumber(client)
    } catch {
      blockNumber = undefined
    }
  }

  const results = batchedResults.flat()

  const tokenAmounts: TokenAmount[] = tokens.map((token, index) => {
    const result = results[index]
    if (result.status === 'rejected') {
      return {
        ...token,
        blockNumber,
      }
    }
    return {
      ...token,
      amount: result.value,
      blockNumber,
    }
  })
  return tokenAmounts
}
