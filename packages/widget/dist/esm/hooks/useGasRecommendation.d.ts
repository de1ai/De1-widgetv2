import { ChainId } from '@de1/widget-sdk';
export declare const useGasRecommendation: (toChainId?: ChainId, fromChain?: ChainId, fromToken?: string) => import("@tanstack/react-query").UseQueryResult<import("@de1/widget-sdk").GasRecommendationResponse, Error>;
