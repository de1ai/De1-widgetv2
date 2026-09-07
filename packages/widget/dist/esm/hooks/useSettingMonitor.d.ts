export declare const useSettingMonitor: () => {
    isBridgesChanged: boolean;
    isNoBridgesEnabled: boolean;
    isExchangesChanged: boolean;
    isSlippageChanged: boolean;
    isSlippageNotRecommended: boolean;
    isSlippageOutsideRecommendedLimits: boolean;
    isSlippageUnderRecommendedLimits: boolean;
    isRoutePriorityChanged: boolean;
    isGasPriceChanged: boolean;
    isCustomRouteSettings: boolean;
    isRouteSettingsWithWarnings: boolean;
    reset: () => void;
};
