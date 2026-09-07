import type { MetaMaskParameters } from 'wagmi/connectors'
import { De1ToolLogo } from '../icons/de1.js'

export const defaultMetaMaskConfig: MetaMaskParameters = {
  dappMetadata: {
    name: 'De¹ Exchange',
    url:
      typeof window !== 'undefined'
        ? (window as any)?.location.href
        : 'https://de1.exchange/',
    base64Icon: De1ToolLogo,
  },
}
