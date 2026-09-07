import type { SettingsProps, SettingsState } from './types.js';
export declare const defaultSlippage = "1";
export declare const defaultConfigurableSettings: Pick<SettingsState, 'routePriority' | 'slippage' | 'gasPrice' | 'dynamicSlippage'>;
export declare const defaultSettings: SettingsProps;
export declare const useSettingsStore: import("zustand/traditional").UseBoundStoreWithEqualityFn<import("zustand").StoreApi<SettingsState>>;
