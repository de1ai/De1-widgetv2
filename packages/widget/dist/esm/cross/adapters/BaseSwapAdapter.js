import { ChainId } from '@de1/widget-sdk';
export var NonEvmChain;
(function (NonEvmChain) {
    NonEvmChain[NonEvmChain["Near"] = 20000000000006] = "Near";
    NonEvmChain[NonEvmChain["Bitcoin"] = 20000000000001] = "Bitcoin";
    NonEvmChain[NonEvmChain["Solana"] = 1151111081099710] = "Solana";
})(NonEvmChain || (NonEvmChain = {}));
export var NewEvmChain;
(function (NewEvmChain) {
    NewEvmChain[NewEvmChain["Plasma"] = 9745] = "Plasma";
    NewEvmChain[NewEvmChain["Monad"] = 143] = "Monad";
})(NewEvmChain || (NewEvmChain = {}));
export const BitcoinToken = {
    name: 'Bitcoin',
    symbol: 'BTC',
    decimals: 8,
    logo: 'https://storage.googleapis.com/ks-setting-1d682dca/285205e7-a16d-421c-a794-67439cd6b54f1751515894455.png',
};
export const NonEvmChainInfo = {
    [NonEvmChain.Near]: {
        name: 'NEAR',
        icon: 'https://storage.googleapis.com/ks-setting-1d682dca/000c677f-2ebc-44cc-8d76-e4c6d07627631744962669170.png',
    },
    [NonEvmChain.Bitcoin]: {
        name: 'Bitcoin',
        icon: 'https://storage.googleapis.com/ks-setting-1d682dca/285205e7-a16d-421c-a794-67439cd6b54f1751515894455.png',
    },
    [NonEvmChain.Solana]: {
        name: 'Solana',
        icon: 'https://solana.com/favicon.png',
    },
};
export const NewEvmChainInfo = {
    [NewEvmChain.Plasma]: {
        name: 'Plasma',
        icon: 'https://storage.googleapis.com/ks-setting-1d682dca/285205e7-a16d-421c-a794-67439cd6b54f1751515894455.png',
    },
    [NewEvmChain.Monad]: {
        name: 'Monad',
        icon: 'https://storage.googleapis.com/ks-setting-1d682dca/285205e7-a16d-421c-a794-67439cd6b54f1751515894455.png',
    },
};
export const NOT_SUPPORTED_CHAINS_PRICE_SERVICE = [
    ChainId.FTM,
    ChainId.SCL,
    ChainId.BLS,
    // ChainId.ZKSYNC,
    // ChainId.HYPEREVM,
    NonEvmChain.Solana,
    NonEvmChain.Bitcoin,
    NonEvmChain.Near,
    NewEvmChain.Plasma,
    NewEvmChain.Monad,
];
export class BaseSwapAdapter {
    handleError(error) {
        console.error(`[${this.getName()}] Error:`, error);
        throw new Error(`${this.getName()} provider error: ${error.message || 'Unknown error'}`);
    }
}
//# sourceMappingURL=BaseSwapAdapter.js.map