import { useQuery, useQueryClient } from '@tanstack/react-query';
import { De1Service } from '../services/De1Service.js';
export const useTokenSearch = (chainId, tokenQuery, enabled) => {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ['token-search', chainId, tokenQuery],
        queryFn: async ({ queryKey: [, chainId, tokenQuery], signal }) => {
            const token = await De1Service.getTokenInfo(chainId?.toString() || '', tokenQuery);
            if (token) {
                queryClient.setQueriesData({ queryKey: ['tokens'] }, (data) => {
                    if (data &&
                        !data.tokens[chainId]?.some((t) => t.address === token.address)) {
                        const clonedData = { ...data };
                        clonedData.tokens[chainId]?.push(token);
                        return clonedData;
                    }
                });
            }
            return token;
        },
        enabled: Boolean(chainId && tokenQuery && enabled),
        retry: false,
    });
    return {
        token: data,
        isLoading,
    };
};
//# sourceMappingURL=useTokenSearch.js.map