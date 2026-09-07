import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, Box, Skeleton, Tooltip, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { maxChainsToOrder, maxChainsToShow, } from '../../stores/chains/createChainOrderStore.js';
import { FormKeyHelper } from '../../stores/form/types.js';
import { useFieldValues } from '../../stores/form/useFieldValues.js';
import { navigationRoutes } from '../../utils/navigationRoutes.js';
import { ChainCard, ChainContainer } from './ChainSelect.style.js';
import { useChainSelect } from './useChainSelect.js';
export const ChainSelect = ({ formType }) => {
    const navigate = useNavigate();
    const { chainOrder, chains, getChains, isLoading, setChainOrder, setCurrentChain, } = useChainSelect(formType);
    const [chainId] = useFieldValues(FormKeyHelper.getChainKey(formType));
    useEffect(() => {
        if (chainId) {
            const hasChainInOrderedList = chainOrder.includes(chainId);
            // If we don't have a chain in the ordered chain list we should add it.
            if (!hasChainInOrderedList) {
                setChainOrder(chainId, formType);
            }
        }
    }, [chainId, chainOrder, formType, setChainOrder]);
    const showAllChains = () => {
        navigate(navigationRoutes[`${formType}Chain`]);
    };
    // We check if we can accommodate all the chains on the grid
    // If there are more than 10 chains we show the number of hidden chains as the last one tile
    const chainsToHide = chains?.length === maxChainsToShow
        ? 0
        : (chains?.length ?? 0) - maxChainsToOrder;
    // When there is less than 10 chains we don't care about the order
    const chainsToShow = chainsToHide > 0 ? getChains() : chains;
    return (_jsxs(ChainContainer, { children: [isLoading
                ? Array.from({ length: maxChainsToOrder }).map((_, index) => (_jsx(Skeleton, { variant: "rectangular", width: 56, height: 56, sx: { borderRadius: 1 } }, index)))
                : chainsToShow?.map((chain) => (_jsx(Tooltip, { title: chain.name, enterNextDelay: 100, children: _jsx(ChainCard, { component: "button", onClick: () => setCurrentChain(chain.id), type: chainId === chain.id ? 'selected' : 'default', selectionColor: "primary", children: _jsx(Avatar, { src: chain.logoURI, alt: chain.key, sx: { width: 40, height: 40 }, children: chain.name[0] }) }) }, chain.id))), chainsToHide > 0 ? (_jsx(ChainCard, { component: "button", onClick: showAllChains, children: _jsx(Box, { sx: {
                        width: 40,
                        height: 40,
                        display: 'grid',
                        placeItems: 'center',
                    }, children: _jsxs(Typography, { sx: {
                            fontWeight: 500,
                        }, children: ["+", chainsToHide] }) }) })) : null] }));
};
//# sourceMappingURL=ChainSelect.js.map