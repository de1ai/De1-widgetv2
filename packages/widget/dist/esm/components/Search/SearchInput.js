import { jsx as _jsx } from "react/jsx-runtime";
import { Search } from '@mui/icons-material';
import { FormControl, InputAdornment } from '@mui/material';
import { InputCard } from '../../components/Card/InputCard.js';
import { useHeaderHeight } from '../../stores/header/useHeaderStore.js';
import { Input, StickySearchInputContainer } from './SearchInput.style.js';
export const SearchInput = ({ name, placeholder, onChange, onBlur, value, autoFocus, }) => {
    return (_jsx(InputCard, { children: _jsx(FormControl, { fullWidth: true, children: _jsx(Input, { size: "small", placeholder: placeholder, endAdornment: _jsx(InputAdornment, { position: "end", children: _jsx(Search, {}) }), inputProps: {
                    inputMode: 'search',
                    onChange,
                    onBlur,
                    name,
                    value,
                    maxLength: 128,
                }, autoComplete: "off", autoFocus: autoFocus }) }) }));
};
export const StickySearchInput = (props) => {
    const { headerHeight } = useHeaderHeight();
    return (_jsx(StickySearchInputContainer, { headerHeight: headerHeight, children: _jsx(SearchInput, { ...props, autoFocus: true }) }));
};
//# sourceMappingURL=SearchInput.js.map