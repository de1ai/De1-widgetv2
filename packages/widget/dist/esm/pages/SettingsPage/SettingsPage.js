import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../../components/PageContainer.js';
import { useHeader } from '../../hooks/useHeader.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { BridgeAndExchangeSettings } from './BridgeAndExchangeSettings.js';
import { ResetSettingsButton } from './ResetSettingsButton.js';
import { SettingsList } from './SettingsCard/SettingCard.style.js';
import { SettingsCardAccordion } from './SettingsCard/SettingsAccordian.js';
import { SlippageSettings } from './SlippageSettings/SlippageSettings.js';
import { DynamicSlippageSettings } from './DynamicSlippageSettings.js';
export const SettingsPage = () => {
    const { t } = useTranslation();
    const { bridges } = useWidgetConfig();
    useHeader(t('translation:header.settings', 'Settings'));
    const showBridgeSettings = bridges?.showSettings !== false;
    return (_jsxs(PageContainer, { bottomGutters: true, children: [_jsx(SettingsList, { children: _jsxs(SettingsCardAccordion, { children: [_jsx(DynamicSlippageSettings, {}), _jsx(SlippageSettings, {}), showBridgeSettings ? (_jsx(BridgeAndExchangeSettings, { type: "Bridges" })) : null] }) }), _jsx(ResetSettingsButton, {})] }));
};
//# sourceMappingURL=SettingsPage.js.map