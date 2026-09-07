import { type StatusResponse } from '@de1/widget-sdk';
export declare const useTransactionDetails: (transactionHash?: string) => {
    transaction: StatusResponse;
    isLoading: false;
};
