import { ChainId, ChainType } from '@de1/widget-sdk';
export declare const getChainTypeFromAddress: (address: string) => ChainType | undefined;
export declare const defaultChainIdsByType: {
    EVM: ChainId;
    SVM: ChainId;
    UTXO: ChainId;
    MVM: ChainId;
    NVM: ChainId;
};
