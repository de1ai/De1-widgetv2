import type { StepExtended } from '@de1/widget-sdk';
import type { IncludedStepsProps, StepActionsProps, StepDetailsLabelProps } from './types.js';
export declare const StepActions: React.FC<StepActionsProps>;
export declare const IncludedSteps: React.FC<IncludedStepsProps>;
export declare const StepDetailsContent: React.FC<{
    step: StepExtended;
}>;
export declare const CustomStepDetailsLabel: React.FC<StepDetailsLabelProps>;
export declare const BridgeStepDetailsLabel: React.FC<Omit<StepDetailsLabelProps, 'variant'>>;
export declare const SwapStepDetailsLabel: React.FC<Omit<StepDetailsLabelProps, 'variant'>>;
export declare const ProtocolStepDetailsLabel: React.FC<Omit<StepDetailsLabelProps, 'variant'>>;
