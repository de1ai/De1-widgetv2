import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useExecutingRoutesIds } from '../../stores/routes/useExecutingRoutesIds.js';
import { navigationRoutes } from '../../utils/navigationRoutes.js';
import { Card } from '../Card/Card.js';
import { CardTitle } from '../Card/CardTitle.js';
import { ActiveTransactionItem } from './ActiveTransactionItem.js';
import { ShowAllButton } from './ActiveTransactions.style.js';
export const ActiveTransactions = (props) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const executingRoutes = useExecutingRoutesIds();
    if (!executingRoutes?.length) {
        return null;
    }
    const handleShowAll = () => {
        navigate(navigationRoutes.activeTransactions);
    };
    const hasShowAll = executingRoutes?.length > 2;
    return (_jsxs(Card, { type: "selected", selectionColor: "secondary", ...props, children: [_jsx(CardTitle, { children: t('header.activeTransactions') }), _jsx(Stack, { spacing: 1.5, sx: {
                    pt: 1.5,
                    pb: hasShowAll ? 0 : 2,
                }, children: executingRoutes.slice(0, 2).map((routeId) => (_jsx(ActiveTransactionItem, { routeId: routeId, dense: true }, routeId))) }), hasShowAll ? (_jsx(ShowAllButton, { disableRipple: true, fullWidth: true, onClick: handleShowAll, children: t('button.showAll') })) : null] }));
};
//# sourceMappingURL=ActiveTransactions.js.map