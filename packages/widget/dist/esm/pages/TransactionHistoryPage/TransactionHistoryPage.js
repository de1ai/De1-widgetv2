import { jsx as _jsx } from "react/jsx-runtime";
import { Box, List } from '@mui/material';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../../components/PageContainer.js';
import { useHeader } from '../../hooks/useHeader.js';
import { useTransactionHistory } from '../../hooks/useTransactionHistory.js';
import { useListHeight } from '../../hooks/useListHeight.js';
import { TransactionHistoryEmpty } from './TransactionHistoryEmpty.js';
import { TransactionHistoryItem } from './TransactionHistoryItem.js';
import { TransactionHistoryItemSkeleton } from './TransactionHistorySkeleton.js';
import { minTransactionListHeight } from './constants.js';
export const TransactionHistoryPage = () => {
    // Parent ref and useVirtualizer should be in one file to avoid blank page (0 virtual items) issue
    const parentRef = useRef(null);
    const { data: transactions, isLoading } = useTransactionHistory();
    const { t } = useTranslation();
    useHeader(t('header.transactionHistory'));
    const { listHeight } = useListHeight({
        listParentRef: parentRef,
    });
    const { getVirtualItems, getTotalSize } = useVirtualizer({
        count: transactions.length,
        overscan: 5,
        paddingEnd: 12,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 186,
        getItemKey: (index) => `${transactions[index].transactionId}-${index}`,
    });
    if (!transactions.length && !isLoading) {
        return _jsx(TransactionHistoryEmpty, {});
    }
    return (_jsx(PageContainer, { disableGutters: true, style: { minHeight: minTransactionListHeight }, children: _jsx(Box, { ref: parentRef, style: {
                height: listHeight,
            }, sx: {
                overflow: 'auto',
                paddingX: 3,
            }, children: isLoading ? (_jsx(List, { disablePadding: true, children: Array.from({ length: 3 }).map((_, index) => (_jsx(TransactionHistoryItemSkeleton, {}, index))) })) : (_jsx(List, { style: {
                    height: getTotalSize(),
                    position: 'relative',
                }, disablePadding: true, children: getVirtualItems().map((item) => {
                    const transaction = transactions[item.index];
                    return (_jsx(TransactionHistoryItem, { start: item.start, transaction: transaction }, item.key));
                }) })) }) }));
};
//# sourceMappingURL=TransactionHistoryPage.js.map