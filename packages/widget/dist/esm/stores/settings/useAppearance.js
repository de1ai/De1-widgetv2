import { useSettingsActions } from '../../stores/settings/useSettingsActions.js';
import { useSettingsStore } from './useSettingsStore.js';
export const useAppearance = () => {
    const { setValue } = useSettingsActions();
    const appearance = useSettingsStore((state) => state.appearance);
    const setAppearance = (appearance) => {
        setValue('appearance', appearance);
    };
    return [appearance, setAppearance];
};
//# sourceMappingURL=useAppearance.js.map