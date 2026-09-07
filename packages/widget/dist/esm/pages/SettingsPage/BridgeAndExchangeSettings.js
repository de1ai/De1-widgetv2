import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { AirlineStops, SwapHoriz, WarningRounded } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { shallow } from 'zustand/shallow';
import { CardButton } from '../../components/Card/CardButton.js';
import { useSettingMonitor } from '../../hooks/useSettingMonitor.js';
import { useSettingsStore } from '../../stores/settings/useSettingsStore.js';
import { navigationRoutes } from '../../utils/navigationRoutes.js';
import { BadgedValue } from './SettingsCard/BadgedValue.js';
import { SlippageLimitsWarningContainer } from './SlippageSettings/SlippageSettings.style.js';
const supportedIcons = {
    Bridges: AirlineStops,
    Exchanges: SwapHoriz,
};
export const BridgeAndExchangeSettings = ({ type }) => {
    const { isBridgesChanged, isExchangesChanged, isNoBridgesEnabled } = useSettingMonitor();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [enabledTools, tools] = useSettingsStore((state) => {
        const enabledTools = Object.values(state[`_enabled${type}`]);
        return [enabledTools.filter(Boolean).length, enabledTools.length];
    }, shallow);
    const customisationLookUp = {
        Bridges: isBridgesChanged,
        Exchanges: isExchangesChanged,
    };
    const handleClick = () => {
        navigate(navigationRoutes[type.toLowerCase()]);
    };
    const Icon = supportedIcons[type];
    const showNoBridgesWarning = type === 'Bridges' && isNoBridgesEnabled;
    const badgeColor = showNoBridgesWarning
        ? 'warning'
        : customisationLookUp[type]
            ? 'info'
            : undefined;
    return (_jsxs(_Fragment, { children: [_jsx(CardButton, { onClick: handleClick, icon: type === 'Exchanges' ? _jsx(Icon, {}) : undefined, title: t(`settings.enabled${type}`), children: _jsx(BadgedValue, { badgeColor: badgeColor, showBadge: !!badgeColor, children: `${enabledTools}/${tools}` }) }), showNoBridgesWarning ? (_jsxs(SlippageLimitsWarningContainer, { sx: { px: 1 }, children: [_jsx(WarningRounded, { color: "warning" }), _jsx(Typography, { sx: {
                            fontSize: 13,
                            fontWeight: 400,
                        }, children: t('warning.message.noBridgesEnabled') })] })) : null] }));
};
//# sourceMappingURL=BridgeAndExchangeSettings.js.map