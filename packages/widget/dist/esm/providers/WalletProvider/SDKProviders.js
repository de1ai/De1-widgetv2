import { getConnectorClient as getBigmiConnectorClient } from '@bigmi/client';
import { BigmiContext } from '@bigmi/react';
import { ChainType, Near, EVM, Solana, UTXO, config, } from '@de1/widget-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import { useContext, useEffect } from 'react';
import { WagmiContext } from 'wagmi';
import { getConnectorClient as getWagmiConnectorClient, switchChain, } from 'wagmi/actions';
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js';
import { WidgetInternalWagmiConfigContext } from './WidgetInternalWagmiConfigContext.js';
export const SDKProviders = () => {
    const { walletConfig, sdkConfig } = useWidgetConfig();
    const { wallet } = useWallet();
    const wagmiContextConfig = useContext(WagmiContext);
    const internalWagmiConfig = useContext(WidgetInternalWagmiConfigContext);
    const nearProvider = Near();
    const bigmiConfig = useContext(BigmiContext);
    // Account source: host-provided prop has highest priority, then the host's
    // <WagmiProvider> in context, then undefined (widget-internal only).
    const accountSourceConfig = walletConfig?.externalWagmiConfig ?? wagmiContextConfig;
    // Chain consumer: prefer the widget's internal shadow config so that
    // switchChain / getPublicClient hit the De¹ 40+ chain list. Fall back to
    // the host config (for legacy <WagmiProvider> consumers) when no shadow
    // config has been mounted.
    const chainConsumerConfig = internalWagmiConfig ?? wagmiContextConfig;
    useEffect(() => {
        // Configure SDK Providers
        const providers = [];
        const hasConfiguredEVMProvider = sdkConfig?.providers?.find((provider) => provider.type === ChainType.EVM);
        const hasConfiguredSVMProvider = sdkConfig?.providers?.some((provider) => provider.type === ChainType.SVM);
        const hasConfiguredUTXOProvider = sdkConfig?.providers?.some((provider) => provider.type === ChainType.UTXO);
        if (!hasConfiguredEVMProvider && accountSourceConfig) {
            providers.push(EVM({
                getWalletClient: () => getWagmiConnectorClient(accountSourceConfig),
                switchChain: async (chainId) => {
                    // Chain switches should run against the widget's internal shadow
                    // config when available, so the host's restricted chain list is
                    // never involved in switch-time chain lookups. If the shadow
                    // config is missing (e.g. legacy host <WagmiProvider> only),
                    // fall back to the host config.
                    const targetConfig = chainConsumerConfig ?? accountSourceConfig;
                    const chain = await switchChain(targetConfig, { chainId });
                    return getWagmiConnectorClient(targetConfig, {
                        chainId: chain.id,
                    });
                },
            }));
        }
        if (!hasConfiguredSVMProvider) {
            providers.push(Solana({
                async getWalletAdapter() {
                    return wallet?.adapter;
                },
            }));
        }
        if (!hasConfiguredUTXOProvider && bigmiConfig) {
            providers.push(UTXO({
                getWalletClient: () => getBigmiConnectorClient(bigmiConfig),
            }));
        }
        // Always register a Near (NVM) provider so balances can be queried for NEAR.
        providers.push(nearProvider);
        if (sdkConfig?.providers?.length) {
            providers.push(...sdkConfig.providers);
        }
        config.setProviders(providers);
    }, [
        accountSourceConfig,
        chainConsumerConfig,
        bigmiConfig,
        sdkConfig?.providers,
        wallet?.adapter,
    ]);
    return null;
};
//# sourceMappingURL=SDKProviders.js.map