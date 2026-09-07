import { createContext } from 'react';
/**
 * Widget-owned internal wagmi config. It is created by
 * `useWidgetInternalWagmiConfig` whenever the widget needs to execute
 * against the De¹ 40+ EVM chain list without touching the host's
 * global wagmi config.
 *
 * Modules that previously read `WagmiContext` (e.g. `SDKProviders`,
 * cross-chain adapters) should prefer this context when present so
 * that chain lookups and `switchChain` calls hit the widget's
 * own chain list rather than the host's restricted one.
 */
export const WidgetInternalWagmiConfigContext = createContext(undefined);
//# sourceMappingURL=WidgetInternalWagmiConfigContext.js.map