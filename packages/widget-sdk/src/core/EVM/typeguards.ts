import type { De1Step } from '@de1/widget-types'
import type { De1StepExtended } from '../types.js'

type RelayerStep = (De1StepExtended | De1Step) & {
  typedData: NonNullable<(De1StepExtended | De1Step)['typedData']>
}

export function isRelayerStep(
  step: De1StepExtended | De1Step
): step is RelayerStep {
  return !!step.typedData && step.typedData.length > 0
}

export function isGaslessStep(
  step: De1StepExtended | De1Step
): step is RelayerStep {
  return !!step.typedData?.find(
    (p) => p.primaryType === 'PermitWitnessTransferFrom'
  )
}
