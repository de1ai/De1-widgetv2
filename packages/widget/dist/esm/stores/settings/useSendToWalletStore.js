import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
export const useSendToWalletStore = createWithEqualityFn((set) => ({
    showSendToWallet: false,
    setSendToWallet: (value) => set({
        showSendToWallet: value,
    }),
}), Object.is);
export const useSendToWalletActions = () => {
    const actions = useSendToWalletStore((store) => ({
        setSendToWallet: store.setSendToWallet,
    }), shallow);
    return actions;
};
//# sourceMappingURL=useSendToWalletStore.js.map