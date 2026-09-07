import { getTools } from '@de1/widget-sdk';
import { useQuery } from '@tanstack/react-query';
import { getCrossChainBridgeTools } from '../cross/bridgeTools.js';
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js';
import { useSettingsStore } from '../stores/settings/useSettingsStore.js';
import { isItemAllowed } from '../utils/item.js';
export const useTools = () => {
    const { bridges, exchanges } = useWidgetConfig();
    const { data } = useQuery({
        queryKey: [
            'tools',
            bridges?.allow,
            bridges?.deny,
            exchanges?.allow,
            exchanges?.deny,
        ],
        queryFn: async () => {
            const tools = await getTools();
            const result = {
                bridges: getCrossChainBridgeTools(bridges),
                exchanges: tools.exchanges.filter((exchange) => isItemAllowed(exchange.key, exchanges)),
            };
            const { initializeTools } = useSettingsStore.getState();
            initializeTools('Bridges', result.bridges.map((bridge) => bridge.key));
            initializeTools('Exchanges', result.exchanges.map((exchange) => exchange.key));
            return result;
        },
        refetchInterval: 180000,
        staleTime: 180000,
    });
    return { tools: data };
};
//# sourceMappingURL=useTools.js.map