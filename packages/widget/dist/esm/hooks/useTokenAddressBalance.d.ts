export declare const useTokenAddressBalance: (chainId?: number, tokenAddress?: string) => {
    token: import("@de1/widget-sdk").TokenAmount;
    chain: import("@de1/widget-sdk").ExtendedChain;
    isLoading: boolean;
    refetch: () => Promise<void>;
};
