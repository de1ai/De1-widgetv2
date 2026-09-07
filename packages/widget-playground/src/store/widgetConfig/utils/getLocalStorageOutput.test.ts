import type { WidgetConfig } from '@de1/widget'
import { describe, expect, test } from 'vitest'
import { getLocalStorageOutput } from './getLocalStorageOutput'

describe('getLocalStorageOutput', () => {
  test('presents copy of the config with a variant property if present', () => {
    const config = {
      variant: 'wide',
    } as Partial<WidgetConfig>

    const whitelistedConfig = getLocalStorageOutput(config)

    expect(whitelistedConfig).toEqual({
      variant: 'wide',
    })
  })

  test('presents copy of the config with a subvariant property if present', () => {
    const config = {
      subvariant: 'split',
    } as Partial<WidgetConfig>

    const whitelistedConfig = getLocalStorageOutput(config)

    expect(whitelistedConfig).toEqual({
      subvariant: 'split',
    })
  })

  test('presents copy of the config with a appearance property if present', () => {
    const config = {
      appearance: 'auto',
    } as Partial<WidgetConfig>

    const whitelistedConfig = getLocalStorageOutput(config)

    expect(whitelistedConfig).toEqual({
      appearance: 'auto',
    })
  })

  test('presents copy of the config with a primary main color property if present', () => {
    const config = {
      theme: {
        palette: {
          primary: {
            main: '#5C67FF',
          },
          secondary: {
            main: '#F5B5FF',
          },
          common: {
            black: '#000000',
          },
        },
      },
    } as Partial<WidgetConfig>

    const whitelistedConfig = getLocalStorageOutput(config)

    expect(whitelistedConfig).toEqual({
      theme: {
        palette: {
          primary: {
            main: '#5C67FF',
          },
          secondary: {
            main: '#F5B5FF',
          },
          common: {
            black: '#000000',
          },
        },
      },
    })
  })

  test('presents copy of the config with a typography fontFamily property if present', () => {
    const config = {
      theme: {
        typography: {
          fontFamily: 'Inter, sans-serif',
        },
      },
    } as Partial<WidgetConfig>

    const whitelistedConfig = getLocalStorageOutput(config)

    expect(whitelistedConfig).toEqual({
      theme: {
        typography: {
          fontFamily: 'Inter, sans-serif',
        },
      },
    })
  })

  test('presents copy of the config with a shape borderRadius property if present', () => {
    const config = {
      theme: {
        shape: {
          borderRadius: 8,
        },
      },
    } as Partial<WidgetConfig>

    const whitelistedConfig = getLocalStorageOutput(config)

    expect(whitelistedConfig).toEqual({
      theme: {
        shape: {
          borderRadius: 8,
        },
      },
    })
  })

  test('presents copy of the config with a shape borderRadiusSecondary property if present', () => {
    const config = {
      theme: {
        shape: {
          borderRadiusSecondary: 12,
        },
      },
    } as Partial<WidgetConfig>

    const whitelistedConfig = getLocalStorageOutput(config)

    expect(whitelistedConfig).toEqual({
      theme: {
        shape: {
          borderRadiusSecondary: 12,
        },
      },
    })
  })

  test('presents copy of the config with a walletConfig property if present', () => {
    const config = {
      walletConfig: {},
    } as Partial<WidgetConfig>

    const whitelistedConfig = getLocalStorageOutput(config)

    expect(whitelistedConfig).toEqual({
      walletConfig: {},
    })
  })

  test('presents copy of the config with evmReferrer and solanaReferrer if present', () => {
    const config = {
      evmReferrer: {
        address: '0x1234567890123456789012345678901234567890',
        fee: '0.1',
      },
      solanaReferrer: {
        address: 'yEVG5DpokLuVRAqoWeKJANBY2wynzgTSXUbGz7aDKBq',
        fee: '0.5',
      },
    } as Partial<WidgetConfig>

    const whitelistedConfig = getLocalStorageOutput(config)

    expect(whitelistedConfig).toEqual({
      evmReferrer: {
        address: '0x1234567890123456789012345678901234567890',
        fee: '0.1',
      },
      solanaReferrer: {
        address: 'yEVG5DpokLuVRAqoWeKJANBY2wynzgTSXUbGz7aDKBq',
        fee: '0.5',
      },
    })
  })

  test('presents copy of the config with a legacy referrer property if present', () => {
    const config = {
      referrer: {
        address: '0x1234567890123456789012345678901234567890',
        fee: '1.0',
      },
    } as Partial<WidgetConfig>

    const whitelistedConfig = getLocalStorageOutput(config)

    expect(whitelistedConfig).toEqual({
      referrer: {
        address: '0x1234567890123456789012345678901234567890',
        fee: '1.0',
      },
    })
  })

  test('presents copy of the config with isRwaTokenEnabled if present', () => {
    const config = {
      isRwaTokenEnabled: true,
    } as Partial<WidgetConfig>

    const whitelistedConfig = getLocalStorageOutput(config)

    expect(whitelistedConfig).toEqual({
      isRwaTokenEnabled: true,
    })
  })

  test('presents an object removing config items not supported by the playground editor', () => {
    const config = {
      bridges: {
        allow: ['stargate'],
        deny: ['connext'],
      },
    } as Partial<WidgetConfig>

    const whitelistedConfig = getLocalStorageOutput(config)

    expect(whitelistedConfig).toEqual({})
  })
})
