import { jsx as _jsx } from "react/jsx-runtime";
import { createInstance } from 'i18next';
import { useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';
import * as supportedLanguages from '../../i18n/index.js';
import { useSettings } from '../../stores/settings/useSettings.js';
import { compactNumberFormatter } from '../../utils/compactNumberFormatter.js';
import { currencyExtendedFormatter } from '../../utils/currencyExtendedFormatter.js';
import { deepMerge } from '../../utils/deepMerge.js';
import { isItemAllowed } from '../../utils/item.js';
import { percentFormatter } from '../../utils/percentFormatter.js';
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js';
export const I18nProvider = ({ children, }) => {
    const { languageResources, languages } = useWidgetConfig();
    const { language } = useSettings(['language']);
    const i18n = useMemo(() => {
        let resources = Object.keys(supportedLanguages)
            .filter((lng) => isItemAllowed(lng, languages))
            .reduce((resources, lng) => {
            resources[lng] = {
                translation: languageResources?.[lng]
                    ? deepMerge(supportedLanguages[lng], languageResources[lng])
                    : supportedLanguages[lng],
            };
            return resources;
        }, {});
        if (languageResources) {
            resources = Object.keys(languageResources).reduce((resources, lng) => {
                if (!resources[lng]) {
                    resources[lng] = {
                        translation: languageResources[lng],
                    };
                }
                return resources;
            }, resources);
        }
        const i18n = createInstance({
            lng: languages?.default || language || 'en',
            fallbackLng: resources.en
                ? 'en'
                : languages?.default ||
                    languages?.allow?.[0] ||
                    Object.keys(resources)?.[0],
            lowerCaseLng: true,
            interpolation: {
                escapeValue: false,
            },
            resources,
            detection: {
                caches: [],
            },
            returnEmptyString: false,
        });
        i18n.init();
        i18n.services.formatter?.addCached('numberExt', compactNumberFormatter);
        i18n.services.formatter?.addCached('currencyExt', currencyExtendedFormatter);
        i18n.services.formatter?.addCached('percent', percentFormatter);
        return i18n;
    }, [language, languageResources, languages]);
    return _jsx(I18nextProvider, { i18n: i18n, children: children });
};
//# sourceMappingURL=I18nProvider.js.map