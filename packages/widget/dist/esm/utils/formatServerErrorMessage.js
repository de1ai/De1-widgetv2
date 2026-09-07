const CHAIN_LABEL_IN_ERROR_REGEX = /\b(Destination|Origin|Source) chain (\d+)\b/gi;
export const formatServerErrorMessage = (message, getChainById) => {
    if (!message) {
        return message;
    }
    return message.replace(CHAIN_LABEL_IN_ERROR_REGEX, (_match, label, chainId) => {
        const chain = getChainById(Number(chainId));
        const chainName = chain?.name ?? chainId;
        return `${label} chain ${chainName}`;
    });
};
//# sourceMappingURL=formatServerErrorMessage.js.map