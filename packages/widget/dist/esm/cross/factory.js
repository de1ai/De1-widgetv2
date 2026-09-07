import { LifiAdapter, MayanAdapter, RelayAdapter, NearIntentsAdapter, PegasusAdapter, RheaAdapter,
// SymbiosisAdapter,
// XYFinanceAdapter,
 } from './adapters/index.js';
// Factory for creating swap provider instances
export class CrossChainSwapFactory {
    // private static optimexInstance: OptimexAdapter
    // private static orbiterInstance: OrbiterAdapter
    // // Get or create Across adapter
    // static getAcrossAdapter(): AcrossAdapter {
    //   if (!CrossChainSwapFactory.acrossInstance) {
    //     CrossChainSwapFactory.acrossInstance = new AcrossAdapter()
    //   }
    //   return CrossChainSwapFactory.acrossInstance
    // }
    // // Get or create Relay adapter
    static getRelayAdapter() {
        if (!CrossChainSwapFactory.relayInstance) {
            CrossChainSwapFactory.relayInstance = new RelayAdapter();
        }
        return CrossChainSwapFactory.relayInstance;
    }
    // static getXyFinanceAdapter(): XYFinanceAdapter {
    //   if (!CrossChainSwapFactory.xyFinanceInstance) {
    //     CrossChainSwapFactory.xyFinanceInstance = new XYFinanceAdapter()
    //   }
    //   return CrossChainSwapFactory.xyFinanceInstance
    // }
    static getNearIntentsAdapter() {
        if (!CrossChainSwapFactory.nearIntentsInstance) {
            CrossChainSwapFactory.nearIntentsInstance = new NearIntentsAdapter();
        }
        return CrossChainSwapFactory.nearIntentsInstance;
    }
    static getMayanAdapter() {
        if (!CrossChainSwapFactory.mayanInstance) {
            CrossChainSwapFactory.mayanInstance = new MayanAdapter();
        }
        return CrossChainSwapFactory.mayanInstance;
    }
    // static getSymbiosisAdapter(): SymbiosisAdapter {
    //   if (!CrossChainSwapFactory.symbiosisInstance) {
    //     CrossChainSwapFactory.symbiosisInstance = new SymbiosisAdapter()
    //   }
    //   return CrossChainSwapFactory.symbiosisInstance
    // }
    // static getDebridgeInstance(): DeBridgeAdapter {
    //   if (!CrossChainSwapFactory.debridgeInstance) {
    //     CrossChainSwapFactory.debridgeInstance = new DeBridgeAdapter()
    //   }
    //   return CrossChainSwapFactory.debridgeInstance
    // }
    static getLifiInstance() {
        if (!CrossChainSwapFactory.lifiInstance) {
            CrossChainSwapFactory.lifiInstance = new LifiAdapter();
        }
        return CrossChainSwapFactory.lifiInstance;
    }
    static getPegasusAdapter() {
        if (!CrossChainSwapFactory.pegasusInstance) {
            CrossChainSwapFactory.pegasusInstance = new PegasusAdapter();
        }
        return CrossChainSwapFactory.pegasusInstance;
    }
    static getRheaAdapter() {
        if (!CrossChainSwapFactory.rheaInstance) {
            CrossChainSwapFactory.rheaInstance = new RheaAdapter();
        }
        return CrossChainSwapFactory.rheaInstance;
    }
    // static getOptimexAdapter(): OptimexAdapter {
    //   if (!CrossChainSwapFactory.optimexInstance) {
    //     CrossChainSwapFactory.optimexInstance = new OptimexAdapter()
    //   }
    //   return CrossChainSwapFactory.optimexInstance
    // }
    // static getOrbiterAdapter(): OrbiterAdapter {
    //   if (!CrossChainSwapFactory.orbiterInstance) {
    //     CrossChainSwapFactory.orbiterInstance = new OrbiterAdapter()
    //   }
    //   return CrossChainSwapFactory.orbiterInstance
    // }
    // Get all registered adapters
    static getAllAdapters() {
        return [
            CrossChainSwapFactory.getMayanAdapter(),
            CrossChainSwapFactory.getRelayAdapter(),
            CrossChainSwapFactory.getNearIntentsAdapter(),
            CrossChainSwapFactory.getLifiInstance(),
            CrossChainSwapFactory.getRheaAdapter(),
            CrossChainSwapFactory.getPegasusAdapter(),
            // CrossChainSwapFactory.getAcrossAdapter(),
            // CrossChainSwapFactory.getXyFinanceAdapter(),
            // CrossChainSwapFactory.getSymbiosisAdapter(),
            // CrossChainSwapFactory.getDebridgeInstance(),
            // CrossChainSwapFactory.getOptimexAdapter(),
            // CrossChainSwapFactory.getOrbiterAdapter(),
        ];
    }
    // Get adapter by name
    static getAdapterByName(name) {
        switch (name.toLowerCase()) {
            // case 'across':
            //   return CrossChainSwapFactory.getAcrossAdapter()
            case 'relay':
                return CrossChainSwapFactory.getRelayAdapter();
            // case 'xyfinance':
            //   return CrossChainSwapFactory.getXyFinanceAdapter()
            case 'near intents':
                return CrossChainSwapFactory.getNearIntentsAdapter();
            case 'mayan':
                return CrossChainSwapFactory.getMayanAdapter();
            // case 'symbiosis':
            //   return CrossChainSwapFactory.getSymbiosisAdapter()
            // case 'debridge':
            //   return CrossChainSwapFactory.getDebridgeInstance()
            case 'lifi':
                return CrossChainSwapFactory.getLifiInstance();
            case 'rhea':
                return CrossChainSwapFactory.getRheaAdapter();
            case 'pegasus':
                return CrossChainSwapFactory.getPegasusAdapter();
            // case 'optimex':
            //   return CrossChainSwapFactory.getOptimexAdapter()
            // case 'orbiter':
            //   return CrossChainSwapFactory.getOrbiterAdapter()
            default:
                return undefined;
        }
    }
}
//# sourceMappingURL=factory.js.map