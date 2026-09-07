import type { TFunction } from 'i18next';
import type { ReactElement } from 'react';
import type { FeesBreakdown } from '../utils/fees.js';
export interface FeeBreakdownTooltipProps {
    gasCosts?: FeesBreakdown[];
    feeCosts?: FeesBreakdown[];
    relayerSupport?: boolean;
    children: ReactElement<any, any>;
}
export declare const FeeBreakdownTooltip: React.FC<FeeBreakdownTooltipProps>;
export declare const getFeeBreakdownTypography: (fees: FeesBreakdown[], t: TFunction) => import("react/jsx-runtime").JSX.Element[];
