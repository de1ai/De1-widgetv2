'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AppRoutes } from './AppRoutes.js';
import { AppContainer, AppExpandedContainer, FlexContainer, } from './components/AppContainer.js';
import { Header } from './components/Header/Header.js';
import { Initializer } from './components/Initializer.js';
// import { RoutesExpanded } from './components/Routes/RoutesExpanded.js'
// import { useWideVariant } from './hooks/useWideVariant.js'
import { useWidgetConfig } from './providers/WidgetProvider/WidgetProvider.js';
import { ElementId, createElementId } from './utils/elements.js';
export const AppDefault = () => {
    const { elementId } = useWidgetConfig();
    // const wideVariant = useWideVariant()
    return (_jsx(AppExpandedContainer, { id: createElementId(ElementId.AppExpandedContainer, elementId), children: _jsxs(AppContainer, { children: [_jsx(Header, {}), _jsx(FlexContainer, { disableGutters: true, children: _jsx(AppRoutes, {}) }), _jsx(Initializer, {})] }) }));
};
//# sourceMappingURL=AppDefault.js.map