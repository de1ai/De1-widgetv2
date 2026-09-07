import { type RouteExecution } from '../../stores/routes/types.js';
interface StatusBottomSheetContentProps extends RouteExecution {
    onClose(): void;
}
export declare const StatusBottomSheet: React.FC<RouteExecution>;
export declare const StatusBottomSheetContent: React.FC<StatusBottomSheetContentProps>;
export {};
