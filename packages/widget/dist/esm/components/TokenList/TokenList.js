import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box } from '@mui/material';
import { useAccount, useLastConnectedAccount, } from '@de1/wallet-management';
import { useEffect } from 'react';
import { useChain } from '../../hooks/useChain.js';
import { useDebouncedWatch } from '../../hooks/useDebouncedWatch.js';
import { useTokenBalances } from '../../hooks/useTokenBalances.js';
import { useTokenSearch } from '../../hooks/useTokenSearch.js';
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js';
import { FormKeyHelper } from '../../stores/form/types.js';
import { useFieldValues } from '../../stores/form/useFieldValues.js';
import { WidgetEvent } from '../../types/events.js';
import { TokenNotFound } from './TokenNotFound.js';
import { VirtualizedTokenList } from './VirtualizedTokenList.js';
import { useTokenSelect } from './useTokenSelect.js';
import { filterTokensBySource, filteredTokensComparator } from './utils.js';
export const TokenList = ({ formType, parentRef, height, tokenSourceFilter, onClick, }) => {
    const emitter = useWidgetEvents();
    const [selectedChainId] = useFieldValues(FormKeyHelper.getChainKey(formType));
    const [tokenSearchFilter] = useDebouncedWatch(320, 'tokenSearchFilter');
    const { chain: selectedChain, isLoading: isSelectedChainLoading } = useChain(selectedChainId);
    const { account, accounts } = useAccount({
        chainType: selectedChain?.chainType,
    });
    const { setLastConnectedAccount } = useLastConnectedAccount();
    const { tokens: chainTokens, tokensWithBalance, isLoading: isTokensLoading, isBalanceLoading, featuredTokens, popularTokens, } = useTokenBalances(selectedChainId);
    const allTokens = (tokensWithBalance ?? chainTokens ?? []);
    let filteredTokens = filterTokensBySource(allTokens, tokenSourceFilter);
    const normalizedSearchFilter = tokenSearchFilter?.replaceAll('$', '');
    const searchFilter = normalizedSearchFilter?.toUpperCase() ?? '';
    filteredTokens = tokenSearchFilter
        ? filteredTokens
            .filter((token) => token.name?.toUpperCase().includes(searchFilter) ||
            token.symbol.toUpperCase().includes(searchFilter) ||
            token.address.toUpperCase().includes(searchFilter))
            .sort(filteredTokensComparator(searchFilter))
        : filteredTokens;
    const tokenSearchEnabled = !isTokensLoading &&
        !filteredTokens.length &&
        !!tokenSearchFilter &&
        !!selectedChainId;
    const { token: searchedToken, isLoading: isSearchedTokenLoading } = useTokenSearch(selectedChainId, normalizedSearchFilter, tokenSearchEnabled);
    const isLoading = isTokensLoading ||
        isSelectedChainLoading ||
        (tokenSearchEnabled && isSearchedTokenLoading);
    const searchedTokenMatchesFilter = !!searchedToken &&
        filterTokensBySource([
            {
                ...searchedToken,
                tokenSource: searchedToken.tokenSource ??
                    allTokens.find((token) => token.address === searchedToken.address)
                        ?.tokenSource,
            },
        ], tokenSourceFilter).length > 0;
    const tokens = filteredTokens.length
        ? filteredTokens
        : searchedTokenMatchesFilter
            ? [searchedToken]
            : filteredTokens;
    const handleTokenClick = useTokenSelect(formType, onClick);
    const showCategories = Boolean(featuredTokens?.length || popularTokens?.length) &&
        !tokenSearchFilter;
    // biome-ignore lint/correctness/useExhaustiveDependencies: Should fire only when search filter changes
    useEffect(() => {
        if (normalizedSearchFilter) {
            emitter.emit(WidgetEvent.TokenSearch, {
                value: normalizedSearchFilter,
                tokens,
            });
        }
    }, [normalizedSearchFilter, emitter]);
    // Add effect for automatic wallet connector switching
    useEffect(() => {
        if (selectedChain?.chainType && accounts.length > 0) {
            // Find account matching current chain type
            const matchingAccount = accounts.find((acc) => acc.chainType === selectedChain.chainType && acc.isConnected);
            // If matching account found, set it as last connected account
            if (matchingAccount?.connector) {
                setLastConnectedAccount(matchingAccount.connector);
            }
        }
    }, [selectedChain?.chainType, accounts, setLastConnectedAccount]);
    return (_jsxs(Box, { ref: parentRef, style: { height, overflow: 'auto' }, children: [!tokens.length && !isLoading ? (_jsx(TokenNotFound, { formType: formType })) : null, _jsx(VirtualizedTokenList, { account: account, tokens: tokens, scrollElementRef: parentRef, chainId: selectedChainId, chain: selectedChain, isLoading: isLoading, isBalanceLoading: isBalanceLoading, showCategories: showCategories, onClick: handleTokenClick })] }));
};
//# sourceMappingURL=TokenList.js.map