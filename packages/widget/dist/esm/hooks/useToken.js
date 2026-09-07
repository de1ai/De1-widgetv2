import { useMemo } from 'react';
import { useTokenSearch } from './useTokenSearch.js';
import { useTokens } from './useTokens.js';
import { useTokenPrice } from './useTokenPrice.js';
export const useToken = (chainId, tokenAddress) => {
    const { tokens, isLoading } = useTokens(chainId);
    const token = useMemo(() => {
        const token = tokens?.find((token) => token.address === tokenAddress && token.chainId === chainId);
        return token;
    }, [chainId, tokenAddress, tokens]);
    const tokenSearchEnabled = !isLoading && !token;
    const { token: searchedToken, isLoading: isSearchedTokenLoading } = useTokenSearch(chainId, tokenAddress, tokenSearchEnabled);
    // Get token price
    const { price: latestPrice, isLoading: isPriceLoading } = useTokenPrice(chainId, token || searchedToken);
    // Keep priceUSD as a string so it stays compatible with the Token type
    const updatedToken = useMemo(() => {
        if (!latestPrice || (!token && !searchedToken)) {
            return token || searchedToken;
        }
        return {
            ...(token || searchedToken),
            priceUSD: String(latestPrice),
        };
    }, [token, searchedToken, latestPrice]);
    return {
        token: updatedToken,
        isLoading: isLoading || (tokenSearchEnabled && isSearchedTokenLoading) || isPriceLoading,
    };
};
//# sourceMappingURL=useToken.js.map