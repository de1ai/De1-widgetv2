export class De1Service {
    // Get De¹ Exchange supported chain name
    static getChainName(chainId) {
        return this.CHAIN_ID_MAP[chainId] || chainId.toString();
    }
    // Get API URL based on chain ID
    static getApiUrl(chainId) {
        // If chainId exists in CHAIN_ID_MAP, use V1 API
        const chainName = this.getChainName(chainId);
        return Object.keys(this.CHAIN_ID_MAP).includes(chainId.toString())
            ? `${this.API_V4_URL}/${chainName}`
            : `${this.API_V4_URL}/${chainId}`;
    }
    static getSolanaAddress(chain, tokenAddress) {
        if (chain === '1151111081099710' && tokenAddress === 'So11111111111111111111111111111111111111112') {
            return '11111111111111111111111111111111';
        }
        else if (chain === '1151111081099710' && tokenAddress === '11111111111111111111111111111111') {
            return 'So11111111111111111111111111111111111111112';
        }
        return tokenAddress;
    }
    static normalizeTokenAddress(chain, tokenAddress) {
        const normalizedAddress = this.getSolanaAddress(chain, tokenAddress);
        if (/^0x/i.test(normalizedAddress) || normalizedAddress === 'bitcoin') {
            return normalizedAddress.toLowerCase();
        }
        return normalizedAddress;
    }
    static createTokenSource(currentSource, nextSource) {
        if (!currentSource || currentSource === nextSource) {
            return nextSource;
        }
        return 'both';
    }
    static mapToken(chain, token, tokenSource) {
        const address = this.normalizeTokenAddress(chain, token.address);
        return {
            address,
            symbol: token.symbol,
            decimals: token.decimals,
            name: token.name,
            logoURI: token.icon,
            priceUSD: token.usd,
            chainId: Number(chain),
            amount: 0n,
            featured: false,
            popular: false,
            tokenSource,
            category: token.category,
        };
    }
    static async fetchTokenList(chain, useRwaTokenList = false) {
        const chainName = this.getChainName(chain);
        const queryParams = new URLSearchParams(useRwaTokenList ? { rwa: 'true' } : {});
        const response = await fetch(`${this.API_V4_URL}/${chainName}/tokenList${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
        const data = await response.json();
        if (data.code !== 200) {
            if (chain === '20000000000001') {
                data.data = [
                    {
                        address: 'bitcoin',
                        symbol: 'BTC',
                        decimals: 8,
                        isNative: true,
                        name: 'Bitcoin',
                        icon: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png',
                        usd: '109559',
                    }
                ];
            }
            else {
                throw new Error('Failed to fetch token list');
            }
        }
        return (data.data ?? []);
    }
    static mergeTokenLists(chain, tokenLists) {
        const mergedTokens = new Map();
        tokenLists.forEach(({ tokens, source }) => {
            tokens.forEach((token) => {
                const normalizedAddress = this.normalizeTokenAddress(chain, token.address);
                const currentToken = mergedTokens.get(normalizedAddress);
                if (!currentToken) {
                    mergedTokens.set(normalizedAddress, this.mapToken(chain, token, source));
                    return;
                }
                mergedTokens.set(normalizedAddress, {
                    ...currentToken,
                    category: currentToken.category || token.category,
                    tokenSource: this.createTokenSource(currentToken.tokenSource, source),
                });
            });
        });
        return [...mergedTokens.values()];
    }
    static async parseApiResponse(response, fallbackMessage) {
        const data = await response.json();
        if (!response.ok) {
            const message = (typeof data?.error === 'string' && data.error.trim()) ||
                (typeof data?.message === 'string' && data.message.trim()) ||
                fallbackMessage;
            throw new Error(message);
        }
        if (data?.code !== undefined && data.code !== 200) {
            const message = (typeof data?.error === 'string' && data.error.trim()) ||
                (typeof data?.message === 'string' && data.message.trim()) ||
                fallbackMessage;
            throw new Error(message);
        }
        return data;
    }
    static async getQuote(params) {
        const isNearChain = params.chain === '20000000000006' || params.chain === 'near';
        // Near uses a dedicated API endpoint and parameter format
        if (isNearChain) {
            const nearApiUrl = 'https://ethapi.de1.exchange/v1/near';
            // Build amountAll (formatted amount for display)
            let amountAll = '';
            if (params.inTokenDecimals !== undefined) {
                const amountBigInt = BigInt(params.amount);
                const decimals = BigInt(10 ** params.inTokenDecimals);
                const wholePart = amountBigInt / decimals;
                const fractionalPart = amountBigInt % decimals;
                if (fractionalPart === 0n) {
                    amountAll = wholePart.toString();
                }
                else {
                    const fractionalStr = fractionalPart.toString().padStart(params.inTokenDecimals, '0');
                    // Strip trailing zeros, but keep at least one decimal digit
                    const trimmedFractional = fractionalStr.replace(/0+$/, '') || '0';
                    amountAll = `${wholePart}.${trimmedFractional}`;
                }
            }
            // Convert slippage from 0.01 (1%) to 100 (percent format)
            const slippagePercent = params.slippage
                ? Math.floor(Number(params.slippage) * 100).toString()
                : '100'; // default 1%
            const queryParams = new URLSearchParams({
                quoteType: 'swap',
                inTokenSymbol: params.inTokenSymbol,
                inTokenAddress: params.inTokenAddress,
                outTokenSymbol: params.outTokenSymbol,
                outTokenAddress: params.outTokenAddress,
                amount: params.amount,
                ...(amountAll && { amountAll }),
                slippage: slippagePercent,
                gasPrice: params.gasPrice || '5000000000',
                referrer: params.referrer || '0x3487ef9f9b36547e43268b8f0e2349a226c70b53',
                disabledDexIds: params.disabledDexIds || '',
                disableRfq: '', // Near-only API param
                ...(params.account && { account: params.account }),
            });
            const response = await fetch(`${nearApiUrl}/quote?${queryParams.toString()}`);
            const data = await this.parseApiResponse(response, 'Failed to fetch quote');
            return {
                data,
            };
        }
        // Other chains use the existing flow
        const apiUrl = this.getApiUrl(params.chain);
        const slippage = (Number(params.slippage || 0.01)).toString();
        const queryParams = new URLSearchParams({
            quoteType: 'quote',
            inTokenSymbol: params.inTokenSymbol,
            inTokenAddress: this.getSolanaAddress(params.chain, params.inTokenAddress),
            outTokenSymbol: params.outTokenSymbol,
            outTokenAddress: this.getSolanaAddress(params.chain, params.outTokenAddress),
            amountDecimals: params.amount,
            slippage,
            gasPriceDecimals: params.gasPrice || '',
            disabledDexIds: params.disabledDexIds || '',
            enabledDexIds: params.enabledDexIds || '',
            referrer: params.referrer || '0x3487ef9f9b36547e43268b8f0e2349a226c70b53',
        });
        const response = await fetch(`${apiUrl}/quote?${queryParams.toString()}`);
        return this.parseApiResponse(response, 'Failed to fetch quote');
    }
    static async getSwapQuote(params) {
        const isNearChain = params.chain === '20000000000006' || params.chain === 'near';
        // Near uses a dedicated API endpoint and parameter format
        if (isNearChain) {
            const nearApiUrl = 'https://ethapi.de1.exchange/v1/near';
            // Build amountAll (formatted amount for display)
            let amountAll = '';
            if (params.inTokenDecimals !== undefined) {
                const amountBigInt = BigInt(params.amount);
                const decimals = BigInt(10 ** params.inTokenDecimals);
                const wholePart = amountBigInt / decimals;
                const fractionalPart = amountBigInt % decimals;
                if (fractionalPart === 0n) {
                    amountAll = wholePart.toString();
                }
                else {
                    const fractionalStr = fractionalPart.toString().padStart(params.inTokenDecimals, '0');
                    // Strip trailing zeros, but keep at least one decimal digit
                    const trimmedFractional = fractionalStr.replace(/0+$/, '') || '0';
                    amountAll = `${wholePart}.${trimmedFractional}`;
                }
            }
            // Convert slippage from 0.01 (1%) to 100 (percent format)
            const slippagePercent = params.slippage
                ? Math.floor(Number(params.slippage) * 100).toString()
                : '100'; // default 1%
            const queryParams = new URLSearchParams({
                quoteType: 'swap',
                inTokenSymbol: params.inTokenSymbol,
                inTokenAddress: params.inTokenAddress,
                outTokenSymbol: params.outTokenSymbol,
                outTokenAddress: params.outTokenAddress,
                amount: params.amount,
                ...(amountAll && { amountAll }),
                gasPrice: params.gasPrice || '5000000000',
                disabledDexIds: params.disabledDexIds || '',
                slippage: slippagePercent,
                account: params.account,
                referrer: params.referrer || '0x3487ef9f9b36547e43268b8f0e2349a226c70b53',
                flags: '0', // Near-only API param
                disableRfq: '', // Near-only API param
            });
            const response = await fetch(`${nearApiUrl}/swap-quote?${queryParams.toString()}`);
            const data = await this.parseApiResponse(response, 'Failed to fetch swap quote');
            return {
                data: {
                    ...data,
                    data: data.transaction,
                    price_impact: 0
                }
            };
        }
        // Other chains use the existing flow
        const apiUrl = this.getApiUrl(params.chain);
        const slippage = (Number(params.slippage || 0.01)).toString();
        const referrer = {
            referrer: params.referrer || '0x3487ef9f9b36547e43268b8f0e2349a226c70b53',
        };
        if (params.referrerFee) {
            referrer.referrerFee = Number(params.referrerFee);
            // referrer.referrerFeeShare = params.referrerFeeShare || '1500';
        }
        const queryParams = new URLSearchParams({
            quoteType: 'swap',
            inTokenSymbol: params.inTokenSymbol,
            inTokenAddress: this.getSolanaAddress(params.chain, params.inTokenAddress),
            outTokenSymbol: params.outTokenSymbol,
            outTokenAddress: this.getSolanaAddress(params.chain, params.outTokenAddress),
            amountDecimals: params.amount,
            account: params.account,
            slippage,
            gasPriceDecimals: params.gasPrice || '',
            disabledDexIds: params.disabledDexIds || '',
            enabledDexIds: params.enabledDexIds || '',
            ...referrer,
        });
        // const isV1Api = Object.keys(this.CHAIN_ID_MAP).includes(params.chain.toString())
        // const swapEndpoint = isV1Api ? 'swap-quote' : 'swap'
        const response = await fetch(`${apiUrl}/swap?${queryParams.toString()}`);
        return this.parseApiResponse(response, 'Failed to fetch swap quote');
    }
    static async getTokenList(chain, useRwaTokenList = false) {
        if (!useRwaTokenList) {
            const baseTokenList = await this.fetchTokenList(chain, false);
            return this.mergeTokenLists(chain, [
                { tokens: baseTokenList, source: 'token' },
            ]);
        }
        const [baseResult, rwaResult] = await Promise.allSettled([
            this.fetchTokenList(chain, false),
            this.fetchTokenList(chain, true),
        ]);
        const tokenLists = [];
        if (baseResult.status === 'fulfilled') {
            tokenLists.push({ tokens: baseResult.value, source: 'token' });
        }
        if (rwaResult.status === 'fulfilled') {
            tokenLists.push({ tokens: rwaResult.value, source: 'rwa' });
        }
        if (!tokenLists.length) {
            throw (baseResult.reason ??
                rwaResult.reason ??
                new Error('Failed to fetch token list'));
        }
        return this.mergeTokenLists(chain, tokenLists);
    }
    static async getDexList(chain) {
        const apiUrl = this.getApiUrl(chain);
        const response = await fetch(`${apiUrl}/dexList`);
        return response.json();
    }
    static async getGasPrice(chain) {
        if (!chain || chain === '1151111081099710' || chain === '20000000000001' || chain === '20000000000006') {
            return {
                data: {
                    gasPrice: '1000000000000000000',
                },
            };
        }
        // const apiUrl = this.getApiUrl(chain)
        const response = await fetch(`${this.API_V4_URL}/${chain}/gasPrice`);
        const { data } = await response.json();
        if (chain == '1') {
            return {
                standard: data?.standard?.maxFeePerGas || '101021713',
                instant: data?.instant?.maxFeePerGas || '101021713',
                fast: data?.fast?.maxFeePerGas || '101021713',
            };
        }
        return data;
    }
    static async getTokenInfo(chain, tokenAddress) {
        const chainName = this.getChainName(chain);
        // Check if the address is valid
        if (!tokenAddress || (!/^0x[a-fA-F0-9]{40}$/.test(tokenAddress) && !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(tokenAddress))) {
            throw new Error('Invalid token address');
        }
        const response = await fetch(`${this.API_V4_URL}/${chainName}/getTokenInfo?tokenAddress=${tokenAddress}`);
        const data = await response.json();
        if (!data || !data.address || !data.symbol || !data.decimals) {
            throw new Error('Failed to fetch token info');
        }
        return {
            address: data.address,
            symbol: data.symbol,
            decimals: data.decimals,
            name: data.name,
            logoURI: data.icon,
            priceUSD: data.usd,
            chainId: Number(chain),
            amount: 0n,
            featured: false,
            popular: false
        };
    }
    /**
     * Get prices for specified tokens
     * @param chain chain name, e.g. 'arbitrum'
     * @param tokenAddresses array of token addresses
     * @returns Promise<Record<string, string>> returns an object where key is token address and value is price
     */
    static async getTokensPrice(chain, tokenAddresses) {
        let chainName = this.getChainName(chain);
        if (chain === '20000000000001') {
            tokenAddresses = ['0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'];
            chainName = '1';
        }
        const tokenAddressesStr = tokenAddresses.join(',');
        const response = await fetch(`${this.API_V3_URL}/${chainName}/designated_tokenList?tokens=${tokenAddressesStr}`);
        const data = await response.json();
        if (data.code !== 200) {
            throw new Error('Failed to fetch token prices');
        }
        const prices = data.data.reduce((acc, token) => {
            if (token.address && token.usd) {
                if (chain === '20000000000001') {
                    acc.bitcoin = token.usd;
                }
                else {
                    acc[token.address.toLowerCase()] = token.usd;
                }
            }
            return acc;
        }, {});
        return prices;
    }
    static async getRpcUrl() {
        if (this.solanaRpcUrl) {
            return this.solanaRpcUrl;
        }
        let url = `${this.API_V3_URL}/solana/getRpc`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.data?.openapi_v1) {
            let rpcUrl = data.data?.openapi_v1?.[0] || '';
            this.solanaRpcUrl = rpcUrl;
        }
        if (data.data?.openapi_v2) {
            let rpcUrl = data.data?.openapi_v2?.[0] || '';
            this.solanaRpcUrl = rpcUrl;
        }
        if (data.data?.openapi_v3) {
            let rpcUrl = data.data?.openapi_v3?.[0] || '';
            this.solanaRpcUrl = rpcUrl;
        }
        return this.solanaRpcUrl;
    }
}
// private static readonly API_V1_URL = 'https://ethapi.de1.exchange/v1'
//private static readonly API_V2_URL = 'https://ethapi.de1.exchange/v2'
De1Service.API_V3_URL = 'https://open-api.de1.exchange/v3';
De1Service.API_V4_URL = 'https://open-api.de1.exchange/v4';
De1Service.solanaRpcUrl = '';
// Chain ID to De¹ Exchange chain name mapping
De1Service.CHAIN_ID_MAP = {
    1151111081099710: 'solana', // Solana mainnet
    20000000000001: 'bitcoin', // Bitcoin mainnet
    20000000000006: 'near', // Near mainnet
};
De1Service.getRpcUrl().then((rpcUrl) => {
});
//# sourceMappingURL=De1Service.js.map