import {
  AggregateDexRouter,
  BitgetRouter,
  NearSmartRouter,
  completeQuote,
  convertSlippageToBasisPoints,
  normalizeEvmAddress,
  normalizeTokenId,
  type ConfigAdapter,
  type BluechipTokensConfig,
  type DexRouter,
  type EvmChainAdapter,
  type FindPathAdapter,
  type IntentsQuotationAdapter,
  type NearChainAdapter,
  type SwapMultiDexPathAdapter,
} from '@rhea-finance/cross-chain-aggregation-dex'
import {
  OneClickService,
  OpenAPI,
  QuoteRequest,
} from '@defuse-protocol/one-click-sdk-typescript'
import { ChainId } from '@de1/widget-sdk'
import { type useWalletSelector } from '@near-wallet-selector/react-hook'
import { type WalletClient, formatUnits, parseAbi } from 'viem'

import { NativeCurrencies, ZERO_ADDRESS } from '../constants/index.js'
import type { Quote } from '../registry.js'
import {
  BaseSwapAdapter,
  type Chain,
  type Currency,
  NonEvmChain,
  type NormalizedQuote,
  type NormalizedTxResponse,
  type QuoteParams,
  type SwapStatus,
} from './BaseSwapAdapter.js'

const RHEA_ICON = 'https://rhea.finance/favicon2.ico'
const DEFAULT_ONE_CLICK_BASE = 'https://open-api.de1.exchange/1click'
const RHEA_FIND_PATH_URL = 'https://smartrouter.rhea.finance'
const RHEA_SMARTX_URL = 'https://smartx.rhea.finance'
const RHEA_AGGREGATE_DEX_CONTRACT_ID = 'aggregate-dex-contract.near'
const RHEA_TOKEN_STORAGE_DEPOSIT = '1250000000000000000000'
const RHEA_NATIVE_NEAR = 'wrap.near'
const RHEA_NATIVE_NEAR_ASSET_ID = 'nep141:wrap.near'
const RHEA_NATIVE_EVM_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
const DEFAULT_BITGET_API_BASE = 'https://bopenapi.bgwapi.io'
const BITGET_QUOTE_PATH = '/bgw-pro/swapx/pro/quote'
const BITGET_SWAP_PATH = '/bgw-pro/swapx/pro/swap'

const SUPPORTED_RHEA_EVM_CHAINS: Chain[] = [
  ChainId.ETH,
  ChainId.BSC,
  ChainId.ARB,
  ChainId.BAS,
  ChainId.OPT,
  ChainId.BER,
  ChainId.MONAD,
  ChainId.XLY,
  ChainId.POL,
  ChainId.DAI,
  ChainId.PLA,
]

const SUPPORTED_RHEA_CHAINS: Chain[] = [NonEvmChain.Near, ...SUPPORTED_RHEA_EVM_CHAINS]

const erc20TransferAbi = parseAbi([
  'function transfer(address to, uint256 amount) returns (bool)',
])

const erc20AllowanceAbi = parseAbi([
  'function allowance(address owner, address spender) view returns (uint256)',
])

const erc20ApproveAbi = parseAbi([
  'function approve(address spender, uint256 amount) returns (bool)',
])

type RheaSourceKind = 'evm' | 'near'

type RheaRawQuote = {
  sourceKind: RheaSourceKind
  fromChainId: number
  toChainId: number
  completeQuoteResult: Awaited<ReturnType<typeof completeQuote>>
}

type RheaOneClickQuoteResult = {
  quoteStatus: 'success' | 'error'
  message?: string
  quoteSuccessResult?: {
    quote: {
      amountOut: string
      depositAddress: string
      [key: string]: any
    }
    [key: string]: any
  }
  [key: string]: any
}

function readEnvValue(name: string): string | undefined {
  if (typeof process !== 'undefined' && process.env?.[name]) {
    return process.env[name]
  }

  try {
    const env = (import.meta as any)?.env
    return env?.[name] || env?.[`VITE_${name}`]
  } catch {
    return undefined
  }
}

function getBitgetApiConfig(): {
  apiKey?: string
  apiSecret?: string
  baseUrl: string
} {
  const apiKey =
    readEnvValue('RHEA_BITGET_API_KEY') ||
    readEnvValue('BITGET_API_KEY') ||
    readEnvValue('BGW_API_KEY')
  const apiSecret =
    readEnvValue('RHEA_BITGET_API_SECRET') ||
    readEnvValue('BITGET_API_SECRET') ||
    readEnvValue('BGW_API_SECRET')
  const baseUrl =
    readEnvValue('RHEA_BITGET_API_BASE') ||
    readEnvValue('BITGET_API_BASE') ||
    DEFAULT_BITGET_API_BASE

  return { apiKey, apiSecret, baseUrl: baseUrl.replace(/\/$/, '') }
}

function sortDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => sortDeep(item)) as T
  }

  if (!value || typeof value !== 'object') {
    return value
  }

  const entries = Object.entries(value as Record<string, any>).sort(([a], [b]) =>
    a.localeCompare(b)
  )
  return Object.fromEntries(entries.map(([key, item]) => [key, sortDeep(item)])) as T
}

function stableJsonStringify(value: unknown): string {
  return JSON.stringify(sortDeep(value))
}

function toBitgetNativeContract(address: string): string {
  const normalized = address.toLowerCase()
  return !address ||
    normalized === RHEA_NATIVE_EVM_ADDRESS.toLowerCase() ||
    normalized === ZERO_ADDRESS.toLowerCase() ||
    /^evm-[a-z0-9_]+-native$/.test(normalized)
    ? ''
    : normalized
}

