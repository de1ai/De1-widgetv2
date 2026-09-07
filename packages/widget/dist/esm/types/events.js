export var WidgetEvent;
(function (WidgetEvent) {
    WidgetEvent["RouteExecutionStarted"] = "routeExecutionStarted";
    WidgetEvent["RouteExecutionUpdated"] = "routeExecutionUpdated";
    WidgetEvent["RouteExecutionCompleted"] = "routeExecutionCompleted";
    WidgetEvent["RouteExecutionFailed"] = "routeExecutionFailed";
    WidgetEvent["RouteHighValueLoss"] = "routeHighValueLoss";
    WidgetEvent["RouteSelected"] = "routeSelected";
    WidgetEvent["AvailableRoutes"] = "availableRoutes";
    WidgetEvent["ContactSupport"] = "contactSupport";
    WidgetEvent["SourceChainTokenSelected"] = "sourceChainTokenSelected";
    WidgetEvent["DestinationChainTokenSelected"] = "destinationChainTokenSelected";
    WidgetEvent["SendToWalletToggled"] = "sendToWalletToggled";
    /**
     * @deprecated Use `PageEntered` event instead.
     */
    WidgetEvent["ReviewTransactionPageEntered"] = "reviewTransactionPageEntered";
    /**
     * @deprecated use useWalletManagementEvents hook.
     */
    WidgetEvent["WalletConnected"] = "walletConnected";
    WidgetEvent["WidgetExpanded"] = "widgetExpanded";
    WidgetEvent["PageEntered"] = "pageEntered";
    WidgetEvent["FormFieldChanged"] = "formFieldChanged";
    WidgetEvent["SettingUpdated"] = "settingUpdated";
    WidgetEvent["TokenSearch"] = "tokenSearch";
    WidgetEvent["LowAddressActivityConfirmed"] = "lowAddressActivityConfirmed";
})(WidgetEvent || (WidgetEvent = {}));
//# sourceMappingURL=events.js.map