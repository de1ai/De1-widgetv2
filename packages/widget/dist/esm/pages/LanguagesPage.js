import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Check } from '@mui/icons-material';
import { List } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ListItemText } from '../components/ListItemText.js';
import { PageContainer } from '../components/PageContainer.js';
import { SettingsListItemButton } from '../components/SettingsListItemButton.js';
import { useHeader } from '../hooks/useHeader.js';
import { useLanguages } from '../hooks/useLanguages.js';
export const LanguagesPage = () => {
    const { t } = useTranslation();
    const { selectedLanguageCode, availableLanguages, setLanguageWithCode } = useLanguages();
    useHeader(t('language.title'));
    if (availableLanguages.length < 1) {
        return null;
    }
    return (_jsx(PageContainer, { disableGutters: true, children: _jsx(List, { sx: {
                paddingTop: 0,
                paddingLeft: 1.5,
                paddingRight: 1.5,
                paddingBottom: 1.5,
            }, children: availableLanguages.map((language) => (_jsxs(SettingsListItemButton, { onClick: () => setLanguageWithCode(language), children: [_jsx(ListItemText, { primary: t('language.name', { lng: language }) }), selectedLanguageCode === language && _jsx(Check, { color: "primary" })] }, language))) }) }));
};
//# sourceMappingURL=LanguagesPage.js.map