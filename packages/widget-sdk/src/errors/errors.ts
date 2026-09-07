import { BaseError } from './baseError.js'
import { ErrorName, De1ErrorCode } from './constants.js'

export class RPCError extends BaseError {
  constructor(code: De1ErrorCode, message: string, cause?: Error) {
    super(ErrorName.RPCError, code, message, cause)
  }
}

export class ProviderError extends BaseError {
  constructor(code: De1ErrorCode, message: string, cause?: Error) {
    super(ErrorName.ProviderError, code, message, cause)
  }
}

export class TransactionError extends BaseError {
  constructor(code: De1ErrorCode, message: string, cause?: Error) {
    super(ErrorName.TransactionError, code, message, cause)
  }
}

export class UnknownError extends BaseError {
  constructor(message: string, cause?: Error) {
    super(
      ErrorName.UnknownError,
      De1ErrorCode.InternalError,
      message,
      cause
    )
  }
}

export class BalanceError extends BaseError {
  constructor(message: string, cause?: Error) {
    super(
      ErrorName.BalanceError,
      De1ErrorCode.BalanceError,
      message,
      cause
    )
  }
}

export class ServerError extends BaseError {
  constructor(message: string) {
    super(ErrorName.ServerError, De1ErrorCode.InternalError, message)
  }
}

export class ValidationError extends BaseError {
  constructor(message: string) {
    super(
      ErrorName.ValidationError,
      De1ErrorCode.ValidationError,
      message
    )
  }
}
