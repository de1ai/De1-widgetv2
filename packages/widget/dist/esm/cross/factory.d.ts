import { LifiAdapter, MayanAdapter, RelayAdapter, NearIntentsAdapter, SwapProvider, PegasusAdapter, RheaAdapter } from './adapters/index.js';
export declare class CrossChainSwapFactory {
    private static relayInstance;
    private static nearIntentsInstance;
    private static mayanInstance;
    private static lifiInstance;
    private static pegasusInstance;
    private static rheaInstance;
    static getRelayAdapter(): RelayAdapter;
    static getNearIntentsAdapter(): NearIntentsAdapter;
    static getMayanAdapter(): MayanAdapter;
    static getLifiInstance(): LifiAdapter;
    static getPegasusAdapter(): PegasusAdapter;
    static getRheaAdapter(): RheaAdapter;
    static getAllAdapters(): SwapProvider[];
    static getAdapterByName(name: string): SwapProvider | undefined;
}
