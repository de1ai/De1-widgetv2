import type { De1StepExtended, TokenAmount } from '@de1/widget-sdk';
export declare const Step: React.FC<{
    step: De1StepExtended;
    fromToken?: TokenAmount;
    toToken?: TokenAmount;
    impactToken?: TokenAmount;
    toAddress?: string;
}>;
