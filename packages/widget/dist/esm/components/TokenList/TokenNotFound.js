import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { useAvailableChains } from '../../hooks/useAvailableChains.js';
import { FormKeyHelper } from '../../stores/form/types.js';
import { useFieldValues } from '../../stores/form/useFieldValues.js';
import { SearchNotFound } from '../Search/SearchNotFound.js';
export const TokenNotFound = ({ formType }) => {
    const { t } = useTranslation();
    const [selectedChainId] = useFieldValues(FormKeyHelper.getChainKey(formType));
    const { getChainById } = useAvailableChains();
    return (_jsx(SearchNotFound, { message: t('info.message.emptyTokenList', {
            chainName: getChainById(selectedChainId)?.name,
        }) }));
};
//# sourceMappingURL=TokenNotFound.js.map