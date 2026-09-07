import { create } from 'zustand';
export const useServerErrorStore = create((set) => ({
    error: null,
    setError: (msg) => set({ error: msg }),
}));
//# sourceMappingURL=useServerErrorStore.js.map