import { resolveRoutePriceImpact } from '../utils/getPriceImpact.js';
export const usePriceImpact = (route) => {
    const priceImpact = route ? resolveRoutePriceImpact(route) : 0;
    return {
        priceImpact,
    };
};
//# sourceMappingURL=usePriceImpact.js.map