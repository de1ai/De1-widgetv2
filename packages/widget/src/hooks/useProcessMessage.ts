import type {
  EVMChain,
  De1Step,
  Process,
  ProcessStatus,
  ProcessType,
  StatusMessage,
  Substatus,
} from '@de1/widget-sdk'
import { De1ErrorCode } from '@de1/widget-sdk'
import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import type { SubvariantOptions, WidgetSubvariant } from '../types/widget.js'
import { formatTokenAmount } from '../utils/format.js'
import { useAvailableChains } from './useAvailableChains.js'

export const useProcessMessage = (step?: De1Step, process?: Process) => {
  const { subvariant, subvariantOptions } = useWidgetConfig()
  const { t } = useTranslation()
  const { getChainById } = useAvailableChains()
  if (!step || !process) {
    return {}
  }
  return getProcessMessage(
    t,
    getChainById,
    step,
    process,
    subvariant,
    subvariantOptions
  )
}

const processStatusMessages: Record<
  ProcessType,
  Partial<
    Record<
      ProcessStatus,
      (
        t: TFunction,
        step: De1Step,
        subvariant?: WidgetSubvariant,
        subvariantOptions?: SubvariantOptions
      ) => string
    >
  >
> = {
  TOKEN_ALLOWANCE: {
    STARTED: (t) => t('main.process.tokenAllowance.started'),
    ACTION_REQUIRED: (t, step) =>
      t('main.process.tokenAllowance.actionRequired', {
        tokenSymbol: step.action.fromToken.symbol,
      }),
    PENDING: (t, step) =>
      t('main.process.tokenAllowance.pending', {
        tokenSymbol: step.action.fromToken.symbol,
      }),
    DONE: (t, step) =>
      t('main.process.tokenAllowance.done', {
        tokenSymbol: step.action.fromToken.symbol,
      }),
  },
  SWITCH_CHAIN: {
    ACTION_REQUIRED: (t) => t('main.process.switchChain.actionRequired'),
    DONE: (t) => t('main.process.switchChain.done'),
  },
  PERMIT: {
    STARTED: (t) => t('main.process.permit.started'),
    ACTION_REQUIRED: (t) => t('main.process.permit.actionRequired'),
    PENDING: (t) => t('main.process.permit.pending'),
    DONE: (t) => t('main.process.permit.done'),
  },
  SWAP: {
    STARTED: (t) => t('main.process.swap.started'),
    ACTION_REQUIRED: (t) => t('main.process.swap.actionRequired'),
    PENDING: (t) => t('main.process.swap.pending'),
    DONE: (t, _, subvariant, subvariantOptions) =>
      subvariant === 'custom'
        ? t(`main.process.${subvariantOptions?.custom ?? 'checkout'}.done`)
        : t('main.process.swap.done'),
  },
  CROSS_CHAIN: {
    STARTED: (t) => t('main.process.bridge.started'),
    ACTION_REQUIRED: (t) => t('main.process.bridge.actionRequired'),
    PENDING: (t) => t('main.process.bridge.pending'),
    DONE: (t) => t('main.process.bridge.done'),
  },
  RECEIVING_CHAIN: {
    PENDING: (t) => t('main.process.receivingChain.pending'),
    DONE: (t, _, subvariant, subvariantOptions) =>
      subvariant === 'custom'
        ? t(`main.process.${subvariantOptions?.custom ?? 'checkout'}.done`)
        : t('main.process.receivingChain.done'),
  },
  TRANSACTION: {},
}

const processSubstatusMessages: Record<
  StatusMessage,
  Partial<Record<Substatus, (t: TFunction) => string>>
> = {
  PENDING: {
    // BRIDGE_NOT_AVAILABLE: 'Bridge communication is temporarily unavailable.',
    // CHAIN_NOT_AVAILABLE: 'RPC communication is temporarily unavailable.',
    // REFUND_IN_PROGRESS:
    //   "The refund has been requested and it's being processed",
    // WAIT_DESTINATION_TRANSACTION:
    //   'The bridge off-chain logic is being executed. Wait for the transaction to appear on the destination chain.',
    // WAIT_SOURCE_CONFIRMATIONS:
    //   'The bridge deposit has been received. The bridge is waiting for more confirmations to start the off-chain logic.',
  },
  DONE: {
    // COMPLETED: 'The transfer is complete.',
    PARTIAL: (t) => t('main.process.receivingChain.partial'),
    REFUNDED: (t) => t('main.process.receivingChain.partial'),
  },
  FAILED: {
    // TODO: should be moved to failed status
    // NOT_PROCESSABLE_REFUND_NEEDED:
    //   'The transfer cannot be completed successfully. A refund operation is required.',
    // UNKNOWN_ERROR:
    //   'An unexpected error occurred. Please seek assistance in the De¹ Exchange discord server.',
  },
  INVALID: {},
  NOT_FOUND: {},
}

