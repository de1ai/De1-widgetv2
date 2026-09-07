import { ChainType, config, getChains } from '@de1/widget-sdk';
// import type { ChainKey, CoinKey } from '@de1/widget-types'
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js';
import { isItemAllowed } from '../utils/item.js';
import { DEFAULT_CHAIN_IDS } from '../config/defaultChainIds.js';
const supportedChainTypes = [ChainType.EVM, ChainType.SVM, ChainType.UTXO];
export const useAvailableChains = (chainTypes) => {
    const { chains } = useWidgetConfig();
    // const { providers } = useHasExternalWalletProvider();
    const { data, isLoading } = useQuery({
        queryKey: [
            'chains',
            // providers,
            chains?.types,
            chains?.allow,
            chains?.deny,
            chains?.from,
            chains?.to,
        ],
        queryFn: async ({ queryKey: [, chainTypesConfig] }) => {
            const chainTypesRequest = supportedChainTypes
                // providers.length > 0 ? providers : supportedChainTypes
                .filter((chainType) => isItemAllowed(chainType, chainTypesConfig));
            let availableChains = await getChains();
            // reset solana chain id
            const solanaChain = availableChains.find((chain) => chain.key === 'sol');
            if (solanaChain) {
                solanaChain.chainType = ChainType.SVM;
                solanaChain.id = 1151111081099710;
            }
            const nearChain = availableChains.find((chain) => chain.key === 'near');
            if (nearChain) {
                nearChain.chainType = ChainType.NVM;
                nearChain.id = 20000000000006;
            }
            availableChains.push({
                key: 'btc',
                chainType: 'UTXO',
                name: 'Bitcoin',
                coin: 'BTC',
                id: 20000000000001,
                mainnet: true,
                logoURI: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/bitcoin.svg',
                tokenlistUrl: '',
                multicallAddress: '',
                relayerSupported: false,
                metamask: {
                    "chainId": "20000000000001",
                    "blockExplorerUrls": [
                        "https://mempool.space/",
                        "https://blockchair.com/bitcoin/"
                    ],
                    "chainName": "Bitcoin",
                    "nativeCurrency": {
                        "name": "BTC",
                        "symbol": "BTC",
                        "decimals": 8
                    },
                    "rpcUrls": [
                        "https://node-router.thorswap.net/bitcoin",
                        "https://rpc.ankr.com/btc",
                        "https://bitcoin-rpc.publicnode.com"
                    ]
                },
                nativeToken: {
                    address: "bitcoin",
                    chainId: 20000000000001,
                    symbol: "BTC",
                    decimals: 8,
                    name: "Bitcoin",
                    logoURI: "https://assets.coingecko.com/coins/images/1/standard/bitcoin.png",
                    priceUSD: "88366"
                },
                permit2: '',
                permit2Proxy: '',
            });
            // allow chains "starknet","aptos","near","ont","sui",
            const allowedChainsIds = chains?.allow?.length ? chains.allow : DEFAULT_CHAIN_IDS;
            const allowedChains = availableChains.filter((chain) => {
                if (allowedChainsIds.indexOf(chain.id) >= 0) {
                    return true;
                }
                return false;
            });
            config.setChains(allowedChains);
            return allowedChains;
        },
        refetchInterval: 300000,
        staleTime: 300000,
    });
    const getChainById = useCallback((chainId, chains = data) => {
        if (!chainId) {
            return;
        }
        const chain = chains?.find((chain) => chain.id === chainId);
        return chain;
    }, [data]);
    return {
        chains: data,
        getChainById,
        isLoading,
    };
};
//# sourceMappingURL=useAvailableChains.js.map