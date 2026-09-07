import { ChainId } from '@de1/widget-sdk';
export declare const CROSS_CHAIN_FEE_RECEIVER = "0x922164BBBd36Acf9E854AcBbF32faCC949fCAEef";
export declare const CROSS_CHAIN_FEE_RECEIVER_SOLANA = "yEVG5DpokLuVRAqoWeKJANBY2wynzgTSXUbGz7aDKBq";
export declare const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export declare const BTC_DEFAULT_RECEIVER = "";
export declare const SOLANA_NATIVE = "11111111111111111111111111111111";
export declare const ETHER_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
export declare const TOKEN_API_URL = "https://token-api.kyberengineering.io/api";
export declare const NativeCurrencies: {
    1: {
        name: string;
        symbol: string;
        decimals: number;
        address: string;
        wrapped: {
            name: string;
            symbol: string;
            decimals: number;
            address: string;
        };
    };
    56: {
        name: string;
        symbol: string;
        decimals: number;
        address: string;
        wrapped: {
            name: string;
            symbol: string;
            decimals: number;
            address: string;
        };
    };
    43114: {
        name: string;
        symbol: string;
        decimals: number;
        address: string;
        wrapped: {
            name: string;
            symbol: string;
            decimals: number;
            address: string;
        };
    };
    137: {
        name: string;
        symbol: string;
        decimals: number;
        address: string;
        wrapped: {
            name: string;
            symbol: string;
            decimals: number;
            address: string;
        };
    };
    42161: {
        name: string;
        symbol: string;
        decimals: number;
        address: string;
        wrapped: {
            name: string;
            symbol: string;
            decimals: number;
            address: string;
        };
    };
    10: {
        name: string;
        symbol: string;
        decimals: number;
        address: string;
        wrapped: {
            name: string;
            symbol: string;
            decimals: number;
            address: string;
        };
    };
    250: {
        name: string;
        symbol: string;
        decimals: number;
        address: string;
        wrapped: {
            name: string;
            symbol: string;
            decimals: number;
            address: string;
        };
    };
    8453: {
        name: string;
        symbol: string;
        decimals: number;
        address: string;
        wrapped: {
            name: string;
            symbol: string;
            decimals: number;
            address: string;
        };
    };
    534352: {
        name: string;
        symbol: string;
        decimals: number;
        address: string;
        wrapped: {
            name: string;
            symbol: string;
            decimals: number;
            address: string;
        };
    };
    81457: {
        name: string;
        symbol: string;
        decimals: number;
        address: string;
        wrapped: {
            name: string;
            symbol: string;
            decimals: number;
            address: string;
        };
    };
    5000: {
        name: string;
        symbol: string;
        decimals: number;
        address: string;
        wrapped: {
            name: string;
            symbol: string;
            decimals: number;
            address: string;
        };
    };
    146: {
        name: string;
        symbol: string;
        decimals: number;
        address: string;
        wrapped: {
            name: string;
            symbol: string;
            decimals: number;
            address: string;
        };
    };
    130: {
        name: string;
        symbol: string;
        decimals: number;
        address: string;
        wrapped: {
            name: string;
            symbol: string;
            decimals: number;
            address: string;
        };
    };
    14: {
        name: string;
        symbol: string;
        decimals: number;
        address: string;
        wrapped: {
            name: string;
            symbol: string;
            decimals: number;
            address: string;
        };
    };
    4663: {
        name: string;
        symbol: string;
        decimals: number;
        address: string;
        wrapped: {
            name: string;
            symbol: string;
            decimals: number;
            address: string;
        };
    };
};
export declare const MAINNET_NETWORKS: readonly [ChainId.ETH, ChainId.BSC, ChainId.AVA, ChainId.BAS, ChainId.POL, ChainId.ARB, ChainId.OPT, ChainId.FTM, ChainId.MAM, ChainId.HYE, ChainId.MNT, ChainId.SON, ChainId.UNI, ChainId.BLS, ChainId.SCL, ChainId.CEL, ChainId.MONAD, ChainId.FLR, ChainId.CRO, ChainId.RSK, ChainId.MOD, ChainId.ONE, ChainId.MAM, ChainId.KAVA, ChainId.TLO, ChainId.TAC, ChainId.ROBINHOOD];
export interface Currency {
    id: string;
    name: string;
    symbol: string;
    address: string;
    icon: string;
    logo: string;
    decimals: number;
    isNative: boolean;
    wrapped: {
        name: string;
        symbol: string;
        decimals: number;
        address: string;
    };
}
export interface NearToken {
    address: string;
    assetId: string;
    decimals: number;
    blockchain: string;
    symbol: string;
    price: number;
    priceUpdatedAt: number;
    contractAddress: string;
    logo: string;
}
export interface SolanaToken {
    address: string;
    id: string;
    name: string;
    symbol: string;
    icon: string;
    logo: string;
    decimals: number;
    tokenProgram: string;
}
