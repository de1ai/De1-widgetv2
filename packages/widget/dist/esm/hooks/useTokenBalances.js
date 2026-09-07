import { useAccount } from '@de1/wallet-management';
import { getTokenBalances } from '@de1/widget-sdk';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { formatUnits } from 'viem';
import { useTokens } from './useTokens.js';
const defaultRefetchInterval = 32000;
const rwaRefetchInterval = 120000;
const tokenSetKey = (tokens) => {
    if (!tokens?.length)
        return '';
    const sorted = tokens
        .map((t) => `${t.chainId}:${t.address}`.toLowerCase())
        .sort();
    let h = 0;
    for (const s of sorted) {
        for (let i = 0; i < s.length; i++) {
            h = (h * 31 + s.charCodeAt(i)) | 0;
        }
    }
    return `${sorted.length}:${h.toString(36)}`;
};
const splitBySource = (tokens) => {
    const base = [];
    const rwa = [];
    if (!tokens)
        return { base, rwa };
    for (const t of tokens) {
        if (t.tokenSource === 'rwa')
            rwa.push(t);
        else
            base.push(t);
    }
    return { base, rwa };
};
const sortAndCategorize = (tokensWithBalance, fallback) => {
    if (!tokensWithBalance?.length) {
        return fallback;
    }
    const sortFn = (a, b) => Number.parseFloat(formatUnits(b.amount ?? 0n, b.decimals)) *
        Number.parseFloat(b.priceUSD ?? '0') -
        Number.parseFloat(formatUnits(a.amount ?? 0n, a.decimals)) *
            Number.parseFloat(a.priceUSD ?? '0');
    const featuredTokens = [];
    const tokensWithAmount = [];
    const popularTokens = [];
    const allTokens = [];
    tokensWithBalance.forEach((token) => {
        if (token.amount) {
            token.featured = false;
            token.popular = false;
        }
        if (token.featured) {
            featuredTokens.push(token);
        }
        else if (token.amount) {
            tokensWithAmount.push(token);
        }
        else if (token.popular) {
            popularTokens.push(token);
        }
        else {
            allTokens.push(token);
        }
    });
    tokensWithAmount.sort(sortFn);
    return [
        ...featuredTokens,
        ...tokensWithAmount,
        ...popularTokens,
        ...allTokens,
    ];
};
export const useTokenBalances = (selectedChainId) => {
    const { tokens, featuredTokens, popularTokens, chain, isLoading } = useTokens(selectedChainId);
    const { account } = useAccount({ chainType: chain?.chainType });
    const isBalanceLoadingEnabled = Boolean(account.address) &&
        Boolean(tokens?.length) &&
        Boolean(selectedChainId);
    const { base: baseTokens, rwa: rwaTokens } = useMemo(() => splitBySource(tokens), [tokens]);
    const baseTokenSetHash = useMemo(() => tokenSetKey(baseTokens), [baseTokens]);
    const rwaTokenSetHash = useMemo(() => tokenSetKey(rwaTokens), [rwaTokens]);
    const { data: baseWithBalance, isLoading: isBaseLoading, refetch: refetchBase, } = useQuery({
        queryKey: [
            'token-balances',
            'base',
            account.address,
            selectedChainId,
            baseTokenSetHash,
        ],
        queryFn: async ({ queryKey: [, , accountAddress] }) => {
            if (!baseTokens.length)
                return [];
            return getTokenBalances(accountAddress, baseTokens);
        },
        enabled: isBalanceLoadingEnabled && baseTokens.length > 0,
        refetchInterval: defaultRefetchInterval,
        staleTime: defaultRefetchInterval,
    });
    const { data: rwaWithBalance, isLoading: isRwaLoading, refetch: refetchRwa, } = useQuery({
        queryKey: [
            'token-balances',
            'rwa',
            account.address,
            selectedChainId,
            rwaTokenSetHash,
        ],
        queryFn: async ({ queryKey: [, , accountAddress] }) => {
            if (!rwaTokens.length)
                return [];
            return getTokenBalances(accountAddress, rwaTokens);
        },
        enabled: isBalanceLoadingEnabled && rwaTokens.length > 0,
        refetchInterval: rwaRefetchInterval,
        staleTime: rwaRefetchInterval,
    });
    const tokensWithBalance = useMemo(() => {
        const baseSorted = sortAndCategorize(baseWithBalance, baseTokens);
        if (!rwaWithBalance?.length) {
            return baseSorted;
        }
        const baseAddressSet = new Set(baseSorted.map((t) => `${t.chainId}:${t.address}`.toLowerCase()));
        const rwaExtra = rwaWithBalance.filter((t) => !baseAddressSet.has(`${t.chainId}:${t.address}`.toLowerCase()));
        const rwaSorted = sortAndCategorize(rwaExtra, rwaTokens);
        return [...baseSorted, ...rwaSorted];
    }, [baseWithBalance, rwaWithBalance, baseTokens, rwaTokens]);
    const isBalanceLoading = (isBaseLoading && baseTokens.length > 0) ||
        (isRwaLoading && rwaTokens.length > 0 && !tokensWithBalance?.length);
    const refetch = async () => {
        await Promise.all([refetchBase(), refetchRwa()]);
    };
    return {
        tokens,
        tokensWithBalance,
        featuredTokens,
        popularTokens,
        chain,
        isLoading,
        isBalanceLoading: isBalanceLoading && isBalanceLoadingEnabled,
        refetch,
    };
};
//# sourceMappingURL=useTokenBalances.js.map