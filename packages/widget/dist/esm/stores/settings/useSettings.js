import { shallow } from 'zustand/shallow';
import { useSettingsStore } from './useSettingsStore.js';
export const useSettings = (keys) => {
    return useSettingsStore((state) => keys.reduce((values, key) => {
        values[key] = state[key];
        return values;
    }, {}), shallow);
};
//# sourceMappingURL=useSettings.js.map