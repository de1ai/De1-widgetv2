import { ChainType } from '@de1/widget-sdk';
import { useBytecode } from 'wagmi';
export const useIsContractAddress = (address, chainId, chainType) => {
    const { data: contractCode, isLoading, isFetched, } = useBytecode({
        address: address,
        chainId: chainId,
        query: {
            refetchInterval: 300000,
            staleTime: 300000,
            enabled: Boolean(chainType === ChainType.EVM && chainId),
        },
    });
    return {
        isContractAddress: !!contractCode,
        contractCode,
        isLoading,
        isFetched,
    };
};
//# sourceMappingURL=useIsContractAddress.js.map