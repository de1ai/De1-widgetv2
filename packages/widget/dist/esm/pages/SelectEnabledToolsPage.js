import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Check, CheckBoxOutlineBlankOutlined, CheckBoxOutlined, IndeterminateCheckBoxOutlined, } from '@mui/icons-material';
import { Avatar, IconButton, ListItemAvatar, Tooltip, debounce, useTheme, } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { shallow } from 'zustand/shallow';
import { FullPageContainer } from '../components/FullPageContainer.js';
import { ListItemText } from '../components/ListItemText.js';
import { StickySearchInput } from '../components/Search/SearchInput.js';
import { SearchList } from '../components/Search/SearchInput.style.js';
import { SearchNotFound } from '../components/Search/SearchNotFound.js';
import { SettingsListItemButton } from '../components/SettingsListItemButton.js';
import { useDefaultElementId } from '../hooks/useDefaultElementId.js';
import { useHeader } from '../hooks/useHeader.js';
import { useScrollableContainer } from '../hooks/useScrollableContainer.js';
import { useTools } from '../hooks/useTools.js';
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js';
import { useSettingsActions } from '../stores/settings/useSettingsActions.js';
import { useSettingsStore } from '../stores/settings/useSettingsStore.js';
import { navigationRoutes } from '../utils/navigationRoutes.js';
const SelectAllCheckbox = ({ allCheckboxesSelected, anyCheckboxesSelected, noCheckboxesAvailable, onClick, }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const tooltipTitle = noCheckboxesAvailable
        ? undefined
        : allCheckboxesSelected
            ? t('tooltip.deselectAll')
            : t('tooltip.selectAll');
    return (_jsx(Tooltip, { title: tooltipTitle, children: _jsx(IconButton, { size: "medium", edge: theme?.navigation?.edge ? 'end' : false, onClick: onClick, children: allCheckboxesSelected ? (_jsx(CheckBoxOutlined, {})) : anyCheckboxesSelected ? (_jsx(IndeterminateCheckBoxOutlined, {})) : (_jsx(CheckBoxOutlineBlankOutlined, {})) }) }));
};
export const SelectEnabledToolsPage = ({ type }) => {
    const typeKey = type.toLowerCase();
    const { bridges } = useWidgetConfig();
    const navigate = useNavigate();
    const { tools } = useTools();
    const { setToolValue, toggleToolKeys } = useSettingsActions();
    const [enabledTools, disabledTools] = useSettingsStore((state) => [state[`_enabled${type}`], state[`disabled${type}`]], shallow);
    const { t } = useTranslation();
    const elementId = useDefaultElementId();
    const scrollableContainer = useScrollableContainer(elementId);
    const [filteredTools, setFilteredTools] = useState(tools?.[typeKey] ?? []);
    useEffect(() => {
        if (type === 'Bridges' && bridges?.showSettings === false) {
            navigate(`/${navigationRoutes.settings}`);
        }
    }, [bridges?.showSettings, navigate, type]);
    const headerAction = useMemo(() => (_jsx(SelectAllCheckbox, { allCheckboxesSelected: !!filteredTools.length &&
            filteredTools.every((tool) => !disabledTools.includes(tool.key)), anyCheckboxesSelected: !!filteredTools.length &&
            filteredTools.some((tool) => disabledTools.includes(tool.key)), noCheckboxesAvailable: !filteredTools.length, onClick: () => toggleToolKeys(type, filteredTools.map((tool) => tool.key)) })), [disabledTools, toggleToolKeys, type, filteredTools]);
    useHeader(t(`settings.enabled${type}`), headerAction);
    const handleClick = (key) => {
        setToolValue(type, key, !enabledTools[key]);
    };
    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        if (!value) {
            setFilteredTools(tools?.[typeKey] ?? []);
        }
        else {
            setFilteredTools((tools?.[typeKey]
                ? tools[typeKey].filter((tool) => tool.name.toLowerCase().includes(value.toLowerCase()))
                : []));
        }
        if (scrollableContainer) {
            scrollableContainer.scrollTop = 0;
        }
    };
    const debouncedSearchInputChange = debounce(handleSearchInputChange, 250);
    return (_jsxs(FullPageContainer, { disableGutters: true, children: [_jsx(StickySearchInput, { onChange: debouncedSearchInputChange, placeholder: t(`main.search${type}`) }), filteredTools.length ? (_jsx(SearchList, { children: filteredTools.map((tool) => (_jsxs(SettingsListItemButton, { onClick: () => handleClick(tool.key), children: [_jsx(ListItemAvatar, { sx: { minWidth: 44 }, children: _jsx(Avatar, { src: tool.logoURI, alt: tool.name, sx: { width: 28, height: 28, fontSize: 14 }, children: tool.name[0] }) }), _jsx(ListItemText, { primary: tool.name }), enabledTools[tool.key] && (_jsx(Check, { color: "success", sx: { fontSize: 18 } }))] }, tool.name))) })) : (_jsx(SearchNotFound, { message: t(`info.message.empty${type}List`), adjustForStickySearchInput: true }))] }));
};
//# sourceMappingURL=SelectEnabledToolsPage.js.map