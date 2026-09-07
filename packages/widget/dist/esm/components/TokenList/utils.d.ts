import type { TokenAmount } from '../../types/token.js';
import type { TokenSourceFilter } from './types.js';
export declare const filteredTokensComparator: (searchFilter: string) => (tokenA: TokenAmount, tokenB: TokenAmount) => 0 | 1 | -1;
export declare const filterTokensBySource: (tokens: TokenAmount[], tokenSourceFilter: TokenSourceFilter) => TokenAmount[];
