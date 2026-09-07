import { ChainType } from '@de1/widget-sdk';
interface ExternalWalletProvider {
    useExternalWalletProvidersOnly: boolean;
    externalChainTypes: ChainType[];
    internalChainTypes: ChainType[];
}
export declare function useExternalWalletProvider(): ExternalWalletProvider;
export {};
