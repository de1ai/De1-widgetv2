import type {
  Components,
  PaletteMode,
  PaletteOptions,
  Shape,
  SxProps,
  Theme,
} from '@mui/material'
import type { TypographyOptions } from '@mui/material/styles/createTypography.js'
import type {
  BaseToken,
  ChainType,
  ContractCall,
  Order,
  RouteOptions,
  SDKConfig,
  StaticToken,
  Token,
} from '@de1/widget-sdk'
import type {
  CSSProperties,
  MutableRefObject,
  ReactNode,
  RefObject,
} from 'react'
import type {
  CoinbaseWalletParameters,
  MetaMaskParameters,
  WalletConnectParameters,
} from 'wagmi/connectors'
import type { Config } from 'wagmi'
import type {
  LanguageKey,
  LanguageResources,
} from '../providers/I18nProvider/types.js'
import type { DefaultFieldValues } from '../stores/form/types.js'

export type WidgetVariant = 'compact' | 'wide' | 'drawer'
export type WidgetSubvariant =
  | 'default'
  | 'swap'
  | 'bridge'
  | 'split'
  | 'custom'
  | 'refuel'
export type SplitSubvariant = 'bridge' | 'swap'
export type CustomSubvariant = 'checkout' | 'deposit'
export interface SubvariantOptions {
  split?: SplitSubvariant
  custom?: CustomSubvariant
}

export type Appearance = PaletteMode | 'auto'
export interface NavigationProps {
  /**
   * If given, uses a negative margin to counteract the padding on sides for navigation elements like icon buttons.
   * @default true
   */
  edge?: boolean
}
export type WidgetThemeComponents = Pick<
  Components<Theme>,
  | 'MuiAppBar'
  | 'MuiAvatar'
  | 'MuiButton'
  | 'MuiCard'
  | 'MuiIconButton'
  | 'MuiInputCard'
  | 'MuiTabs'
  | 'MuiTypography'
>

export type WidgetTheme = {
  palette?: Pick<
    PaletteOptions,
    'background' | 'grey' | 'primary' | 'secondary' | 'text'
  >
  shape?: Partial<Shape>
  typography?: TypographyOptions
  components?: WidgetThemeComponents
  container?: CSSProperties
  header?: CSSProperties
  playground?: CSSProperties
  navigation?: NavigationProps
}

export enum DisabledUI {
  FromAmount = 'fromAmount',
  FromToken = 'fromToken',
  ToAddress = 'toAddress',
  ToToken = 'toToken',
}
export type DisabledUIType = `${DisabledUI}`

export enum HiddenUI {
  Appearance = 'appearance',
  DrawerCloseButton = 'drawerCloseButton',
  History = 'history',
  Language = 'language',
  PoweredBy = 'poweredBy',
  ToAddress = 'toAddress',
  ToToken = 'toToken',
  WalletMenu = 'walletMenu',
  IntegratorStepDetails = 'integratorStepDetails',
  ReverseTokensButton = 'reverseTokensButton',
  RouteTokenDescription = 'routeTokenDescription',
}
export type HiddenUIType = `${HiddenUI}`

export enum RequiredUI {
  ToAddress = 'toAddress',
}
export type RequiredUIType = `${RequiredUI}`

export interface WidgetWalletConfig {
  onConnect?(): void
  walletConnect?: WalletConnectParameters
  coinbase?: CoinbaseWalletParameters
  metaMask?: MetaMaskParameters
  /**
   * Determines whether the widget should provide partial wallet management functionality.
   *
   * In partial mode, external wallet management will be used for "opt-out" providers,
   * while the internal management is applied for any remaining providers that do not opt out.
   * This allows a flexible balance between the integrator's custom wallet menu and the widget's native wallet menu.
   * @default false
   */
  usePartialWalletManagement?: boolean
  /**
   * Host (integrator) RainbowKit / wagmi config that should be treated as the
   * single source of truth for the connected EVM account.
   *
   * When provided, the widget will only READ this config (account / connector /
   * signer); it will NOT mutate its chains or connectors. The widget will
   * create an internal, scoped wagmi config of its own to consume the De¹
   * 40+ EVM chain list internally without leaking it into the host's
   * global wagmi config.
   *
   * Priority: this prop takes precedence over a host `<WagmiProvider config>`
   * found in context. The host's `WagmiContext` is still used as a fallback
   * when this prop is not provided.
   *
   * Best paired with `hideEvmWalletMenu: true` to avoid the widget showing
   * duplicate EVM wallet entries when the host already manages the wallet.
   */
  externalWagmiConfig?: Config
  /**
   * Whether to hide the widget's internal EVM wallet menu entries.
   *
   * - `true`: wallet menu does not render EVM list items, so users won't be
   *   prompted to connect a second EVM wallet inside the widget.
   * - `false` (default): existing behaviour – the widget still renders its
   *   own EVM wallet list.
   *
   * Recommended: set to `true` when `externalWagmiConfig` is provided so the
   * host's wallet (e.g. RainbowKit navbar) remains the single source of truth.
   */
  hideEvmWalletMenu?: boolean
}

export interface WidgetSDKConfig
  extends Omit<
    SDKConfig,
    | 'apiKey'
    | 'disableVersionCheck'
    | 'integrator'
    | 'routeOptions'
    | 'widgetVersion'
  > {
  routeOptions?: Omit<RouteOptions, 'bridges' | 'exchanges'>
}

export interface WidgetContractTool {
  name: string
  logoURI: string
}

