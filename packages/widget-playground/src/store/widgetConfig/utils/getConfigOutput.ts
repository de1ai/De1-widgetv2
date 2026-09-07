import type { WidgetConfig, WidgetTheme } from '@de1/widget'
import { defaultMaxHeight } from '@de1/widget'

export const getConfigOutput = (
  config: Partial<WidgetConfig>
): Partial<WidgetConfig> => {
  const { playground, ...theme } = config.theme as WidgetTheme

  return {
    ...(config.variant ? { variant: config.variant } : {}),
    ...(config.subvariant ? { subvariant: config.subvariant } : {}),
    ...(config.appearance ? { appearance: config.appearance } : {}),
    ...(config.evmReferrer ? { evmReferrer: config.evmReferrer } : {}),
    ...(config.solanaReferrer ? { solanaReferrer: config.solanaReferrer } : {}),
    ...(config.referrer && !config.evmReferrer ? { referrer: config.referrer } : {}),
    ...(config.slippage ? { slippage: config.slippage } : {}),
    ...(theme
      ? {
          theme: {
            ...theme,
            ...(theme.container
              ? {
                  container: {
                    ...theme.container,
                    ...(theme.container.maxHeight &&
                    theme.container.maxHeight !== defaultMaxHeight
                      ? { maxHeight: theme.container.maxHeight }
                      : { maxHeight: undefined }),
                  },
                }
              : {}),
          },
        }
      : {}),
    ...(config.walletConfig ? { walletConfig: config.walletConfig } : {}),
    ...(config.chains ? { chains: config.chains } : {}),
    ...(config.defaultChain ? { defaultChain: config.defaultChain } : {}),
    ...(config.defaultFromToken ? { defaultFromToken: config.defaultFromToken } : {}),
    ...(config.defaultToToken ? { defaultToToken: config.defaultToToken } : {}),
    ...(config.isRwaTokenEnabled ? { isRwaTokenEnabled: config.isRwaTokenEnabled } : {}),
  } as Partial<WidgetConfig>
}
