import { describe, expect, it } from 'vitest'
import { SDKError } from '../SDKError.js'
import { BaseError } from '../baseError.js'
import { ErrorName, De1ErrorCode } from '../constants.js'
import { getRootCause } from './rootCause.js'

const getErrorChain = () => {
  const NonDe1ErrorChain = new Error('non De¹ Exchange error')
  NonDe1ErrorChain.cause = new Error('root cause')
  return new SDKError(
    new BaseError(
      ErrorName.ValidationError,
      De1ErrorCode.ValidationError,
      'something happened',
      NonDe1ErrorChain
    )
  )
}

describe('getRootCause', () => {
  it('should return the top level error when there is no root cause', () => {
    const error = new Error('top level')

    expect(getRootCause(error)!.message).toEqual('top level')
  })

  it('should return the root cause', () => {
    const errorChain = getErrorChain()

    expect(getRootCause(errorChain)!.message).toEqual('root cause')
  })

  it('should return undefined when passed undefined', () => {
    expect(getRootCause(undefined)).toBeUndefined()
  })
})
