import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
// import { ActiveTransactions } from '../../components/ActiveTransactions/ActiveTransactions.js'
// import { AmountInput } from '../../components/AmountInput/AmountInput.js'
import { ContractComponent } from '../../components/ContractComponent/ContractComponent.js';
import { PageContainer } from '../../components/PageContainer.js';
import { PoweredBy } from '../../components/PoweredBy/PoweredBy.js';
// import { Routes } from '../../components/Routes/Routes.js'
import { SelectChainAndToken } from '../../components/SelectChainAndToken.js';
import { SendToWalletButton } from '../../components/SendToWallet/SendToWalletButton.js';
import { TransactionDetails } from '../../components/TransactionDetails.js';
import { useHeader } from '../../hooks/useHeader.js';
import { useRoutes } from '../../hooks/useRoutes.js';
// import { useWideVariant } from '../../hooks/useWideVariant.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { useSplitSubvariantStore } from '../../stores/settings/useSplitSubvariantStore.js';
import { HiddenUI } from '../../types/widget.js';
import { MainWarningMessages } from './MainWarningMessages.js';
import { ReviewButton } from './ReviewButton.js';
export const MainPage = () => {
    const { t } = useTranslation();
    const { routes } = useRoutes();
    // const wideVariant = useWideVariant()
    const { subvariant, subvariantOptions, contractComponent, hiddenUI } = useWidgetConfig();
    const subvariantState = useSplitSubvariantStore((store) => store.state);
    const custom = subvariant === 'custom';
    const showPoweredBy = !hiddenUI?.includes(HiddenUI.PoweredBy);
    const title = subvariant === 'custom'
        ? t(`header.${subvariantOptions?.custom ?? 'checkout'}`)
        : subvariant === 'refuel'
            ? t('header.gas')
            : subvariant === 'bridge'
                ? t('header.bridge')
                : t('header.swap');
    useHeader(title);
    const marginSx = { marginBottom: 2 };
    return (_jsxs(PageContainer, { children: [custom ? (_jsx(ContractComponent, { sx: marginSx, children: contractComponent })) : null, _jsx(SelectChainAndToken, { mb: 2 }), _jsx(SendToWalletButton, { sx: marginSx }), _jsx(MainWarningMessages, { route: routes?.[0], mb: 2 }), _jsx(ReviewButton, {}), _jsx(TransactionDetails, { route: routes?.[0], sx: { marginTop: 2 } }), showPoweredBy ? _jsx(PoweredBy, {}) : null] }));
};
//# sourceMappingURL=MainPage.js.map