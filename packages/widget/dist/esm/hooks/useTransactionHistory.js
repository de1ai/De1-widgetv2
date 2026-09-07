import { useAccount } from '@de1/wallet-management';
import { getTransactionHistory, } from '@de1/widget-sdk';
import { useQueries } from '@tanstack/react-query';
export const useTransactionHistory = () => {
    const { accounts } = useAccount();
    const { data, isLoading } = useQueries({
        queries: accounts.map((account) => ({
            queryKey: ['transaction-history', account.address],
            queryFn: (async ({ queryKey: [, accountAddress], signal }) => {
                if (!accountAddress) {
                    return [];
                }
                const date = new Date();
                date.setFullYear(date.getFullYear() - 10);
                const response = await getTransactionHistory({
                    wallet: accountAddress,
                    fromTimestamp: Math.floor(date.getTime() / 1000),
                    toTimestamp: Math.floor(Date.now() / 1000),
                }, { signal });
                return response.transfers;
            }),
            refetchInterval: 300000,
            enabled: Boolean(account.address),
        })),
        combine: (results) => {
            const uniqueTransactions = new Map();
            results.forEach((result) => {
                if (result.data) {
                    result.data.forEach((transaction) => {
                        if (transaction?.transactionId &&
                            transaction?.receiving?.chainId &&
                            transaction?.sending.chainId) {
                            uniqueTransactions.set(transaction.transactionId, transaction);
                        }
                    });
                }
            });
            const data = Array.from(uniqueTransactions.values()).sort((a, b) => {
                return ((b?.sending?.timestamp ?? 0) -
                    (a?.sending?.timestamp ?? 0));
            });
            return {
                data: data,
                isLoading: results.some((result) => result.isLoading),
            };
        },
    });
    return {
        data,
        isLoading,
    };
};
//# sourceMappingURL=useTransactionHistory.js.map