import { De1ToolLogo } from '../icons/de1.js';
export const defaultMetaMaskConfig = {
    dappMetadata: {
        name: 'De¹ Exchange',
        url: typeof window !== 'undefined'
            ? window?.location.href
            : 'https://de1.exchange/',
        base64Icon: De1ToolLogo,
    },
};
//# sourceMappingURL=metaMask.js.map