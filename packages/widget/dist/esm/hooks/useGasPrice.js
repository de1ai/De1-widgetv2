import { useQuery } from '@tanstack/react-query';
import { De1Service } from '../services/De1Service.js';
import { useSettings } from '../stores/settings/useSettings.js';
const gasKey = {
    slow: 'standard',
    normal: 'instant',
    fast: 'fast',
};
export const useGasPrice = (chainName) => {
    const { gasPrice } = useSettings(['gasPrice']);
    const { data, isLoading } = useQuery({
        queryKey: ['gasPrice'],
        queryFn: () => De1Service.getGasPrice(chainName.toLowerCase()),
    });
    const _gasPrice = data?.[gasKey[gasPrice || 'normal']];
    return {
        gasPrice: _gasPrice || _gasPrice?.maxFeePerGas || data?.gasPrice || 50000000,
        isLoading,
    };
};
//# sourceMappingURL=useGasPrice.js.map