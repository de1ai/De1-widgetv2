import type { Route } from '@de1/widget-sdk';
export declare const useStorePriceImpactAcknowledged: import("zustand").UseBoundStore<import("zustand").StoreApi<unknown>>;
interface QueuedMessage {
    id: string;
    priority: number;
    props?: Record<string, any>;
}
export declare const useMessageQueue: (route?: Route, allowInteraction?: boolean) => {
    messages: QueuedMessage[];
    hasMessages: boolean;
    isLoading: boolean;
};
export {};