export interface CalculateFeeParams {
  fromChainId: number
  toChainId: number
  fromTokenAddress: string
  toTokenAddress: string
  fromAddress?: string
  toAddress?: string
  fromAmount?: bigint
  toAmount?: bigint
  slippage?: number
}

export interface WidgetFeeConfig {
  name?: string
  logoURI?: string
  fee?: number
  /**
   * Function to calculate fees before fetching quotes.
   * If provided, this function will be used instead of the `fee` parameter.
   * Only one of `fee` or `calculateFee` should be used.
   *
   * @param params Object containing the fee calculation parameters
   * @returns A promise that resolves to the calculated fee as a number (e.g., 0.03 represents a 3% fee)
   */
  calculateFee?(params: CalculateFeeParams): Promise<number | undefined>
}

export interface ToAddress {
  name?: string
  address: string
  chainType: ChainType
  logoURI?: string
}

export interface AllowDeny<T> {
  allow?: T[]
  deny?: T[]
}

export type WidgetBridgesConfig = AllowDeny<string> & {
  /**
   * Show bridge selection in settings. Defaults to true.
   */
  showSettings?: boolean
}

export type WidgetChains = {
  from?: AllowDeny<number>
  to?: AllowDeny<number>
  types?: AllowDeny<ChainType>
} & AllowDeny<number>

export type WidgetTokens = {
  featured?: StaticToken[]
  include?: Token[]
  popular?: StaticToken[]
} & AllowDeny<BaseToken>

export type WidgetLanguages = {
  default?: LanguageKey
} & AllowDeny<LanguageKey>

export type PoweredByType = 'default' | 'jumper'

export interface RouteLabel {
  text: string
  sx?: SxProps<Theme>
}

export interface RouteLabelRule {
  label: RouteLabel
  // Matching criteria
  bridges?: WidgetBridgesConfig
  exchanges?: AllowDeny<string>
  fromChainId?: number[]
  toChainId?: number[]
  fromTokenAddress?: string[]
  toTokenAddress?: string[]
}

export interface WidgetConfig {
  fromChain?: number
  toChain?: number
  fromToken?: string
  toToken?: string
  defaultChain?: number
  defaultFromToken?: string
  defaultToToken?: string
  toAddress?: ToAddress
  toAddresses?: ToAddress[]
  fromAmount?: number | string
  toAmount?: number | string
  formUpdateKey?: string

  contractCalls?: ContractCall[]
  contractComponent?: ReactNode
  contractSecondaryComponent?: ReactNode
  contractCompactComponent?: ReactNode
  contractTool?: WidgetContractTool
  integrator: string
  apiKey?: string
  fee?: number
  feeConfig?: WidgetFeeConfig
  evmReferrer?: {
    address: string
    fee: string
  }
  solanaReferrer?: {
    address: string
    fee: string
  }
  /**
   * @deprecated Use `evmReferrer` instead. Kept as an alias of `evmReferrer` for backward compatibility.
   */
  referrer?: {
    address: string
    fee: string
  }
  slippageTolerance?: {
    value: string
  }

  routePriority?: Order
  slippage?: number

  variant?: WidgetVariant
  subvariant?: WidgetSubvariant
  subvariantOptions?: SubvariantOptions

  appearance?: Appearance
  theme?: WidgetTheme

  disabledUI?: DisabledUIType[]
  hiddenUI?: HiddenUIType[]
  requiredUI?: RequiredUIType[]
  useRecommendedRoute?: boolean
  useRelayerRoutes?: boolean

  walletConfig?: WidgetWalletConfig
  sdkConfig?: WidgetSDKConfig

  buildUrl?: boolean
  keyPrefix?: string

  bridges?: WidgetBridgesConfig
  exchanges?: AllowDeny<string>
  chains?: WidgetChains
  tokens?: WidgetTokens
  languages?: WidgetLanguages
  languageResources?: LanguageResources
  explorerUrls?: Record<number, string[]> &
  Partial<Record<'internal', string[]>>
  poweredBy?: PoweredByType
  isDefaultValueEnabled?: boolean
  isRwaTokenEnabled?: boolean
  /**
   * Custom labels/badges to show on routes based on specified rules
   */
  routeLabels?: RouteLabelRule[]
}

export interface FormFieldOptions {
  setUrlSearchParam: boolean
}

export interface FieldValues
  extends Omit<DefaultFieldValues, 'fromAmount' | 'toAmount' | 'toAddress'> {
  fromAmount?: number | string
  toAmount?: number | string
  toAddress?: ToAddress | string
}

export type FieldNames = keyof FieldValues

export type SetFieldValueFunction = <K extends FieldNames>(
  key: K,
  value: FieldValues[K],
  options?: FormFieldOptions
) => void

export type FormState = {
  setFieldValue: SetFieldValueFunction
}

export type FormRef = MutableRefObject<FormState | null>

export interface FormRefProps {
  formRef?: FormRef
}

export interface WidgetConfigProps extends FormRefProps {
  config: WidgetConfig
}

export interface WidgetConfigPartialProps {
  config?: Partial<WidgetConfig>
}

export type WidgetProps = WidgetDrawerProps &
  WidgetConfig &
  WidgetConfigPartialProps &
  FormRefProps

export interface WidgetDrawerProps extends WidgetConfigPartialProps {
  elementRef?: RefObject<HTMLDivElement>
  open?: boolean
  /**
   * Make sure to make the onClose callback stable (e.g. using useCallback) to avoid causing re-renders of the entire widget
   */
  onClose?(): void
}
