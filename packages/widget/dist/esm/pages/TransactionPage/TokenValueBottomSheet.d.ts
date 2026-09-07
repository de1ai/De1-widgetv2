import type { Route } from '@de1/widget-sdk';
import type { BottomSheetBase } from '../../components/BottomSheet/types.js';
interface TokenValueBottomSheetProps {
    route: Route;
    onContinue(): void;
    onCancel?(): void;
}
export declare const TokenValueBottomSheet: import("react").ForwardRefExoticComponent<TokenValueBottomSheetProps & import("react").RefAttributes<BottomSheetBase>>;
export {};
