import { useAvailableChains } from '../hooks/useAvailableChains.js';
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js';
const sanitiseBaseUrl = (baseUrl) => baseUrl.trim().replace(/\/+$/, '');
export const useExplorer = () => {
    const { explorerUrls } = useWidgetConfig();
    const { getChainById } = useAvailableChains();
    const getBaseUrl = (chain) => {
        let baseUrl = explorerUrls?.[chain.id]?.[0] ??
            chain?.metamask?.blockExplorerUrls?.[0];
        if (!baseUrl && chain.blockExplorerUrl) {
            baseUrl = chain.blockExplorerUrl;
        }
        return sanitiseBaseUrl(baseUrl);
    };
    const resolveChain = (chain) => Number.isFinite(chain) ? getChainById(chain) : chain;
    const getTransactionLink = ({ txHash, txLink, chain, }) => {
        if (!txHash && txLink) {
            return txLink;
        }
        if (!chain) {
            throw new Error('Chain parameter is required for getting transaction link');
        }
        const resolvedChain = resolveChain(chain);
        if (!resolvedChain) {
            throw new Error('Invalid chain');
        }
        return `${getBaseUrl(resolvedChain)}/tx/${txHash}`;
    };
    const getAddressLink = (address, chain) => {
        if (!chain) {
            throw new Error('Chain parameter is required for getting address link');
        }
        const resolvedChain = resolveChain(chain);
        if (!resolvedChain) {
            throw new Error('Invalid chain');
        }
        return `${getBaseUrl(resolvedChain)}/address/${address}`;
    };
    return {
        getTransactionLink,
        getAddressLink,
    };
};
//# sourceMappingURL=useExplorer.js.map