function getBitgetChainIdentifier(chain: Chain): string | undefined {
  const numericChain = Number(chain)

  switch (numericChain) {
    case ChainId.ETH:
      return 'eth'
    case ChainId.BSC:
      return 'bnb'
    case ChainId.ARB:
      return 'arbitrum'
    case ChainId.BAS:
      return 'base'
    case ChainId.OPT:
      return 'optimism'
    case ChainId.BER:
      return 'berachain'
    case ChainId.MONAD:
      return 'monad'
    case ChainId.XLY:
      return 'xlayer'
    case ChainId.DAI:
      return 'gnosis'
    case ChainId.PLA:
      return 'plasma'
    case ChainId.POL:
      return 'polygon'
    case ChainId.AVA:
      return 'avax_c'
    case ChainId.HYE:
      return 'hyper_evm'
    default:
      return undefined
  }
}

function getRheaEvmChainName(chain: Chain): string | undefined {
  return getBitgetChainIdentifier(chain)
}

function isNativeEvmToken(token: Currency): boolean {
  const address = getCurrencyAddress(token).toLowerCase()
  return Boolean((token as any).isNative) ||
    !address ||
    address === ZERO_ADDRESS.toLowerCase() ||
    address === RHEA_NATIVE_EVM_ADDRESS.toLowerCase()
}

type OneClickSupportedToken = {
  assetId?: string
  blockchain?: string
  symbol?: string
  contractAddress?: string
}

let oneClickTokensPromise: Promise<OneClickSupportedToken[]> | undefined

function getOneClickBlockchain(chain: Chain): string | undefined {
  const chainName = getRheaEvmChainName(chain)
  return {
    bnb: 'bsc',
    arbitrum: 'arb',
    polygon: 'pol',
  }[chainName || ''] || chainName
}

async function getOneClickTokens(): Promise<OneClickSupportedToken[]> {
  oneClickTokensPromise ||= fetch(`${OpenAPI.BASE}/v0/tokens`, {
    headers: OpenAPI.TOKEN ? { Authorization: `Bearer ${OpenAPI.TOKEN}` } : undefined,
  }).then(async response => {
    if (!response.ok) {
      throw new Error(`Failed to load OneClick token list (${response.status})`)
    }
    return (await response.json()) as OneClickSupportedToken[]
  })

  return oneClickTokensPromise
}

async function resolveOneClickAssetId(token: Currency, chain: Chain): Promise<string | undefined> {
  const blockchain = getOneClickBlockchain(chain)
  if (!blockchain) {
    return undefined
  }

  const address = getCurrencyAddress(token).toLowerCase()
  const native = isNativeEvmToken(token)
  const supportedTokens = await getOneClickTokens()
  const match = supportedTokens.find(item =>
    item.blockchain === blockchain &&
    (native
      ? !item.contractAddress && item.symbol?.toLowerCase() === token.symbol?.toLowerCase()
      : item.contractAddress?.toLowerCase() === address)
  )

  return match?.assetId
}

async function hmacSha256Base64(secret: string, payload: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(payload)
    )
    const bytes = new Uint8Array(signature)
    let binary = ''
    for (const byte of bytes) {
      binary += String.fromCharCode(byte)
    }
    return typeof btoa !== 'undefined'
      ? btoa(binary)
      : Buffer.from(binary, 'binary').toString('base64')
  }

  const { createHmac } = await import('node:crypto')
  return createHmac('sha256', secret).update(payload).digest('base64')
}

async function signBitgetRequest(params: {
  apiPath: string
  apiKey: string
  apiSecret: string
  timestamp: string
  query?: Record<string, string | number | boolean | undefined>
  body: string
}): Promise<string> {
  const content: Record<string, string> = {
    apiPath: params.apiPath,
    body: params.body,
    'x-api-key': params.apiKey,
    'x-api-timestamp': params.timestamp,
  }

  for (const [key, value] of Object.entries(params.query || {})) {
    if (value === undefined) {
      continue
    }
    content[key] = String(value)
  }

  const payload = stableJsonStringify(content)
  return hmacSha256Base64(params.apiSecret, payload)
}

