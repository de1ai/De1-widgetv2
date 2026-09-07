import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { OpenInNewRounded } from '@mui/icons-material';
import { Avatar, Box, Link, ListItemAvatar, ListItemText, Skeleton, Slide, Typography, } from '@mui/material';
import { ChainType } from '@de1/widget-sdk';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useExplorer } from '../../hooks/useExplorer.js';
import { formatTokenAmount, formatTokenPrice } from '../../utils/format.js';
import { shortenAddress } from '../../utils/wallet.js';
import { ListItemButton } from '../ListItem/ListItemButton.js';
import { IconButton, ListItem } from './TokenList.style.js';
export const TokenListItem = ({ onClick, size, start, token, chain, accountAddress, isBalanceLoading, startAdornment, endAdornment, }) => {
    const handleClick = (e) => {
        e.stopPropagation();
        onClick?.(token.address, chain?.id);
    };
    return (_jsxs(ListItem, { style: {
            height: `${size}px`,
            transform: `translateY(${start}px)`,
        }, children: [startAdornment, _jsx(TokenListItemButton, { token: token, chain: chain, accountAddress: accountAddress, isBalanceLoading: isBalanceLoading, onClick: handleClick }), endAdornment] }));
};
export const TokenListItemButton = ({ onClick, token, chain, accountAddress, isBalanceLoading, }) => {
    const { t } = useTranslation();
    const { getAddressLink } = useExplorer();
    const container = useRef(null);
    const timeoutId = useRef(undefined);
    const [showAddress, setShowAddress] = useState(false);
    const tokenAddress = chain?.chainType === ChainType.UTXO ? accountAddress : token.address;
    const onMouseEnter = () => {
        timeoutId.current = setTimeout(() => {
            if (tokenAddress) {
                setShowAddress(true);
            }
        }, 350);
    };
    const onMouseLeave = () => {
        clearTimeout(timeoutId.current);
        if (showAddress) {
            setShowAddress(false);
        }
    };
    const tokenAmount = formatTokenAmount(token.amount, token.decimals);
    const tokenPrice = formatTokenPrice(token.amount, token.priceUSD, token.decimals);
    return (_jsxs(ListItemButton, { onClick: onClick, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave, dense: true, children: [_jsx(ListItemAvatar, { children: _jsx(Avatar, { src: token.logoURI, alt: token.symbol, children: token.symbol?.[0] }) }), _jsx(ListItemText, { primary: _jsxs(Box, { sx: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.75,
                        minWidth: 0,
                    }, children: [_jsx(Typography, { component: "span", noWrap: true, sx: {
                                fontWeight: 600,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }, children: token.symbol }), token.category ? (_jsx(Typography, { component: "span", noWrap: true, sx: {
                                flexShrink: 0,
                                px: 0.75,
                                py: 0.125,
                                borderRadius: 999,
                                fontSize: 11,
                                lineHeight: 1.4,
                                color: 'text.secondary',
                                border: '1px solid',
                                borderColor: 'divider',
                            }, children: token.category })) : null] }), secondaryTypographyProps: {
                    component: 'div',
                }, secondary: _jsxs(Box, { ref: container, sx: {
                        position: 'relative',
                        height: 20,
                    }, children: [_jsx(Slide, { direction: "down", in: !showAddress, container: container.current, style: {
                                position: 'absolute',
                            }, appear: false, children: _jsx(Box, { sx: {
                                    pt: 0.25,
                                }, children: token.name }) }), _jsx(Slide, { direction: "up", in: showAddress, container: container.current, style: {
                                position: 'absolute',
                            }, appear: false, mountOnEnter: true, children: _jsxs(Box, { sx: {
                                    display: 'flex',
                                }, children: [_jsx(Box, { sx: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            pt: 0.125,
                                        }, children: shortenAddress(tokenAddress) }), _jsx(IconButton, { size: "small", LinkComponent: Link, href: getAddressLink(tokenAddress, chain), target: "_blank", rel: "nofollow noreferrer", onClick: (e) => e.stopPropagation(), children: _jsx(OpenInNewRounded, {}) })] }) })] }) }), accountAddress ? (isBalanceLoading ? (_jsx(TokenAmountSkeleton, {})) : (_jsxs(Box, { sx: { textAlign: 'right' }, children: [token.amount ? (_jsx(Typography, { noWrap: true, sx: {
                            fontWeight: 600,
                        }, title: tokenAmount, children: t('format.tokenAmount', {
                            value: tokenAmount,
                        }) })) : null, tokenPrice ? (_jsx(Typography, { "data-price": token.priceUSD, sx: {
                            fontWeight: 500,
                            fontSize: 12,
                            color: 'text.secondary',
                        }, children: t('format.currency', {
                            value: tokenPrice,
                        }) })) : null] }))) : null] }));
};
export const TokenListItemSkeleton = () => {
    return (_jsxs(ListItem, { secondaryAction: _jsx(TokenAmountSkeleton, {}), disablePadding: true, sx: { position: 'relative', flexDirection: 'row', alignItems: 'center' }, children: [_jsx(ListItemAvatar, { children: _jsx(Skeleton, { variant: "circular", width: 40, height: 40, sx: { marginLeft: 1.5, marginRight: 2 } }) }), _jsx(ListItemText, { primary: _jsx(Skeleton, { variant: "text", width: 56, height: 24 }), secondary: _jsx(Skeleton, { variant: "text", width: 96, height: 16 }) })] }));
};
export const TokenAmountSkeleton = () => {
    return (_jsxs(Box, { sx: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
        }, children: [_jsx(Skeleton, { variant: "text", width: 56, height: 24 }), _jsx(Skeleton, { variant: "text", width: 48, height: 16 })] }));
};
//# sourceMappingURL=TokenListItem.js.map