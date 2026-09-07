import { ChainId } from '@de1/widget-sdk'
import { type WalletClient, formatUnits, parseUnits } from 'viem'
import { PegasusLogo } from '../../icons/pegasus.js'
import type { Quote } from '../registry.js'
import {
  BaseSwapAdapter,
  type Chain,
  type NormalizedQuote,
  type NormalizedTxResponse,
  type QuoteParams,
  type SwapStatus,
} from './BaseSwapAdapter.js'

// const DEFAULT_PEGASUS_API_BASE = 'https://stagenet-api.pegasusfi.xyz'
const DEFAULT_PEGASUS_API_BASE = 'https://open-api.de1.exchange/pegasusfi'
const PEGASUS_API_KEY = ''

const CHAIN_ID_TO_PEGASUS: Record<string, string> = {
  [ChainId.ETH]: 'ETH',
  [ChainId.BSC]: 'BSC',
  [ChainId.POL]: 'POLYGON',
  [ChainId.ARB]: 'ARB',
  [ChainId.OPT]: 'OPTIMISM',
  [ChainId.AVA]: 'AVAX',
  [ChainId.BAS]: 'BASE',
  [ChainId.FTM]: 'FTM',
  [ChainId.SCL]: 'SCROLL',
  [ChainId.BLS]: 'BLAST',
  [ChainId.UNI]: 'UNICHAIN',
}

const NATIVE_TOKEN_SYMBOL: Record<string, string> = {
  [ChainId.ETH]: 'ETH',
  [ChainId.BSC]: 'BNB',
  [ChainId.POL]: 'MATIC',
  [ChainId.ARB]: 'ETH',
  [ChainId.OPT]: 'ETH',
  [ChainId.AVA]: 'AVAX',
  [ChainId.BAS]: 'ETH',
  [ChainId.FTM]: 'FTM',
}