async function callBitgetApi<T>(params: {
  path: string
  body: Record<string, unknown>
  query?: Record<string, string | number | boolean | undefined>
}): Promise<T> {
  const { apiKey, apiSecret, baseUrl } = getBitgetApiConfig()

  if (!apiKey || !apiSecret) {
    throw new Error(
      'Bitget API credentials are missing. Set RHEA_BITGET_API_KEY and RHEA_BITGET_API_SECRET.'
    )
  }

  const timestamp = Date.now().toString()
  const body = stableJsonStringify(params.body)
  const signature = await signBitgetRequest({
    apiPath: params.path,
    apiKey,
    apiSecret,
    timestamp,
    query: params.query,
    body,
  })

  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params.query || {})) {
    if (value === undefined) {
      continue
    }
    searchParams.set(key, String(value))
  }

  const response = await fetch(
    `${baseUrl}${params.path}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'x-api-timestamp': timestamp,
        'x-api-signature': signature,
      },
      body,
    }
  )

  const responseText = await response.text()
  let responseData: any
  try {
    responseData = responseText ? JSON.parse(responseText) : {}
  } catch {
    responseData = { raw: responseText }
  }

  if (!response.ok) {
    throw new Error(
      responseData?.msg ||
        responseData?.message ||
        responseText ||
        `Bitget request failed with status ${response.status}`
    )
  }

  return responseData as T
}

function normalizeBitgetQuoteData(data: any) {
  const quoteData = Array.isArray(data?.txs) ? data.txs[0] : data?.txs?.[0] || data || {}

  return {
    ...data,
    toAmount:
      data?.toAmount ||
      data?.outAmount ||
      data?.expectedAmountOut ||
      data?.amountOut ||
      quoteData?.toAmount ||
      quoteData?.outAmount ||
      '0',
    minToAmount:
      data?.minToAmount ||
      data?.minAmountOut ||
      data?.toMinAmount ||
      data?.minOutAmount ||
      quoteData?.minToAmount ||
      quoteData?.minAmountOut ||
      quoteData?.toMinAmount ||
      '0',
    contract:
      data?.contract ||
      quoteData?.contract ||
      quoteData?.to ||
      data?.to ||
      '',
    calldata:
      data?.calldata ||
      data?.data ||
      quoteData?.calldata ||
      quoteData?.data ||
      quoteData?.instruction ||
      '',
    to:
      data?.to ||
      quoteData?.to ||
      quoteData?.contract ||
      data?.contract ||
      '',
    value: data?.value || quoteData?.value || '0',
    gas:
      data?.gas ||
      data?.gasLimit ||
      quoteData?.gas ||
      quoteData?.gasLimit ||
      data?.computeUnits ||
      quoteData?.computeUnits,
    market: data?.market || quoteData?.market || '',
    estimateRevert:
      data?.estimateRevert ??
      quoteData?.estimateRevert ??
      false,
  }
}

function normalizeBitgetSwapData(data: any) {
  const tx = Array.isArray(data?.txs) ? data.txs[0] : data?.txs?.[0] || data || {}

  return {
    ...data,
    contract: data?.contract || tx?.contract || tx?.to || '',
    to: data?.to || tx?.to || tx?.contract || '',
    calldata: data?.calldata || data?.data || tx?.calldata || tx?.data || '',
    value: data?.value || tx?.value || '0',
    gas:
      data?.gas ||
      data?.gasLimit ||
      tx?.gas ||
      tx?.gasLimit ||
      data?.computeUnits ||
      tx?.computeUnits,
    market: data?.market || tx?.market || '',
    estimateRevert:
      data?.estimateRevert ??
      tx?.estimateRevert ??
      false,
    id: data?.id || tx?.id || '',
    amountUnit: data?.amountUnit || tx?.amountUnit,
    toAmount:
      data?.toAmount ||
      data?.outAmount ||
      data?.expectedAmountOut ||
      tx?.toAmount ||
      tx?.outAmount ||
      '0',
    minToAmount:
      data?.toMinAmount ||
      data?.minToAmount ||
      data?.minAmountOut ||
      tx?.toMinAmount ||
      tx?.minToAmount ||
      tx?.minAmountOut ||
      '0',
  }
}

function getCurrencyAddress(token: Currency): string {
  return (token as any).address || ''
}

function getCurrencySymbol(token: Currency): string {
  return (token as any).symbol || ''
}

function isNearChain(chain: Chain): boolean {
  return chain === NonEvmChain.Near || (chain as any) === 'near'
}

function isSupportedBridgePair(fromChain: Chain, toChain: Chain): boolean {
  if (fromChain === toChain) {
    return false
  }

  return SUPPORTED_RHEA_CHAINS.includes(fromChain) && SUPPORTED_RHEA_CHAINS.includes(toChain)
}

function toEvmToken(token: Currency): {
  address: string
  symbol: string
  decimals: number
  chain: 'evm'
  assetId: string
} {
  const isNative =
    Boolean((token as any).isNative) ||
    getCurrencyAddress(token) === '' ||
    getCurrencyAddress(token).toLowerCase() === ZERO_ADDRESS.toLowerCase() ||
    getCurrencyAddress(token).toLowerCase() === RHEA_NATIVE_EVM_ADDRESS.toLowerCase()

  const address = isNative
    ? RHEA_NATIVE_EVM_ADDRESS
    : normalizeEvmAddress(getCurrencyAddress(token))

  return {
    address,
    symbol: token.symbol,
    decimals: token.decimals,
    chain: 'evm',
    assetId: `evm:${address.toLowerCase()}`,
  }
}

function toNearToken(token: Currency): {
  address: string
  symbol: string
  decimals: number
  chain: 'near'
  assetId: string
} {
  const normalizedAddress = normalizeTokenId(getCurrencyAddress(token), RHEA_NATIVE_NEAR)
  const isNative =
    Boolean((token as any).isNative) ||
    getCurrencyAddress(token) === '' ||
    getCurrencyAddress(token) === 'near' ||
    getCurrencyAddress(token) === 'near.near' ||
    getCurrencySymbol(token)?.toUpperCase?.() === 'NEAR'

  const address = isNative ? RHEA_NATIVE_NEAR : normalizedAddress

  return {
    address,
    symbol: token.symbol,
    decimals: token.decimals,
    chain: 'near',
    assetId: `nep141:${address}`,
  }
}

function buildBluechipTokens(
  sourceKind: RheaSourceKind,
  sourceToken: Currency,
  chainId?: Chain
): BluechipTokensConfig {
  if (sourceKind === 'near') {
    return {
      NEAR: {
        address: RHEA_NATIVE_NEAR,
        symbol: 'NEAR',
        decimals: 24,
        assetId: RHEA_NATIVE_NEAR_ASSET_ID,
      },
    }
  }

  const nativeCurrency = chainId !== undefined ? NativeCurrencies[chainId as keyof typeof NativeCurrencies] : undefined
  const sourceIsNative = isNativeEvmToken(sourceToken)
  const nativeWrappedAddress =
    sourceIsNative
      ? RHEA_NATIVE_EVM_ADDRESS
      : nativeCurrency?.wrapped?.address || RHEA_NATIVE_EVM_ADDRESS
  const nativeWrappedSymbol =
    nativeCurrency?.wrapped?.symbol || 'WETH'

  const bluechips: BluechipTokensConfig = {
    ETH: {
      address: nativeWrappedAddress,
      symbol: nativeWrappedSymbol,
      decimals: 18,
      assetId: sourceIsNative
        ? `evm-${getRheaEvmChainName(chainId as Chain) || 'ethereum'}-native`
        : `evm:${nativeWrappedAddress.toLowerCase()}`,
    },
  }

  const upperSymbol = sourceToken.symbol?.toUpperCase?.()
  if (upperSymbol === 'USDT' || upperSymbol === 'USDC') {
    bluechips[upperSymbol] = {
      address: normalizeEvmAddress(getCurrencyAddress(sourceToken)),
      symbol: sourceToken.symbol,
      decimals: sourceToken.decimals,
      assetId: `evm:${normalizeEvmAddress(getCurrencyAddress(sourceToken)).toLowerCase()}`,
    }
  }

  return bluechips
}

function buildConfigAdapter(): ConfigAdapter {
  return {
    getRefExchangeId: () => 'v2.ref-finance.near',
    getWrapNearContractId: () => RHEA_NATIVE_NEAR,
    getFindPathUrl: () => RHEA_FIND_PATH_URL,
    getTokenStorageDepositRead: () => RHEA_TOKEN_STORAGE_DEPOSIT,
    getAggregateDexContractId: () => RHEA_AGGREGATE_DEX_CONTRACT_ID,
    getSmartxUrl: () => RHEA_SMARTX_URL,
    getEvmNativeWrappedTokenAddress: () => RHEA_NATIVE_EVM_ADDRESS,
  } as any
}

function buildFindPathAdapter(): FindPathAdapter {
  return {
    async findPath(params) {
      const response = await fetch(
        `${RHEA_FIND_PATH_URL}/findPath?${new URLSearchParams({
          amountIn: params.amountIn,
          tokenIn: params.tokenIn,
          tokenOut: params.tokenOut,
          slippage: String(params.slippage),
          pathDeep: '3',
          supportLedger: String(Boolean(params.supportLedger)),
        }).toString()}`
      )
      return response.json()
    },
  }
}

function buildSwapMultiDexPathAdapter(): SwapMultiDexPathAdapter {
  return {
    async swapMultiDexPath(params) {
      const response = await fetch(
        `${RHEA_SMARTX_URL}/swapMultiDexPath?${new URLSearchParams({
          amountIn: params.amountIn,
          tokenIn: params.tokenIn,
          tokenOut: params.tokenOut,
          slippage: String(params.slippage),
          pathDeep: String(params.pathDeep ?? 2),
          chainId: String(params.chainId ?? 0),
          routerCount: String(params.routerCount ?? 1),
          user: params.user,
          receiveUser: params.receiveUser,
          skipUnwrapNativeToken: String(Boolean(params.skipUnwrapNativeToken)),
        }).toString()}`
      )
      return response.json()
    },
  }
}

function buildIntentsQuotationAdapter(): IntentsQuotationAdapter {
  return {
    async quote(params) {
      const quoteRequest: QuoteRequest = {
        // Rhea needs the generated deposit address to fund the quote.
        // OneClick's dry mode intentionally omits that address.
        dry: false,
        deadline: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
        slippageTolerance: params.slippageTolerance,
        swapType: params.swapType === 'FLEX_INPUT'
          ? QuoteRequest.swapType.FLEX_INPUT
          : QuoteRequest.swapType.EXACT_INPUT,
        originAsset: params.originAsset,
        depositType: QuoteRequest.depositType.ORIGIN_CHAIN,
        destinationAsset: params.destinationAsset,
        amount: params.amount,
        refundTo: params.refundTo,
        refundType: QuoteRequest.refundType.ORIGIN_CHAIN,
        referral: 'rhea',
        recipient: params.recipient,
        recipientType: QuoteRequest.recipientType.DESTINATION_CHAIN,
        ...(params.appFees ? { appFees: params.appFees } : {}),
        ...(params.customRecipientMsg ? { customRecipientMsg: params.customRecipientMsg } : {}),
      }

      const result = (await OneClickService.getQuote(quoteRequest)) as unknown as RheaOneClickQuoteResult
      const quote = result?.quoteSuccessResult?.quote || (result as any)?.quote || result

      if (!quote?.depositAddress) {
        return {
          quoteStatus: 'error',
          message: 'Deposit address not found',
          quoteSuccessResult: undefined,
          rawQuote: result,
        }
      }

      return {
        quoteStatus: 'success',
        quoteSuccessResult: {
          quote,
          rawQuote: result,
        },
        rawQuote: result,
      }
    },
  }
}

function buildQuoteRouters(
  sourceKind: RheaSourceKind,
  chainId: number,
  publicClient?: any
): DexRouter[] {
  if (sourceKind === 'near') {
    return [
      new NearSmartRouter({
        findPathAdapter: buildFindPathAdapter(),
        nearChainAdapter: buildQuoteOnlyNearChainAdapter(),
        configAdapter: buildConfigAdapter(),
      }),
      new AggregateDexRouter({
        swapMultiDexPathAdapter: buildSwapMultiDexPathAdapter(),
        nearChainAdapter: buildQuoteOnlyNearChainAdapter(),
        configAdapter: buildConfigAdapter(),
      }),
    ]
  }

  return [
    new BitgetRouter({
      bitgetAdapter: buildBitgetAdapter(),
      evmChainAdapter: buildQuoteOnlyEvmChainAdapter(publicClient),
      chainId,
    }),
  ]
}

function buildExecutionRouters(
  sourceKind: RheaSourceKind,
  chainId: number,
  walletClient: WalletClient,
  nearWallet?: ReturnType<typeof useWalletSelector>
): DexRouter[] {
  if (sourceKind === 'near') {
    return [
      new NearSmartRouter({
        findPathAdapter: buildFindPathAdapter(),
        nearChainAdapter: buildNearChainAdapter(nearWallet),
        configAdapter: buildConfigAdapter(),
      }),
      new AggregateDexRouter({
        swapMultiDexPathAdapter: buildSwapMultiDexPathAdapter(),
        nearChainAdapter: buildNearChainAdapter(nearWallet),
        configAdapter: buildConfigAdapter(),
      }),
    ]
  }

  return [
    new BitgetRouter({
      bitgetAdapter: buildBitgetAdapter(),
      evmChainAdapter: buildEvmChainAdapter(walletClient),
      chainId,
    }),
  ]
}

function buildQuoteOnlyNearChainAdapter(): NearChainAdapter {
  return {
    async call() {
      throw new Error('Near chain execution adapter is not available during quote generation')
    },
    async view() {
      return '0'
    },
  }
}

function buildQuoteOnlyEvmChainAdapter(publicClient?: any): EvmChainAdapter {
  return {
    async sendTransaction() {
      throw new Error('EVM execution adapter is not available during quote generation')
    },
    async getAllowance() {
      return '0'
    },
    async approve() {
      throw new Error('EVM execution adapter is not available during quote generation')
    },
    async getBalance({ address, tokenAddress }) {
      const client = publicClient as any
      if (!client) {
        return '0'
      }

      if (!tokenAddress) {
        const balance = await client.getBalance?.({
          address: address as `0x${string}`,
        })
        return balance?.toString?.() || '0'
      }

      if (!client.readContract) {
        return '0'
      }

      const balance = await client.readContract({
        address: tokenAddress as `0x${string}`,
        abi: parseAbi([
          'function balanceOf(address owner) view returns (uint256)',
        ]),
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      })

      return balance?.toString?.() || '0'
    },
  }
}

function buildNearChainAdapter(nearWallet?: ReturnType<typeof useWalletSelector>): NearChainAdapter {
  return {
    async call({ transactions }) {
      if (!nearWallet?.signedAccountId) {
        throw new Error('Near wallet is not connected')
      }

      const txResult = await nearWallet.signAndSendTransactions({
        transactions: transactions.map((transaction) => ({
          signerId: nearWallet.signedAccountId!,
          receiverId: transaction.contractId,
          actions: [
            {
              type: 'FunctionCall',
              params: {
                methodName: transaction.methodName,
                args: transaction.args,
                gas: transaction.gas || '50000000000000',
                deposit: transaction.expandDeposit || '0',
              },
            },
          ],
        })),
      })

      const first = Array.isArray(txResult) ? txResult[0] : txResult
      const hash = first?.transaction?.hash || first?.hash || ''

      return {
        status: 'success',
        txHash: hash,
        txHashArr: Array.isArray(txResult)
          ? txResult.map((item: any) => item?.transaction?.hash || item?.hash).filter(Boolean)
          : hash
            ? [hash]
            : [],
      }
    },
    async view({ contractId, methodName, args }) {
      const body = JSON.stringify({
        jsonrpc: '2.0',
        id: 'rhea',
        method: 'query',
        params: {
          request_type: 'call_function',
          finality: 'optimistic',
          account_id: contractId,
          method_name: methodName,
          args_base64: encodeJsonToBase64(args ?? {}),
        },
      })

      const response = await fetch('https://rpc.mainnet.near.org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      })

      const data = await response.json()
      const raw = data?.result?.result

      if (!raw) {
        return null
      }

      return new TextDecoder().decode(Uint8Array.from(raw))
    },
  }
}

function buildEvmChainAdapter(walletClient: WalletClient): EvmChainAdapter {
  return {
    async sendTransaction(params) {
      const client = walletClient as any
      try {
        const hash = await client.sendTransaction({
          chain: undefined,
          account: client.account!.address,
          to: params.to as `0x${string}`,
          data: params.data as `0x${string}`,
          value: params.value ? BigInt(params.value) : undefined,
          gas: params.gasLimit ? BigInt(params.gasLimit) : undefined,
          maxFeePerGas: params.maxFeePerGas ? BigInt(params.maxFeePerGas) : undefined,
          maxPriorityFeePerGas: params.maxPriorityFeePerGas ? BigInt(params.maxPriorityFeePerGas) : undefined,
          gasPrice: params.gasPrice ? BigInt(params.gasPrice) : undefined,
          type: params.type as 0 | 1 | 2 | undefined,
          kzg: undefined,
        })

        return { status: 'success', txHash: hash }
      } catch (error: any) {
        return {
          status: 'failed',
          txHash: '',
          message: error?.message || 'Transaction failed',
        }
      }
    },
    async getAllowance({ tokenAddress, owner, spender }) {
      const client = walletClient as any
      const allowance = await client.readContract({
        address: tokenAddress as `0x${string}`,
        abi: erc20AllowanceAbi,
        functionName: 'allowance',
        args: [owner as `0x${string}`, spender as `0x${string}`],
      })

      return allowance.toString()
    },
    async approve({ tokenAddress, spender, amount }) {
      const client = walletClient as any
      const txHash = await client.writeContract({
        address: tokenAddress as `0x${string}`,
        abi: erc20ApproveAbi,
        functionName: 'approve',
        args: [spender as `0x${string}`, BigInt(amount)],
        account: client.account!.address,
        chain: undefined,
      })

      return { txHash }
    },
    async getBalance({ address, tokenAddress }) {
      const client = walletClient as any
      if (!tokenAddress) {
        const balance = await client.getBalance({
          address: address as `0x${string}`,
        })
        return balance.toString()
      }

      const balance = await client.readContract({
        address: tokenAddress as `0x${string}`,
        abi: parseAbi([
          'function balanceOf(address owner) view returns (uint256)',
        ]),
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      })

      return balance.toString()
    },
  }
}

function buildBitgetAdapter() {
  return {
    async quote(params: {
      chainId: number
      tokenIn: string
      tokenOut: string
      amountIn: string
      slippage: number
      userAddress: string
      tokenInSymbol?: string
      tokenInDecimals?: number
      tokenOutSymbol?: string
      tokenOutDecimals?: number
    }) {
      const fromChain = getBitgetChainIdentifier(params.chainId)
      if (!fromChain) {
        throw new Error(`Unsupported Bitget chainId: ${params.chainId}`)
      }

      const response = await callBitgetApi<any>({
        path: BITGET_QUOTE_PATH,
        body: {
          fromSymbol: params.tokenInSymbol,
          fromContract: toBitgetNativeContract(params.tokenIn),
          fromAmount: params.amountIn,
          fromChain,
          toSymbol: params.tokenOutSymbol,
          toContract: toBitgetNativeContract(params.tokenOut),
          toChain: fromChain,
          fromAddress: params.userAddress,
          amountUnit: 'wei',
        },
      })

      return {
        code: '0',
        msg: 'success',
        status: 0,
        data: normalizeBitgetQuoteData(response?.data || response),
      }
    },
    async swap(params: {
      chainId: number
      tokenIn: string
      tokenOut: string
      amountIn: string
      minAmountOut?: string
      slippage: number
      fromAddress: string
      toAddress: string
      market: string
      tokenInSymbol?: string
      tokenInDecimals?: number
      tokenOutSymbol?: string
      tokenOutDecimals?: number
    }) {
      const fromChain = getBitgetChainIdentifier(params.chainId)
      if (!fromChain) {
        throw new Error(`Unsupported Bitget chainId: ${params.chainId}`)
      }

      const response = await callBitgetApi<any>({
        path: BITGET_SWAP_PATH,
        body: {
          fromSymbol: params.tokenInSymbol,
          fromContract: toBitgetNativeContract(params.tokenIn),
          fromAmount: params.amountIn,
          fromChain,
          toSymbol: params.tokenOutSymbol,
          toContract: toBitgetNativeContract(params.tokenOut),
          toChain: fromChain,
          fromAddress: params.fromAddress,
          toAddress: params.toAddress,
          slippage: params.slippage,
          market: params.market,
          amountUnit: 'wei',
        },
      })

      return {
        code: '0',
        msg: 'success',
        status: 0,
        data: normalizeBitgetSwapData(response?.data || response),
      }
    },
  }
}

function encodeJsonToBase64(value: any): string {
  const json = JSON.stringify(value)

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(json).toString('base64')
  }

  if (typeof btoa !== 'undefined') {
    return btoa(json)
  }

  throw new Error('Base64 encoding is not available')
}

function mapExecutionStatus(status: string | number): SwapStatus['status'] {
  const normalized = String(status).toUpperCase()

  if (
    normalized === 'SUCCESS' ||
    normalized === 'KNOWN_DEPOSIT_TX' ||
    normalized === 'PENDING_DEPOSIT' ||
    normalized === 'INCOMPLETE_DEPOSIT' ||
    normalized === 'PROCESSING'
  ) {
    return normalized === 'SUCCESS' ? 'Success' : 'Processing'
  }

  if (normalized === 'REFUNDED') {
    return 'Refunded'
  }

  if (normalized === 'FAILED') {
    return 'Failed'
  }

  return 'Processing'
}

async function executeDirectBridgeTransfer(params: {
  sourceKind: RheaSourceKind
  sourceToken: Currency
  amount: string
  depositAddress: string
  walletClient: WalletClient
  nearWallet?: ReturnType<typeof useWalletSelector>
}) {
  const { sourceKind, sourceToken, amount, depositAddress, walletClient, nearWallet } = params
  const client = walletClient as any

  if (sourceKind === 'evm') {
    const tokenAddress = getCurrencyAddress(sourceToken)
    const isNative = Boolean((sourceToken as any).isNative) || tokenAddress === ''

    if (isNative) {
      return client.sendTransaction({
        chain: undefined,
        account: client.account!.address,
        to: depositAddress as `0x${string}`,
        value: BigInt(amount),
        kzg: undefined,
      })
    }

    return client.writeContract({
      chain: undefined,
      account: client.account!.address,
      address: normalizeEvmAddress(tokenAddress) as `0x${string}`,
      abi: erc20TransferAbi,
      functionName: 'transfer',
      args: [depositAddress as `0x${string}`, BigInt(amount)],
    })
  }

  if (!nearWallet?.signedAccountId) {
    throw new Error('Near wallet is not connected')
  }

  const isNative =
    getCurrencyAddress(sourceToken) === RHEA_NATIVE_NEAR ||
    getCurrencyAddress(sourceToken) === 'near' ||
    getCurrencyAddress(sourceToken) === 'near.near' ||
    getCurrencySymbol(sourceToken)?.toUpperCase?.() === 'NEAR'

  const tokenContract = isNative ? RHEA_NATIVE_NEAR : normalizeTokenId(getCurrencyAddress(sourceToken), RHEA_NATIVE_NEAR)
  const transactions: Array<{
    signerId: string
    receiverId: string
    actions: any[]
  }> = []

  if (isNative) {
    transactions.push({
      signerId: nearWallet.signedAccountId,
      receiverId: RHEA_NATIVE_NEAR,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: 'storage_deposit',
            args: {
              account_id: depositAddress,
              registration_only: true,
            },
            gas: '30000000000000',
            deposit: RHEA_TOKEN_STORAGE_DEPOSIT,
          },
        },
        {
          type: 'FunctionCall',
          params: {
            methodName: 'near_deposit',
            args: {},
            gas: '30000000000000',
            deposit: amount,
          },
        },
        {
          type: 'FunctionCall',
          params: {
            methodName: 'ft_transfer',
            args: {
              receiver_id: depositAddress,
              amount,
            },
            gas: '30000000000000',
            deposit: '1',
          },
        },
      ],
    })
  } else {
    transactions.push({
      signerId: nearWallet.signedAccountId,
      receiverId: tokenContract,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: 'storage_deposit',
            args: {
              account_id: depositAddress,
              registration_only: true,
            },
            gas: '30000000000000',
            deposit: RHEA_TOKEN_STORAGE_DEPOSIT,
          },
        },
        {
          type: 'FunctionCall',
          params: {
            methodName: 'ft_transfer',
            args: {
              receiver_id: depositAddress,
              amount,
            },
            gas: '30000000000000',
            deposit: '1',
          },
        },
      ],
    })
  }

  const txResult = await nearWallet.signAndSendTransactions({ transactions })
  const first = Array.isArray(txResult) ? txResult[txResult.length - 1] : txResult
  return first?.transaction?.hash || first?.hash || depositAddress
}

export class RheaAdapter extends BaseSwapAdapter {
  constructor() {
    super()
    OpenAPI.BASE = readEnvValue('RHEA_ONE_CLICK_API_BASE')?.replace(/\/$/, '') || DEFAULT_ONE_CLICK_BASE

    const token = readEnvValue('RHEA_ONE_CLICK_JWT') || readEnvValue('RHEA_ONE_CLICK_TOKEN')
    if (token) {
      OpenAPI.TOKEN = token
    }
  }

  getName(): string {
    return 'Rhea'
  }

  getIcon(): string {
    return RHEA_ICON
  }

  getSupportedChains(): Chain[] {
    return SUPPORTED_RHEA_CHAINS
  }

  getSupportedTokens(_sourceChain: Chain, _destChain: Chain): Currency[] {
    return []
  }

  async getQuote(params: QuoteParams): Promise<NormalizedQuote> {
    try {
      if (!isSupportedBridgePair(params.fromChain, params.toChain)) {
        throw new Error('Rhea bridge supports only supported EVM <-> NEAR transfers')
      }

      const sourceKind: RheaSourceKind = isNearChain(params.fromChain) ? 'near' : 'evm'
      const targetKind: RheaSourceKind = isNearChain(params.toChain) ? 'near' : 'evm'
      const sourceToken = sourceKind === 'near'
        ? toNearToken(params.fromToken)
        : toEvmToken(params.fromToken)
      const targetToken = targetKind === 'near'
        ? toNearToken(params.toToken)
        : toEvmToken(params.toToken)

      // completeQuote uses assetId for native EVM assets. The SDK cannot infer
      // the chain from the generic `evm` source kind, so provide the canonical
      // chain-specific Intents asset IDs here.
      const sourceChainName = getRheaEvmChainName(params.fromChain)
      const targetChainName = getRheaEvmChainName(params.toChain)

      // OneClick asset IDs are registry values, not EVM address aliases. Resolve
      // every EVM token against the registry before calling completeQuote.
      if (sourceKind === 'evm') {
        const assetId = await resolveOneClickAssetId(params.fromToken, params.fromChain)
        if (!assetId) {
          throw new Error(`Rhea source token is not supported on ${sourceChainName || params.fromChain}`)
        }
        sourceToken.assetId = assetId
      }
      if (targetKind === 'evm') {
        const assetId = await resolveOneClickAssetId(params.toToken, params.toChain)
        if (!assetId) {
          throw new Error(`Rhea target token is not supported on ${targetChainName || params.toChain}`)
        }
        // completeQuote normalizes the destination from targetToken.address,
        // while the OneClick API expects the registry asset ID.
        targetToken.assetId = assetId
        targetToken.address = assetId
      }

      const slippageBps = convertSlippageToBasisPoints(params.slippage)
      const currentUserAddress = params.sender || params.recipient || ''
      const bluechipTokens = buildBluechipTokens(sourceKind, params.fromToken, params.fromChain)
      const quoteResult = await completeQuote(
        {
          sourceToken,
          targetToken,
          sourceChain: sourceKind === 'evm' ? sourceChainName || sourceKind : sourceKind,
          targetChain: targetKind === 'evm' ? targetChainName || targetKind : targetKind,
          amountIn: params.amount,
          slippage: slippageBps,
          recipient: params.recipient || currentUserAddress,
          refundTo: currentUserAddress,
          evmChainId: sourceKind === 'evm' ? Number(params.fromChain) : undefined,
        },
        {
          intentsQuotationAdapter: buildIntentsQuotationAdapter(),
          dexRouters: buildQuoteRouters(
            sourceKind,
            Number(params.fromChain),
            params.publicClient || params.walletClient
          ),
          bluechipTokens,
          configAdapter: buildConfigAdapter(),
          currentUserAddress,
        }
      )

      const depositAddress = quoteResult.intents.depositAddress
      const outputAmount = BigInt(quoteResult.finalAmountOut || quoteResult.intents.quote?.amountOut || '0')
      const formattedOutputAmount = formatUnits(outputAmount, params.toToken.decimals)
      const formattedInputAmount = formatUnits(BigInt(params.amount), params.fromToken.decimals)

      const inputUsd = params.tokenInUsd * Number(formattedInputAmount)
      const outputUsd = params.tokenOutUsd * Number(formattedOutputAmount)
      const priceImpact =
        !inputUsd || !outputUsd
          ? Number.NaN
          : ((inputUsd - outputUsd) * 100) / inputUsd
      const rate =
        Number(formattedInputAmount) > 0
          ? Number(formattedOutputAmount) / Number(formattedInputAmount)
          : 0

      return {
        quoteParams: params,
        outputAmount,
        formattedOutputAmount,
        inputUsd,
        outputUsd,
        rate,
        timeEstimate: (quoteResult.preSwap?.quote as any)?.timeEstimate || 0,
        priceImpact,
        gasFeeUsd: 0,
        contractAddress: depositAddress || ZERO_ADDRESS,
        rawQuote: {
          completeQuoteResult: quoteResult,
          sourceKind,
          fromChainId: Number(params.fromChain),
          toChainId: Number(params.toChain),
        } as unknown as RheaRawQuote,
        protocolFee: 0,
        platformFeePercent: (params.feeBps * 100) / 10_000,
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  private async executePreSwap(
    quote: Quote['quote'],
    walletClient: WalletClient,
    nearWallet?: ReturnType<typeof useWalletSelector>
  ): Promise<string> {
    const rawQuote = quote.rawQuote as RheaRawQuote
    const completeQuoteResult = rawQuote.completeQuoteResult
    const depositAddress = completeQuoteResult.intents.depositAddress
    const preSwap = completeQuoteResult.preSwap

    if (!preSwap) {
      return executeDirectBridgeTransfer({
        sourceKind: rawQuote.sourceKind,
        sourceToken: quote.quoteParams.fromToken,
        amount: quote.quoteParams.amount,
        depositAddress,
        walletClient,
        nearWallet,
      })
    }

    const routers = buildExecutionRouters(
      rawQuote.sourceKind,
      rawQuote.fromChainId,
      walletClient,
      nearWallet
    )

    const routeType = preSwap.routeType || (rawQuote.sourceKind === 'evm' ? 'evm' : 'v2')
    const router =
      routeType === 'evm' || routeType === 'v1'
        ? routers[0]
        : routers[1] || routers[0]

    if (!router) {
      throw new Error('Rhea execution router not available')
    }

    const executeParams = router.getCapabilities().requiresRecipient
      ? {
          quote: preSwap.quote as any,
          sender: quote.quoteParams.sender || walletClient.account?.address || '',
          receiveUser: depositAddress,
          recipient: depositAddress,
        }
      : {
          quote: preSwap.quote as any,
          recipient: depositAddress,
          depositAddress,
        }

    const result = await (router as any).executeSwap(executeParams as any, walletClient, nearWallet)
    return result.txHash || result.sourceTxHash || depositAddress
  }

  async executeSwap(
    { quote }: Quote,
    walletClient: WalletClient,
    nearWallet?: ReturnType<typeof useWalletSelector>
  ): Promise<NormalizedTxResponse> {
    const rawQuote = quote.rawQuote as RheaRawQuote
    const completeQuoteResult = rawQuote?.completeQuoteResult
    const depositAddress = completeQuoteResult?.intents?.depositAddress

    if (!depositAddress) {
      throw new Error('Rhea quote is missing deposit address')
    }

    const account =
      quote.quoteParams.sender ||
      walletClient.account?.address ||
      (nearWallet as any)?.signedAccountId ||
      ''

    if (!account) {
      throw new Error('Wallet client account is not defined')
    }

    const txHash = await this.executePreSwap(quote, walletClient, nearWallet)

    try {
      await OneClickService.submitDepositTx({
        txHash,
        depositAddress,
      })
    } catch (error) {
      console.log('Rhea submitDepositTx failed', error)
    }

    return {
      sender: account,
      id: depositAddress,
      sourceTxHash: txHash,
      adapter: this.getName(),
      sourceChain: quote.quoteParams.fromChain,
      targetChain: quote.quoteParams.toChain,
      inputAmount: quote.quoteParams.amount,
      outputAmount: quote.outputAmount.toString(),
      sourceToken: quote.quoteParams.fromToken,
      targetToken: quote.quoteParams.toToken,
      timestamp: Date.now(),
      status: 'Processing',
    }
  }

  async getTransactionStatus(p: NormalizedTxResponse): Promise<SwapStatus> {
    try {
      const res = await OneClickService.getExecutionStatus(p.id)
      const status = mapExecutionStatus((res as any).status)
      const txHash = (res as any).swapDetails?.destinationChainTxHashes?.[0]?.hash || p.sourceTxHash || ''

      return {
        txHash,
        status,
      }
    } catch {
      return {
        txHash: p.sourceTxHash || '',
        status: p.status === 'Failed' ? 'Failed' : 'Processing',
      }
    }
  }
}
