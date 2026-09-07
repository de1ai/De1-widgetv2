import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, ListItemAvatar, debounce } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChainSelect } from '../../components/ChainSelect/useChainSelect.js';
import { FullPageContainer } from '../../components/FullPageContainer.js';
import { ListItemButton } from '../../components/ListItemButton.js';
import { ListItemText } from '../../components/ListItemText.js';
import { StickySearchInput } from '../../components/Search/SearchInput.js';
import { SearchList } from '../../components/Search/SearchInput.style.js';
import { SearchNotFound } from '../../components/Search/SearchNotFound.js';
import { useTokenSelect } from '../../components/TokenList/useTokenSelect.js';
import { useDefaultElementId } from '../../hooks/useDefaultElementId.js';
import { useHeader } from '../../hooks/useHeader.js';
import { useNavigateBack } from '../../hooks/useNavigateBack.js';
import { useScrollableContainer } from '../../hooks/useScrollableContainer.js';
export const SelectChainPage = ({ formType, selectNativeToken, }) => {
    const { navigateBack } = useNavigateBack();
    const { chains, setCurrentChain } = useChainSelect(formType);
    const selectToken = useTokenSelect(formType, navigateBack);
    const elementId = useDefaultElementId();
    const scrollableContainer = useScrollableContainer(elementId);
    const { t } = useTranslation();
    useHeader(t('header.selectChain'));
    const handleClick = async (chain) => {
        if (selectNativeToken) {
            selectToken(chain.nativeToken.address, chain.id);
        }
        else {
            setCurrentChain(chain.id);
            navigateBack();
        }
    };
    const [filteredChains, setFilteredChains] = useState(chains ?? []);
    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        if (!value) {
            setFilteredChains(chains ?? []);
        }
        else {
            setFilteredChains(chains
                ? chains.filter((chain) => chain.name.toLowerCase().includes(value.toLowerCase()))
                : []);
        }
        if (scrollableContainer) {
            scrollableContainer.scrollTop = 0;
        }
    };
    const debouncedSearchInputChange = debounce(handleSearchInputChange, 250);
    return (_jsxs(FullPageContainer, { disableGutters: true, children: [_jsx(StickySearchInput, { onChange: debouncedSearchInputChange, placeholder: t('main.searchChains') }), filteredChains.length ? (_jsx(SearchList, { children: filteredChains.map((chain) => (_jsxs(ListItemButton, { onClick: () => handleClick(chain), children: [_jsx(ListItemAvatar, { children: _jsx(Avatar, { src: chain.logoURI, alt: chain.name, children: chain.name[0] }) }), _jsx(ListItemText, { primary: chain.name })] }, chain.id))) })) : (_jsx(SearchNotFound, { message: t('info.message.emptyChainList'), adjustForStickySearchInput: true }))] }));
};
//# sourceMappingURL=SelectChainPage.js.map