export function getProcessMessage(
  t: TFunction,
  getChainById: (chainId: number) => EVMChain | undefined,
  step: De1Step,
  process: Process,
  subvariant?: WidgetSubvariant,
  subvariantOptions?: SubvariantOptions
): {
  title?: string
  message?: string
} {
  if (process.error && process.status === 'FAILED') {
    const getDefaultErrorMessage = (key?: string) =>
      `${t((key as any) ?? 'error.message.transactionNotSent')} ${t(
        'error.message.remainInYourWallet',
        {
          amount: formatTokenAmount(
            BigInt(step.action.fromAmount),
            step.action.fromToken.decimals
          ),
          tokenSymbol: step.action.fromToken.symbol,
          chainName: getChainById(step.action.fromChainId)?.name ?? '',
        }
      )}`
    let title = ''
    let message = ''
    switch (process.error.code) {
      case De1ErrorCode.AllowanceRequired:
        title = t('error.title.allowanceRequired')
        message = t('error.message.allowanceRequired', {
          tokenSymbol: step.action.fromToken.symbol,
        })
        break
      case De1ErrorCode.BalanceError:
        title = t('error.title.balanceIsTooLow')
        message = getDefaultErrorMessage()
        break
      case De1ErrorCode.ChainSwitchError:
        title = t('error.title.chainSwitch')
        message = getDefaultErrorMessage()
        break
      case De1ErrorCode.GasLimitError:
        title = t('error.title.gasLimitIsTooLow')
        message = getDefaultErrorMessage()
        break
      case De1ErrorCode.InsufficientFunds:
        title = t('error.title.insufficientFunds')
        message = `${t(
          'error.message.insufficientFunds'
        )} ${getDefaultErrorMessage()}`
        break
      case De1ErrorCode.SlippageError:
        title = t('error.title.slippageNotMet')
        message = t('error.message.slippageThreshold')
        break
      case De1ErrorCode.TransactionFailed:
        title = t('error.title.transactionFailed')
        message = t('error.message.transactionFailed')
        break
      case De1ErrorCode.TransactionExpired:
        title = t('error.title.transactionExpired')
        message = t('error.message.transactionExpired')
        break
      case De1ErrorCode.TransactionSimulationFailed:
        title = t('error.title.transactionSimulationFailed')
        message = t('error.message.transactionSimulationFailed')
        break
      case De1ErrorCode.WalletChangedDuringExecution:
        title = t('error.title.walletMismatch')
        message = t('error.message.walletChangedDuringExecution')
        break
      case De1ErrorCode.TransactionUnderpriced:
        title = t('error.title.transactionUnderpriced')
        message = getDefaultErrorMessage()
        break
      case De1ErrorCode.TransactionUnprepared:
        title = t('error.title.transactionUnprepared')
        message = getDefaultErrorMessage()
        break
      case De1ErrorCode.TransactionCanceled:
        title = t('error.title.transactionCanceled')
        message = getDefaultErrorMessage('error.message.transactionCanceled')
        break
      case De1ErrorCode.TransactionRejected:
        title = t('error.title.transactionRejected')
        message = getDefaultErrorMessage('error.message.transactionRejected')
        break
      case De1ErrorCode.TransactionConflict:
        title = t('error.title.transactionConflict')
        message = getDefaultErrorMessage('error.message.transactionConflict')
        break
      case De1ErrorCode.ExchangeRateUpdateCanceled:
        title = t('error.title.exchangeRateUpdateCanceled')
        message = getDefaultErrorMessage()
        break
      case De1ErrorCode.SignatureRejected:
        title = t('error.title.signatureRejected')
        message = t('error.message.signatureRejected', {
          amount: formatTokenAmount(
            BigInt(step.action.fromAmount),
            step.action.fromToken.decimals
          ),
          tokenSymbol: step.action.fromToken.symbol,
          chainName: getChainById(step.action.fromChainId)?.name ?? '',
        })
        break
      default:
        title = t('error.title.unknown')
        if (process.txHash) {
          message = t('error.message.transactionFailed')
        } else {
          message = process.error.message || t('error.message.unknown')
        }
        break
    }
    title = title.replace(/OpenOcean/gi, 'De¹');
    message = message.replace(/OpenOcean/gi, 'De¹');
    return { title, message }
  }

  const isPegasusBridge =
    step.type === 'bridge' &&
    (step as { quoteData?: { quoteAdapterKey?: string } }).quoteData
      ?.quoteAdapterKey === 'pegasus'

  if (process.status === 'DONE' && isPegasusBridge) {
    return {
      title: t('main.process.bridge.done'),
      message: t('main.process.pegasus.estimatedArrival'),
    }
  }

  const title =
    processSubstatusMessages[process.status as StatusMessage]?.[
      process.substatus!
    ]?.(t) ??
    processStatusMessages[process.type]?.[process.status]?.(
      t,
      step,
      subvariant,
      subvariantOptions
    )
  return { title }
}
