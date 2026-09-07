import { ChainType, type Token, type TokenAmount } from '@de1/widget-types'
import type { StepExecutorOptions, StepExecutor, SDKProvider } from './types.js'

const NEAR_RPC_URL = 'https://near.drpc.org'

const toBase64Args = (value: object): string => {
  const json = JSON.stringify(value)
  if (typeof btoa === 'function') {
    return btoa(json)
  }
  // Non-browser fallback (the widget usually runs in a browser and won't hit this)
  // @ts-ignore
  return Buffer.from(json, 'utf-8').toString('base64')
}

async function callNearRpc(method: string, params: any): Promise<any> {
  const res = await fetch(NEAR_RPC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: 'de1-widget', method, params }),
  })

  if (!res.ok) {
    throw new Error(`Near RPC request failed with status ${res.status}`)
  }

  const json = await res.json()
  if (json.error) {
    throw new Error(json.error.message || 'Near RPC error')
  }
  return json.result
}

async function getNearNativeBalance(accountId: string): Promise<bigint> {
  const result = await callNearRpc('query', {
    request_type: 'view_account',
    finality: 'final',
    account_id: accountId,
  })
  // amount is a yoctoNEAR string
  return BigInt(result.amount || '0')
}

async function getNearFungibleTokenBalance(
  accountId: string,
  contractId: string
): Promise<bigint> {
  const argsBase64 = toBase64Args({ account_id: accountId })
  const result = await callNearRpc('query', {
    request_type: 'call_function',
    finality: 'final',
    account_id: contractId,
    method_name: 'ft_balance_of',
    args_base64: argsBase64,
  })

  // result.result is the Base64-decoded bytes of a Uint8Array; decode it to a string
  try {
    const resBytes: number[] = result.result || []
    const decoded = String.fromCharCode(...resBytes)
    const parsed = JSON.parse(decoded)
    return BigInt(parsed || '0')
  } catch {
    return 0n
  }
}

/**
 * Near provider: balance queries for the NVM chain.
 */
export function Near(): SDKProvider {
  return {
    get type() {
      return ChainType.NVM
    },
    isAddress(address: string): boolean {
      // Minimal check: non-empty is enough; tighten validation as needed
      return typeof address === 'string' && address.length > 0
    },
    async resolveAddress(name: string): Promise<string | undefined> {
      // Hook up NEAR name service here if .near domain resolution is needed
      return name
    },
    async getBalance(walletAddress: string, tokens: Token[]): Promise<TokenAmount[]> {
      if (!walletAddress || !tokens.length) return []

      // Query native NEAR once, then fetch other tokens in parallel via ft_balance_of
      let nativeBalancePromise: Promise<bigint> | null = null

      const results = await Promise.all(
        tokens.map(async (token) => {
          let amount = 0n
          try {
            const isNative = !token.address || token.address === 'near.near' || token.symbol === 'NEAR'
            if (isNative) {
              if (!nativeBalancePromise) {
                nativeBalancePromise = getNearNativeBalance(walletAddress)
              }
              amount = await nativeBalancePromise
            } else {
              amount = await getNearFungibleTokenBalance(walletAddress, token.address)
            }
          } catch (e) {
            // Keep amount at 0n on error so other token queries still run
            console.warn('Failed to fetch NEAR balance for token', token.address, e)
          }

          const tokenAmount: TokenAmount = {
            ...token,
            amount,
            // NEAR does not return a block number yet; use 0 as a placeholder
            blockNumber: 0n,
          }
          return tokenAmount
        })
      )

      return results
    },
    async getStepExecutor(_options: StepExecutorOptions): Promise<StepExecutor> {
      // NEAR route execution is handled by an external adapter; no executor here
      throw new Error('Near execution is handled externally and not via SDKProvider.')
    },
  }
}

