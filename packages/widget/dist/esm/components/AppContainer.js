import { jsx as _jsx } from "react/jsx-runtime";
import { Box, Container, ScopedCssBaseline, styled } from '@mui/material';
import { defaultMaxHeight } from '../config/constants.js';
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js';
import { useHeaderHeight } from '../stores/header/useHeaderStore.js';
import { ElementId, createElementId } from '../utils/elements.js';
// NOTE: the setting of the height in AppExpandedContainer, RelativeContainer and CssBaselineContainer can
//  be done dynamically by values in the config - namely the config.theme.container values display, maxHeight and height
//  A Number of other components and hooks work with height values that are often set on or derived from these elements
//  if there are changes to how the height works here you should also check the functionality of these hooks and their point of use
//    - useTokenListHeight
//    - useSetContentHeight
//  Also check any code that is using the methods from elements.ts utils file
export const AppExpandedContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'variant',
})(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'start',
    flex: 1,
    height: theme.container?.display === 'flex'
        ? '100%'
        : theme.container?.maxHeight
            ? 'auto'
            : theme.container?.height || 'auto',
    variants: [
        {
            props: {
                variant: 'drawer',
            },
            style: {
                height: 'none',
            },
        },
    ],
}));
export const RelativeContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'variant',
})(({ theme }) => {
    return {
        position: 'relative',
        boxSizing: 'content-box',
        width: '100%',
        minWidth: theme.breakpoints.values.xs,
        maxWidth: theme.breakpoints.values.sm,
        background: theme.palette.background.default,
        overflow: 'auto',
        flex: 1,
        zIndex: 0,
        ...theme.container,
        maxHeight: theme.container?.display === 'flex' && !theme.container?.height
            ? '100%'
            : theme.container?.maxHeight
                ? theme.container?.maxHeight
                : theme.container?.height || defaultMaxHeight,
        variants: [
            {
                props: {
                    variant: 'drawer',
                },
                style: {
                    maxHeight: 'none',
                    height: '100%',
                },
            },
        ],
    };
});
const CssBaselineContainer = styled(ScopedCssBaseline, {
    shouldForwardProp: (prop) => !['variant', 'paddingTopAdjustment', 'elementId'].includes(prop),
})(({ theme, variant, paddingTopAdjustment }) => ({
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    overflowX: 'clip',
    margin: 0,
    width: '100%',
    maxHeight: variant === 'drawer' || theme.container?.display === 'flex'
        ? 'none'
        : theme.container?.maxHeight
            ? theme.container?.maxHeight
            : theme.container?.height || defaultMaxHeight,
    overflowY: 'auto',
    height: theme.container?.display === 'flex' ? 'auto' : '100%',
    paddingTop: paddingTopAdjustment,
    // This allows FullPageContainer.tsx to expand and fill the available vertical space in max height and default layout modes
    '&:has(.full-page-container)': {
        height: theme.container?.maxHeight
            ? theme.container?.maxHeight
            : theme.container?.height || defaultMaxHeight,
    },
}));
export const FlexContainer = styled(Container)({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
});
export const AppContainer = ({ children }) => {
    // const ref = useRef<HTMLDivElement>(null);
    const { variant, elementId, theme } = useWidgetConfig();
    const { headerHeight } = useHeaderHeight();
    const positionFixedAdjustment = theme?.header?.position === 'fixed' ? headerHeight : 0;
    return (_jsx(RelativeContainer, { variant: variant, id: createElementId(ElementId.RelativeContainer, elementId), children: _jsx(CssBaselineContainer, { id: createElementId(ElementId.ScrollableContainer, elementId), variant: variant, enableColorScheme: true, paddingTopAdjustment: positionFixedAdjustment, elementId: elementId, children: _jsx(FlexContainer, { disableGutters: true, children: children }) }) }));
};
//# sourceMappingURL=AppContainer.js.map