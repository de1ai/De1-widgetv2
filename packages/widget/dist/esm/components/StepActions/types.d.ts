import type { BoxProps } from '@mui/material';
import type { De1Step, Step } from '@de1/widget-sdk';
import type { SubvariantOptions, WidgetFeeConfig, WidgetSubvariant } from '../../types/widget.js';
export interface StepActionsProps extends BoxProps {
    step: De1Step;
    dense?: boolean;
}
export interface StepDetailsLabelProps {
    step: Step;
    subvariant?: Extract<WidgetSubvariant, 'custom'>;
    subvariantOptions?: SubvariantOptions;
    feeConfig?: WidgetFeeConfig;
    relayerSupport?: boolean;
}
export interface IncludedStepsProps {
    step: De1Step;
}
