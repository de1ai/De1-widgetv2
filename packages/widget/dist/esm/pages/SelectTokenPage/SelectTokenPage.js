import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { ChainSelect } from '../../components/ChainSelect/ChainSelect.js';
import { FullPageContainer } from '../../components/FullPageContainer.js';
import { TokenList } from '../../components/TokenList/TokenList.js';
import { useHeader } from '../../hooks/useHeader.js';
import { useListHeight } from '../../hooks/useListHeight.js';
import { useNavigateBack } from '../../hooks/useNavigateBack.js';
import { useScrollableOverflowHidden } from '../../hooks/useScrollableContainer.js';
import { useSwapOnly } from '../../hooks/useSwapOnly.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { SearchTokenInput } from './SearchTokenInput.js';
export const SelectTokenPage = ({ formType }) => {
    useScrollableOverflowHidden();
    const theme = useTheme();
    const { navigateBack } = useNavigateBack();
    const headerRef = useRef(null);
    const listParentRef = useRef(null);
    const { listHeight, minListHeight } = useListHeight({
        listParentRef,
        headerRef,
    });
    const swapOnly = useSwapOnly();
    const [tokenSourceFilter, setTokenSourceFilter] = useState('all');
    const { subvariant } = useWidgetConfig();
    const { t } = useTranslation();
    const title = formType === 'from'
        ? subvariant === 'custom'
            ? t('header.payWith')
            : t('header.from')
        : t('header.to');
    useHeader(title);
    const hideChainSelect = swapOnly && formType === 'to';
    const tokenSourceIndex = tokenSourceFilter === 'all' ? 0 : 1;
    return (_jsxs(FullPageContainer, { disableGutters: true, children: [_jsxs(Box, { ref: headerRef, sx: {
                    pb: 2,
                    px: 3,
                }, children: [!hideChainSelect ? _jsx(ChainSelect, { formType: formType }) : null, _jsxs(Box, { sx: {
                            mt: !hideChainSelect ? 2 : 0,
                        }, children: [_jsx(SearchTokenInput, {}), _jsxs(Box, { sx: {
                                    mt: 1.5,
                                    position: 'relative',
                                    backgroundColor: alpha(theme.palette.common.white, 0.04),
                                    p: 0.5,
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                }, children: [_jsx(Box, { sx: {
                                            position: 'absolute',
                                            top: 4,
                                            bottom: 4,
                                            left: 4,
                                            width: 'calc(50% - 4px)',
                                            borderRadius: 1.5,
                                            backgroundColor: alpha(theme.palette.common.black, 0.56),
                                            boxShadow: `0 6px 18px ${alpha(theme.palette.common.black, 0.32)}`,
                                            transform: tokenSourceIndex === 0 ? 'translateX(0)' : 'translateX(calc(100% + 4px))',
                                            transition: theme.transitions.create('transform', {
                                                duration: 280,
                                                easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                                            }),
                                            pointerEvents: 'none',
                                        } }), _jsxs(ToggleButtonGroup, { exclusive: true, fullWidth: true, size: "small", value: tokenSourceFilter, onChange: (_, nextValue) => {
                                            if (nextValue) {
                                                setTokenSourceFilter(nextValue);
                                            }
                                        }, "aria-label": "token source filter", sx: {
                                            position: 'relative',
                                            zIndex: 1,
                                            '& .MuiToggleButton-root': {
                                                textTransform: 'none',
                                                border: 'none',
                                                borderRadius: 1.5,
                                                fontWeight: 600,
                                                py: 0.75,
                                                flex: 1,
                                                zIndex: 1,
                                                backgroundColor: 'transparent',
                                                color: 'inherit',
                                                boxShadow: 'none',
                                                '&:hover': {
                                                    backgroundColor: 'transparent',
                                                },
                                                '&:active': {
                                                    backgroundColor: 'transparent',
                                                },
                                                '&.Mui-focusVisible': {
                                                    backgroundColor: 'transparent',
                                                },
                                                '&.Mui-selected, &.Mui-selected:hover, &.Mui-selected:active, &.Mui-selected.Mui-focusVisible': {
                                                    backgroundColor: 'transparent !important',
                                                    color: 'inherit !important',
                                                    boxShadow: 'none',
                                                },
                                                '& .MuiTouchRipple-root': {
                                                    display: 'none',
                                                },
                                                '&.Mui-selected .MuiTouchRipple-root': {
                                                    display: 'none',
                                                },
                                                '&.Mui-selected': {
                                                    backgroundColor: 'transparent',
                                                    color: 'inherit',
                                                    '&:hover': {
                                                        backgroundColor: 'transparent',
                                                    },
                                                },
                                            },
                                        }, children: [_jsx(ToggleButton, { value: "all", disableRipple: true, children: "ALL" }), _jsx(ToggleButton, { value: "rwa", disableRipple: true, children: "RWA" })] })] })] })] }), _jsx(Box, { sx: {
                    height: minListHeight,
                }, children: _jsx(TokenList, { parentRef: listParentRef, height: listHeight, onClick: navigateBack, formType: formType, tokenSourceFilter: tokenSourceFilter }) })] }));
};
//# sourceMappingURL=SelectTokenPage.js.map