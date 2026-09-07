import { ChainType, isBatchingSupported } from '@de1/widget-sdk';
import { useQuery } from '@tanstack/react-query';
export function useIsBatchingSupported(chain, address) {
    const enabled = chain && chain.chainType === ChainType.EVM && !!address;
    const { data, isLoading } = useQuery({
        queryKey: ['isBatchingSupported', chain?.id, address],
        queryFn: () => {
            return isBatchingSupported({ chainId: chain.id });
        },
        enabled,
        staleTime: 3600000,
        retry: false,
    });
    return {
        isBatchingSupported: data,
        isBatchingSupportedLoading: enabled && isLoading,
    };
}
//# sourceMappingURL=useIsBatchingSupported.js.map