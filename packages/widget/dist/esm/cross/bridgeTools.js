import { isItemAllowed } from '../utils/item.js';
import { CrossChainSwapFactory } from './factory.js';
export function getAdapterKey(adapter) {
    const name = typeof adapter === 'string' ? adapter : adapter.getName();
    return name.toLowerCase();
}
export function getCrossChainBridgeTools(bridgesConfig) {
    return CrossChainSwapFactory.getAllAdapters()
        .map((adapter) => ({
        key: getAdapterKey(adapter),
        name: adapter.getName(),
        logoURI: adapter.getIcon(),
        supportedChains: [],
    }))
        .filter((bridge) => isItemAllowed(bridge.key, bridgesConfig));
}
export function isBridgeAdapterEnabled(adapter, disabledBridges = [], bridgesConfig) {
    const key = getAdapterKey(adapter);
    if (!isItemAllowed(key, bridgesConfig)) {
        return false;
    }
    return !disabledBridges.includes(key);
}
//# sourceMappingURL=bridgeTools.js.map