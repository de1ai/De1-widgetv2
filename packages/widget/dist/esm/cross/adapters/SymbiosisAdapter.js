import { ChainId } from '@de1/widget-sdk';
import { formatUnits } from 'viem';
import { ZERO_ADDRESS } from '../constants/index.js';
import { BaseSwapAdapter, } from './BaseSwapAdapter.js';
const SYMBIOSIS_API = 'https://api.symbiosis.finance/crosschain/v1';
export class SymbiosisAdapter extends BaseSwapAdapter {
    constructor() {
        super();
    }
    getName() {
        return 'Symbiosis';
    }
    getIcon() {
        return 'https://app.symbiosis.finance/images/favicon-32x32.png';
    }
    getSupportedChains() {
        return [
            ChainId.ETH,
            ChainId.BAS,
            ChainId.POL,
            ChainId.AVA,
            // ChainId.ZKSYNC,
            ChainId.ARB,
            ChainId.OPT,
            ChainId.LNA,
            ChainId.BAS,
            ChainId.SCL,
            ChainId.BLS,
            ChainId.UNI,
        ];
    }
    getSupportedTokens(_sourceChain, _destChain) {
        return [];
    }
    async getQuote(params) {
        const body = {
            tokenAmountIn: {
                address: params.fromToken.isNative ? '' : params.fromToken.address,
                amount: params.amount,
                chainId: params.fromChain,
                decimals: params.fromToken.decimals,
            },
            tokenOut: {
                chainId: params.toChain,
                address: params.toToken.isNative ? '' : params.toToken.address,
                symbol: params.toToken.symbol,
                decimals: params.toToken.decimals,
            },
            from: params.sender,
            to: params.recipient,
            slippage: params.slippage,
        };
        const res = await fetch(`${SYMBIOSIS_API}/swap`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }).then(r => r.json());
        if (!res.tx)
            throw new Error('No route found');
        const formattedOutputAmount = formatUnits(BigInt(res.tokenAmountOut.amount), params.toToken.decimals);
        const formattedInputAmount = formatUnits(BigInt(params.amount), params.fromToken.decimals);
        const tokenInUsd = params.tokenInUsd;
        const tokenOutUsd = params.tokenOutUsd;
        const inputUsd = tokenInUsd * +formattedInputAmount;
        const outputUsd = tokenOutUsd * +formattedOutputAmount;
        return {
            quoteParams: params,
            outputAmount: BigInt(res.tokenAmountOut.amount),
            formattedOutputAmount,
            inputUsd,
            outputUsd,
            priceImpact: !inputUsd || !outputUsd ? NaN : ((inputUsd - outputUsd) * 100) / inputUsd,
            rate: +formattedOutputAmount / +formattedInputAmount,
            gasFeeUsd: 0,
            timeEstimate: res.estimatedTime,
            contractAddress: res.approveTo || ZERO_ADDRESS,
            rawQuote: res,
            // TODO: add Fee
            protocolFee: 0,
            platformFeePercent: 0,
        };
    }
    async executeSwap({ quote }, walletClient) {
        const account = walletClient.account?.address;
        if (!account)
            throw new Error('WalletClient account is not defined');
        const tx = await walletClient.sendTransaction({
            chain: undefined,
            account,
            to: quote.rawQuote.tx.to,
            value: BigInt(quote.rawQuote.tx.value),
            data: quote.rawQuote.tx.data,
            kzg: undefined,
        });
        return {
            sender: quote.quoteParams.sender,
            id: tx, // specific id for each provider
            sourceTxHash: tx,
            adapter: this.getName(),
            sourceChain: quote.quoteParams.fromChain,
            targetChain: quote.quoteParams.toChain,
            inputAmount: quote.quoteParams.amount,
            outputAmount: quote.outputAmount.toString(),
            sourceToken: quote.quoteParams.fromToken,
            targetToken: quote.quoteParams.toToken,
            timestamp: new Date().getTime(),
        };
    }
    async getTransactionStatus(p) {
        const res = await fetch(`${SYMBIOSIS_API}/tx/${p.sourceChain}/${p.sourceTxHash}`).then(r => r.json());
        return {
            txHash: res?.tx?.hash || '',
            status: res.status.code === 0 ? 'Success' : res.status.code === 3 ? 'Failed' : 'Processing',
        };
    }
}
//# sourceMappingURL=SymbiosisAdapter.js.map