const erc20ApproveAbi = [
  {
    inputs: [
      { type: 'address', name: 'spender' },
      { type: 'uint256', name: 'amount' },
    ],
    name: 'approve',
    outputs: [{ type: 'bool', name: '' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

const erc20TransferAbi = [
  {
    inputs: [
      { type: 'address', name: 'to' },
      { type: 'uint256', name: 'amount' },
    ],
    name: 'transfer',
    outputs: [{ type: 'bool', name: '' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

type PegasusRoute = {
  provider: string
  providerType: string
  expectedOutput: string
  estimatedTimeSeconds: number
  fees?: {
    affiliate?: string
    liquidity?: string
    outbound?: string
    total?: string
    totalBps?: number
    slippageBps?: number
  }
  inboundAddress?: string | null
  memo?: string | null
  router?: string | null
  expiry?: string | number | null
  gasRate?: string | null
  minAmount?: string | null
  resolvedFee?: { feeBps: number }
  openOceanRoute?: {
    dexId?: number
    dexCode?: string
    dexes?: Array<{ dexId?: number; dexCode?: string }>
  }
}

type PegasusQuoteResponse = {
  quoteId: string
  expiresAt: string
  routes: PegasusRoute[]
  warnings?: Array<{
    provider: string
    code: string
    message: string
    userMessage: string
  }>
}

type PegasusTokenAmount = {
  display: string
  baseUnits: string
}

type PegasusEvmApproval = {
  spender: string
  tokenAddress: string
  amount: PegasusTokenAmount
}

type PegasusEvmSwapExecution = {
  family: 'evm'
  chainId: number
  mode: 'contract-call' | 'native-transfer' | 'erc20-transfer'
  to: string
  data: string | null
  value: PegasusTokenAmount
  gasLimit: string | null
  memo: string | null
  approval: PegasusEvmApproval | null
  transferAmount: PegasusTokenAmount | null
}

type PegasusUtxoSwapExecution = {
  family: 'utxo'
  mode: 'payment-with-memo'
  to: string
  amount: PegasusTokenAmount
  memo: string | null
  gasRate: string | null
}

type PegasusCosmosBankSendExecution = {
  family: 'cosmos'
  mode: 'bank-send'
  to: string
  amount: PegasusTokenAmount
  memo: string | null
}

type PegasusCosmosMsgDepositExecution = {
  family: 'cosmos'
  mode: 'msg-deposit'
  to: string
  amount: PegasusTokenAmount
  memo: string | null
  asset: string
  assetDecimals: number
}

type PegasusSerializedSwapExecution = {
  family: 'solana' | 'sui'
  mode: 'serialized-tx'
  serializedTransaction: string
  minOut: PegasusTokenAmount
}

type PegasusNamedDepositSwapExecution = {
  family: 'solana' | 'sui' | 'xrp' | 'tron' | 'near' | 'hypercore' | 'cardano'
  mode: 'deposit-transfer'
  to: string
  amount: PegasusTokenAmount
  memo: string | null
}

type PegasusOtherDepositSwapExecution = {
  family: 'other'
  mode: 'deposit-transfer'
  chain: string
  to: string
  amount: PegasusTokenAmount
  memo: string | null
}

type PegasusSwapExecution =
  | PegasusEvmSwapExecution
  | PegasusUtxoSwapExecution
  | PegasusCosmosBankSendExecution
  | PegasusCosmosMsgDepositExecution
  | PegasusSerializedSwapExecution
  | PegasusNamedDepositSwapExecution
  | PegasusOtherDepositSwapExecution

type PegasusInstaswapSwapLite = {
  txid?: string
  depositAddress?: string
  depositTokenSymbol?: string
  depositAmount?: number
  instructions?: string
  expiresAt?: string
}

type PegasusSwapProviderInfo = {
  name: string
  referenceId: string | null
  details?: {
    instaswapSwapLite?: PegasusInstaswapSwapLite
    openOceanRoute?: PegasusRoute['openOceanRoute']
  } & Record<string, unknown>
}

type PegasusSwapResponse = {
  transactionId: string
  status: string
  providerType: string
  route: PegasusRoute
  execution: PegasusSwapExecution
  provider: PegasusSwapProviderInfo
}

type PegasusRawQuote = PegasusQuoteResponse & {
  selectedRoute: PegasusRoute
  pegasusContext: {
    fromChain: string
    fromToken: string
    toChain: string
    toToken: string
    amount: string
  }
}

type PegasusTxHashResponse = {
  transactionId: string
  status: 'submitted'
  txHash: string
}

type PegasusSwapStatusResponse = {
  transactionId: string
  status?: 'pending' | 'executing' | 'success' | 'fail'
  internalStatus?:
    | 'pending'
    | 'submitted'
    | 'executing'
    | 'confirming'
    | 'completed'
    | 'failed'
    | 'refunded'
  destinationTxHash?: string
  txHash?: string
  input?: {
    txHash?: string
  }
  output?: {
    txHash?: string
  }
}

type PegasusSwapRequest = {
  fromChain: string
  fromToken: string
  toChain: string
  toToken: string
  amount: string
  destinationAddress: string
  senderAddress: string
  quoteId?: string
  routeProvider?: string
  slippageTolerance?: number
  streaming?: boolean
  integrationId?: string
}

type PegasusChainInfo = {
  chain: string
  chainId?: number
  name?: string
  assets?: string[]
}

type PegasusChainsResponse = {
  chains: PegasusChainInfo[]
}

type PegasusTokensResponse = {
  chain: string
  tokens: Array<{ id: string; symbol: string }>
}

type PegasusApiError = {
  error?: {
    code?: string
    message?: string
    userMessage?: string
  }
}

const CHAINS_CACHE_TTL_MS = 5 * 60 * 1000

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const NATIVE_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

function parsePegasusAsset(asset: string): { symbol: string; address?: string } {
  const dashIndex = asset.indexOf('-')
  if (dashIndex === -1) {
    return { symbol: asset }
  }

  return {
    symbol: asset.slice(0, dashIndex),
    address: asset.slice(dashIndex + 1),
  }
}

function readEnvVar(name: string): string | undefined {
  try {
    if (typeof process !== 'undefined' && process.env?.[name]) {
      return process.env[name]
    }
  } catch {
    // ignore
  }

  try {
    const metaEnv = (import.meta as { env?: Record<string, string> }).env
    if (metaEnv?.[name]) {
      return metaEnv[name]
    }
    if (metaEnv?.[`VITE_${name}`]) {
      return metaEnv[`VITE_${name}`]
    }
  } catch {
    // ignore
  }

  return undefined
}

function getPegasusApiBase(): string {
  return (
    readEnvVar('PEGASUS_API_BASE')?.replace(/\/$/, '') ||
    DEFAULT_PEGASUS_API_BASE
  )
}

function getPegasusApiKey(): string {
  return PEGASUS_API_KEY
}

function getPegasusIntegrationId(): string | undefined {
  return readEnvVar('PEGASUS_INTEGRATION_ID')
}

function toSlippageTolerance(slippageBps: number): number | undefined {
  if (!slippageBps || slippageBps <= 0) {
    return undefined
  }

  return slippageBps / 10_000
}

export class PegasusAdapter extends BaseSwapAdapter {
  private chainsCache: {
    fetchedAt: number
    data: PegasusChainsResponse
  } | null = null

  private tokensCache: Map<
    string,
    { fetchedAt: number; tokens: string[] }
  > = new Map()

  getName(): string {
    return 'Pegasus'
  }

  getIcon(): string {
    return PegasusLogo
  }

  getSupportedChains(): Chain[] {
    return Object.keys(CHAIN_ID_TO_PEGASUS).map(Number) as Chain[]
  }

  getSupportedTokens(_sourceChain: Chain, _destChain: Chain): any[] {
    return []
  }

  private async pegasusRequest<T>(
    path: string,
    init?: RequestInit
  ): Promise<T> {
    const url = `${getPegasusApiBase()}${path}`
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30_000)
    let response: Response
    try {
      response = await fetch(url, {
        ...init,
        signal: controller.signal,
        headers: {
          // 'X-API-Key': getPegasusApiKey(),
          ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
          ...(init?.headers || {}),
        },
      })
    } catch (error) {
      const reason =
        (error as Error)?.name === 'AbortError'
          ? 'request timeout (30s)'
          : (error as Error)?.message || 'network error'
      throw new Error(`Pegasus API request failed (${url}): ${reason}`)
    } finally {
      clearTimeout(timeout)
    }

    let data: T & PegasusApiError
    try {
      data = (await response.json()) as T & PegasusApiError
    } catch (error) {
      throw new Error(
        `Pegasus API request failed (${url}): invalid JSON response (status ${response.status})`
      )
    }
    if (!response.ok || data.error) {
      throw new Error(
        data.error?.userMessage ||
        data.error?.message ||
        `Pegasus API request failed (${url}, ${response.status})`
      )
    }

    return data
  }

  private async getChains(): Promise<PegasusChainsResponse> {
    if (
      this.chainsCache &&
      Date.now() - this.chainsCache.fetchedAt < CHAINS_CACHE_TTL_MS
    ) {
      return this.chainsCache.data
    }

    const raw = await this.pegasusRequest<{
      chains: Array<{ id: string; name: string; chainId: number | null }>
    }>('/chains', {
      method: 'GET',
    })

    const data: PegasusChainsResponse = {
      chains: (raw.chains || []).map((chain) => ({
        chain: chain.id,
        name: chain.name,
        chainId: chain.chainId ?? undefined,
        assets: undefined,
      })),
    }

    this.chainsCache = {
      fetchedAt: Date.now(),
      data,
    }

    return data
  }

  private async getTokensForChain(pegasusChain: string): Promise<string[]> {
    const cached = this.tokensCache.get(pegasusChain)
    if (cached && Date.now() - cached.fetchedAt < CHAINS_CACHE_TTL_MS) {
      return cached.tokens
    }

    const data = await this.pegasusRequest<PegasusTokensResponse>(
      `/tokens?chain=${encodeURIComponent(pegasusChain)}`,
      { method: 'GET' }
    )

    const tokens = (data.tokens || []).map((token) => token.id)
    this.tokensCache.set(pegasusChain, { fetchedAt: Date.now(), tokens })

    return tokens
  }

  private async resolvePegasusChainData(
    internalChain: Chain
  ): Promise<PegasusChainInfo> {
    const pegasusChain = this.toPegasusChain(internalChain)
    const { chains } = await this.getChains()

    const bySymbol = chains.find((chain) => chain.chain === pegasusChain)
    if (bySymbol) {
      const assets = await this.getTokensForChain(pegasusChain)
      return { ...bySymbol, assets }
    }

    const byChainId = chains.find((chain) => chain.chainId === internalChain)
    if (byChainId) {
      const assets = await this.getTokensForChain(byChainId.chain)
      return { ...byChainId, assets }
    }

    throw new Error(`Pegasus chain not found: ${pegasusChain}`)
  }

  private async getChainAssets(internalChain: Chain): Promise<string[]> {
    const chainData = await this.resolvePegasusChainData(internalChain)
    return chainData.assets || []
  }

  private toPegasusChain(chain: Chain): string {
    const pegasusChain = CHAIN_ID_TO_PEGASUS[chain]
    if (!pegasusChain) {
      throw new Error(`Pegasus does not support chain ${chain}`)
    }
    return pegasusChain
  }

  private async resolvePegasusToken(chain: Chain, token: any): Promise<string> {
    const pegasusChain = this.toPegasusChain(chain)
    const assets = await this.getChainAssets(chain)

    const address = token.address?.toLowerCase?.() || ''
    const isNative =
      token.isNative ||
      address === ZERO_ADDRESS ||
      address === NATIVE_ADDRESS

    if (isNative) {
      const nativeCandidates = [
        NATIVE_TOKEN_SYMBOL[chain],
        token.symbol,
      ]
        .filter(Boolean)
        .map((symbol) => symbol!.toUpperCase())

      for (const symbol of nativeCandidates) {
        const nativeAsset = assets.find(
          (asset) => !asset.includes('-') && asset.toUpperCase() === symbol
        )
        if (nativeAsset) {
          return nativeAsset
        }
      }

      throw new Error(
        `Native token not supported on Pegasus chain ${pegasusChain}`
      )
    }

    const erc20Asset = assets.find((asset) => {
      const parsed = parsePegasusAsset(asset)
      return parsed.address?.toLowerCase() === address
    })

    if (erc20Asset) {
      return erc20Asset
    }

    const symbolAsset = assets.find((asset) => {
      const parsed = parsePegasusAsset(asset)
      return (
        parsed.address &&
        parsed.symbol.toUpperCase() === token.symbol?.toUpperCase()
      )
    })

    if (symbolAsset) {
      return symbolAsset
    }

    throw new Error(
      `Token ${token.symbol || address} is not supported on Pegasus chain ${pegasusChain}`
    )
  }

  private selectBestRoute(
    routes: PegasusRoute[],
    warnings?: PegasusQuoteResponse['warnings']
  ): PegasusRoute {
    if (!routes.length) {
      const reason = (warnings || [])
        .map((w) => `${w.provider}: ${w.userMessage || w.message}`)
        .join('; ')
      throw new Error(
        reason
          ? `No Pegasus routes found. ${reason}`
          : 'No Pegasus routes found'
      )
    }

    const blockedProviders = new Set(
      (warnings || [])
        .filter((warning) =>
          ['UNSUPPORTED_PAIR', 'CHAIN_HALTED'].includes(warning.code)
        )
        .map((warning) => warning.provider.toLowerCase())
    )

    const eligibleRoutes = routes.filter(
      (route) => !blockedProviders.has(route.provider.toLowerCase())
    )
    const targetRoutes = eligibleRoutes.length > 0 ? eligibleRoutes : routes

    return targetRoutes.reduce((best, current) =>
      Number.parseFloat(current.expectedOutput) >
        Number.parseFloat(best.expectedOutput)
        ? current
        : best
    )
  }

  async getQuote(params: QuoteParams): Promise<NormalizedQuote> {
    try {
      const fromChain = this.toPegasusChain(params.fromChain)
      const toChain = this.toPegasusChain(params.toChain)
      const fromToken = await this.resolvePegasusToken(
        params.fromChain,
        params.fromToken
      )
      const toToken = await this.resolvePegasusToken(
        params.toChain,
        params.toToken
      )
      const amount = formatUnits(
        BigInt(params.amount),
        params.fromToken.decimals
      )

      const searchParams = new URLSearchParams({
        fromChain,
        fromToken,
        toChain,
        toToken,
        amount,
      })

      if (params.recipient) {
        searchParams.set('destinationAddress', params.recipient)
      }

      const integrationId = getPegasusIntegrationId()
      if (integrationId) {
        searchParams.set('integrationId', integrationId)
      }

      const quoteResponse = await this.pegasusRequest<PegasusQuoteResponse>(
        `/quote?${searchParams.toString()}`,
        { method: 'GET' }
      )

      const selectedRoute = this.selectBestRoute(
        quoteResponse.routes,
        quoteResponse.warnings
      )

      const formattedInputAmount = amount
      const formattedOutputAmount = selectedRoute.expectedOutput
      const outputAmount = parseUnits(
        formattedOutputAmount,
        params.toToken.decimals
      )

      const inputUsd = params.tokenInUsd * Number.parseFloat(formattedInputAmount)
      const outputUsd =
        params.tokenOutUsd * Number.parseFloat(formattedOutputAmount)

      const priceImpact =
        !inputUsd || !outputUsd
          ? Number.NaN
          : ((inputUsd - outputUsd) * 100) / inputUsd

      const rate =
        Number.parseFloat(formattedInputAmount) > 0
          ? Number.parseFloat(formattedOutputAmount) /
          Number.parseFloat(formattedInputAmount)
          : 0

      const rawQuote: PegasusRawQuote = {
        ...quoteResponse,
        selectedRoute,
        pegasusContext: {
          fromChain,
          fromToken,
          toChain,
          toToken,
          amount,
        },
      }

      return {
        quoteParams: params,
        outputAmount,
        formattedOutputAmount,
        inputUsd,
        outputUsd,
        rate,
        timeEstimate: selectedRoute.estimatedTimeSeconds || 0,
        priceImpact,
        gasFeeUsd: 0,
        contractAddress:
          selectedRoute.router ||
          selectedRoute.inboundAddress ||
          ZERO_ADDRESS,
        rawQuote,
        protocolFee: Number.parseFloat(selectedRoute.fees?.total || '0'),
        platformFeePercent: (params.feeBps * 100) / 10_000,
      }
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  private async buildSwapRequest(
    quote: Quote['quote'],
    account: string
  ): Promise<PegasusSwapRequest> {
    const rawQuote = quote.rawQuote as PegasusRawQuote
    const pegasusContext = rawQuote?.pegasusContext

    const fromChain =
      pegasusContext?.fromChain ||
      this.toPegasusChain(quote.quoteParams.fromChain)
    const toChain =
      pegasusContext?.toChain || this.toPegasusChain(quote.quoteParams.toChain)
    const fromToken =
      pegasusContext?.fromToken ||
      (await this.resolvePegasusToken(
        quote.quoteParams.fromChain,
        quote.quoteParams.fromToken
      ))
    const toToken =
      pegasusContext?.toToken ||
      (await this.resolvePegasusToken(
        quote.quoteParams.toChain,
        quote.quoteParams.toToken
      ))
    const amount =
      pegasusContext?.amount ||
      formatUnits(
        BigInt(quote.quoteParams.amount),
        quote.quoteParams.fromToken.decimals
      )

    const senderAddress = quote.quoteParams.sender || account
    const destinationAddress = quote.quoteParams.recipient || account

    const swapRequest: PegasusSwapRequest = {
      fromChain,
      fromToken,
      toChain,
      toToken,
      amount,
      senderAddress,
      destinationAddress,
    }

    if (rawQuote?.quoteId) {
      swapRequest.quoteId = rawQuote.quoteId
    }

    if (rawQuote?.selectedRoute?.provider) {
      swapRequest.routeProvider = rawQuote.selectedRoute.provider
    }

    const slippageTolerance = toSlippageTolerance(quote.quoteParams.slippage)
    if (slippageTolerance !== undefined) {
      swapRequest.slippageTolerance = slippageTolerance
    }

    const integrationId = getPegasusIntegrationId()
    if (integrationId) {
      swapRequest.integrationId = integrationId
    }

    return swapRequest
  }

  private isOnChainTxHash(txHash: string): boolean {
    return /^0x[0-9a-fA-F]{64}$/.test(txHash)
  }

  /**
   * After the user signs and broadcasts on-chain, submit the tx hash so Pegasus
   * can move the swap to `submitted` and begin monitoring.
   * @see https://stagenet-app.pegasusfi.xyz/docs/integrators/transaction-monitoring
   */
  private async submitSwapTxHash(
    transactionId: string,
    txHash: string
  ): Promise<PegasusTxHashResponse | undefined> {
    if (!transactionId || !this.isOnChainTxHash(txHash)) {
      return undefined
    }

    try {
      return await this.pegasusRequest<PegasusTxHashResponse>(
        `/swap/${encodeURIComponent(transactionId)}/txhash`,
        {
          method: 'POST',
          body: JSON.stringify({ txHash }),
        }
      )
    } catch (error) {
      console.error('Pegasus submit txhash failed', {
        transactionId,
        txHash,
        error,
      })
      return undefined
    }
  }

  private async executeWalletTxAndSubmit(
    transactionId: string,
    executeTx: () => Promise<`0x${string}`>
  ): Promise<{ txHash: `0x${string}`; submitted: boolean }> {
    const txHash = await executeTx()
    const response = await this.submitSwapTxHash(transactionId, txHash)
    return { txHash, submitted: Boolean(response) }
  }

  private getTokenContractAddress(
    token: Quote['quote']['quoteParams']['fromToken']
  ): `0x${string}` {
    if ('contractAddress' in token && token.contractAddress) {
      return token.contractAddress as `0x${string}`
    }

    if ('address' in token && token.address) {
      return token.address as `0x${string}`
    }

    throw new Error('Token contract address is not available for deposit transfer')
  }

  private isNativeToken(
    token: Quote['quote']['quoteParams']['fromToken']
  ): boolean {
    return 'isNative' in token && Boolean(token.isNative)
  }

  private async executeInstaswapDeposit(
    quote: Quote['quote'],
    walletClient: WalletClient,
    account: `0x${string}`,
    depositAddress: string,
    transactionId: string
  ): Promise<{ txHash: string; submitted: boolean }> {
    const fromToken = quote.quoteParams.fromToken
    const amount = BigInt(quote.quoteParams.amount)

    return this.isNativeToken(fromToken)
      ? this.executeWalletTxAndSubmit(transactionId, () =>
          walletClient.sendTransaction({
            chain: undefined,
            account,
            to: depositAddress as `0x${string}`,
            data: '0x',
            value: amount,
            kzg: undefined,
          })
        )
      : this.executeWalletTxAndSubmit(transactionId, () =>
          walletClient.writeContract({
            chain: undefined,
            account,
            address: this.getTokenContractAddress(fromToken),
            abi: erc20TransferAbi,
            functionName: 'transfer',
            args: [depositAddress as `0x${string}`, amount],
          })
        )
  }

  async executeSwap(
    { quote }: Quote,
    walletClient: WalletClient
  ): Promise<NormalizedTxResponse> {
    const rawQuote = quote.rawQuote as PegasusRawQuote
    if (!rawQuote?.quoteId || !rawQuote?.selectedRoute?.provider) {
      throw new Error('Pegasus quote is missing quoteId or provider')
    }

    const account = walletClient.account?.address
    if (!account) {
      throw new Error('Wallet client account is not defined')
    }

    const swapRequest = await this.buildSwapRequest(quote, account)

    const swapResponse = await this.pegasusRequest<PegasusSwapResponse>(
      '/swap',
      {
        method: 'POST',
        body: JSON.stringify(swapRequest),
      }
    )

    const execution = swapResponse.execution
    const transactionId = swapResponse.transactionId
    let sourceTxHash = transactionId
    let txHashSubmitted = false

    if (!execution) {
      throw new Error(
        'Pegasus swap did not return executable transaction parameters'
      )
    }

    if (execution.family === 'evm') {
      const evmExecution = execution as PegasusEvmSwapExecution

      if (evmExecution.approval) {
        await walletClient.writeContract({
          chain: undefined,
          account,
          address: evmExecution.approval.tokenAddress as `0x${string}`,
          abi: erc20ApproveAbi,
          functionName: 'approve',
          args: [
            evmExecution.approval.spender as `0x${string}`,
            BigInt(evmExecution.approval.amount.baseUnits),
          ],
        })
      }

      if (evmExecution.mode === 'contract-call') {
        const result = await this.executeWalletTxAndSubmit(transactionId, () =>
          walletClient.sendTransaction({
            chain: undefined,
            account,
            to: evmExecution.to as `0x${string}`,
            data: (evmExecution.data ?? '0x') as `0x${string}`,
            value: BigInt(evmExecution.value?.baseUnits || '0'),
            gas: evmExecution.gasLimit
              ? BigInt(evmExecution.gasLimit)
              : undefined,
            kzg: undefined,
          })
        )
        sourceTxHash = result.txHash
        txHashSubmitted = result.submitted
      } else if (evmExecution.mode === 'native-transfer') {
        const result = await this.executeWalletTxAndSubmit(transactionId, () =>
          walletClient.sendTransaction({
            chain: undefined,
            account,
            to: evmExecution.to as `0x${string}`,
            data: '0x' as `0x${string}`,
            value: BigInt(evmExecution.value?.baseUnits || '0'),
            kzg: undefined,
          })
        )
        sourceTxHash = result.txHash
        txHashSubmitted = result.submitted
      } else if (evmExecution.mode === 'erc20-transfer') {
        if (!evmExecution.transferAmount) {
          throw new Error(
            'Pegasus erc20-transfer execution missing transferAmount'
          )
        }
        const result = await this.executeWalletTxAndSubmit(transactionId, () =>
          walletClient.writeContract({
            chain: undefined,
            account,
            address: this.getTokenContractAddress(quote.quoteParams.fromToken),
            abi: erc20TransferAbi,
            functionName: 'transfer',
            args: [
              evmExecution.to as `0x${string}`,
              BigInt(evmExecution.transferAmount.baseUnits),
            ],
          })
        )
        sourceTxHash = result.txHash
        txHashSubmitted = result.submitted
      } else {
        throw new Error(
          `Unsupported Pegasus EVM execution mode: ${(evmExecution as { mode?: string }).mode}`
        )
      }
    } else {
      const instaswapLite =
        (execution as { instaswapSwapLite?: PegasusInstaswapSwapLite })
          .instaswapSwapLite ||
        swapResponse.provider?.details?.instaswapSwapLite

      if (instaswapLite) {
        const depositAddress = instaswapLite.depositAddress
        if (!depositAddress) {
          throw new Error(
            'Pegasus instaswap execution missing depositAddress'
          )
        }
        const depositResult = await this.executeInstaswapDeposit(
          quote,
          walletClient,
          account,
          depositAddress,
          transactionId
        )
        sourceTxHash = depositResult.txHash
        txHashSubmitted = depositResult.submitted
      } else if (rawQuote.selectedRoute.inboundAddress) {
        throw new Error(
          `Pegasus route requires deposit to ${rawQuote.selectedRoute.inboundAddress}. Manual deposit flow is not implemented yet.`
        )
      } else {
        throw new Error(
          `Pegasus execution family "${(execution as { family?: string }).family}" (mode "${(execution as { mode?: string }).mode}") is not supported by this adapter`
        )
      }
    }

    return {
      sender: quote.quoteParams.sender,
      id: transactionId,
      sourceTxHash,
      adapter: this.getName(),
      sourceChain: quote.quoteParams.fromChain,
      targetChain: quote.quoteParams.toChain,
      inputAmount: quote.quoteParams.amount,
      outputAmount: quote.outputAmount.toString(),
      sourceToken: quote.quoteParams.fromToken,
      targetToken: quote.quoteParams.toToken,
      timestamp: Date.now(),
      status: txHashSubmitted ? 'Success' : 'Processing',
      txHashSubmitted,
    }
  }

  async getTransactionStatus(p: NormalizedTxResponse): Promise<SwapStatus> {
    if (p.txHashSubmitted || p.status === 'Success') {
      return {
        txHash: p.sourceTxHash,
        status: 'Success',
      }
    }

    try {
      const data = await this.pegasusRequest<PegasusSwapStatusResponse>(
        `/swap/${encodeURIComponent(p.id)}`,
        { method: 'GET' }
      )

      const status = (
        data.internalStatus ||
        data.status ||
        ''
      ).toLowerCase()
      let finalStatus: SwapStatus['status'] = 'Processing'

      if (
        status === 'completed' ||
        status === 'success' ||
        status === 'done'
      ) {
        finalStatus = 'Success'
      } else if (
        status === 'failed' ||
        status === 'fail' ||
        status === 'reverted'
      ) {
        finalStatus = 'Failed'
      } else if (status === 'refunded') {
        finalStatus = 'Refunded'
      }

      return {
        txHash:
          data.destinationTxHash ||
          data.output?.txHash ||
          data.input?.txHash ||
          data.txHash ||
          '',
        status: finalStatus,
      }
    } catch (error) {
      console.error('Failed to get Pegasus transaction status:', error)
      return {
        txHash: '',
        status: 'Processing',
      }
    }
  }
}
