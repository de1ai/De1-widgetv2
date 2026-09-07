# De¹ Exchange Widget Integration Guide

This guide provides step-by-step instructions for integrating De¹ Exchange Widget into different frameworks and setups.

## Table of Contents

- [Vite + React](#vite--react)
- [Next.js (App Router)](#nextjs-app-router)
- [Next.js (Pages Router)](#nextjs-pages-router)
- [Vue 3](#vue-3)
- [Nuxt 3](#nuxt-3)
- [Svelte](#svelte)
- [Remix](#remix)
- [RainbowKit](#rainbowkit)
- [ConnectKit](#connectkit)
- [Privy](#privy)
- [Privy + Ethers](#privy--ethers)
- [Reown (WalletConnect)](#reown-walletconnect)
- [Dynamic](#dynamic)
- [Zustand Widget Config](#zustand-widget-config)
- [Deposit Flow](#deposit-flow)

---

## Vite + React

### Installation

```bash
npm install @de1/widget @de1/wallet-management
npm install @tanstack/react-query wagmi viem
npm install --save-dev vite-plugin-node-polyfills
```

### Configuration

**vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer', 'process'],
    }),
  ],
})
```

### Usage

**src/App.tsx**

```tsx
import { De1Widget } from '@de1/widget'

export function App() {
  return (
    <De1Widget
      integrator="vite-example"
      config={{
        buildUrl: false,
        subvariant: 'split',
        theme: {
          container: {
            border: '1px solid rgb(234, 234, 234)',
            borderRadius: '16px',
          },
        },
      }}
    />
  )
}
```

### Key Points

- Requires `vite-plugin-node-polyfills` for Node.js polyfills
- Basic React integration without wallet management
- Can be extended with wallet providers

---

## Next.js (App Router)

### Installation

```bash
npm install @de1/widget @de1/widget-sdk
npm install @mui/material-nextjs
```

### Configuration

**next.config.js**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@de1/widget'],
}

module.exports = nextConfig
```

### Usage

**app/page.tsx**

```tsx
import { Widget } from '@/components/Widget'

export default function Home() {
  return (
    <main>
      <Widget />
    </main>
  )
}
```

**components/Widget.tsx**

```tsx
'use client'

import type { WidgetConfig } from '@de1/widget'
import { De1Widget, WidgetSkeleton } from '@de1/widget'
import { ClientOnly } from './ClientOnly'

export function Widget() {
  const config = {
    appearance: 'light',
    theme: {
      container: {
        border: '1px solid rgb(234, 234, 234)',
        borderRadius: '16px',
      },
    },
  } as Partial<WidgetConfig>

  return (
    <ClientOnly fallback={<WidgetSkeleton config={config} />}>
      <De1Widget config={config} integrator="nextjs-example" />
    </ClientOnly>
  )
}
```

**components/ClientOnly.tsx**

```tsx
'use client'

import { useEffect, useState } from 'react'

export function ClientOnly({ children, fallback = null }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return fallback
  }

  return children
}
```

### Key Points

- Use `'use client'` directive for client components
- Implement `ClientOnly` wrapper to prevent SSR issues
- Use `WidgetSkeleton` as fallback during SSR
- Configure `transpilePackages` in `next.config.js`

---

## Next.js (Pages Router)

### Installation

Same as Next.js App Router.

### Usage

**pages/index.tsx**

```tsx
import { Widget } from '@/components/Widget'

export default function Home() {
  return (
    <main>
      <Widget />
    </main>
  )
}
```

**components/Widget.tsx**

Same implementation as App Router, but without `'use client'` directive (not needed in Pages Router).

### Key Points

- Similar to App Router but uses `pages/` directory
- No need for `'use client'` directive
- Still requires `ClientOnly` wrapper for SSR safety

---

## Vue 3

### Installation

```bash
npm install @de1/widget veaury
npm install --save-dev @vitejs/plugin-react @vitejs/plugin-vue
```

### Configuration

**vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    vue(),
    react(),
    nodePolyfills(),
  ],
})
```

### Usage

**src/components/Widget.vue**

```vue
<template>
  <Widget :config="config" />
</template>

<script lang="ts">
import { De1Widget } from '@de1/widget'
import { applyPureReactInVue } from 'veaury'

export default {
  components: {
    Widget: applyPureReactInVue(De1Widget),
  },
  setup() {
    return {
      config: {
        theme: {
          container: {
            border: '1px solid rgb(234, 234, 234)',
            borderRadius: '16px',
          },
        },
        integrator: 'vue-example',
      },
    }
  },
}
</script>
```

### Key Points

- Uses `veaury` to bridge React and Vue components
- Requires both Vue and React plugins in Vite
- Use `applyPureReactInVue` or `applyReactInVue` HOC

---

## Nuxt 3

### Installation

```bash
npm install @de1/widget veaury
```

### Configuration

**nuxt.config.ts**

```typescript
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ssr: false, // Widget requires client-side rendering
})
```

### Usage

**components/WidgetContainer.vue**

```vue
<template>
  <Widget :config="config" />
</template>

<script lang="ts">
import { De1Widget } from '@de1/widget'
import { applyPureReactInVue } from 'veaury'

export default {
  components: {
    Widget: applyPureReactInVue(De1Widget),
  },
  setup() {
    return {
      config: {
        theme: {
          container: {
            border: '1px solid rgb(234, 234, 234)',
            borderRadius: '16px',
          },
        },
        integrator: 'nuxt-example',
      },
    }
  },
}
</script>
```

**app.vue**

```vue
<template>
  <ClientOnly>
    <WidgetContainer />
  </ClientOnly>
</template>
```

### Key Points

- Use `ClientOnly` component for SSR safety
- Disable SSR or use client-only rendering
- Same Vue-React bridge approach as Vue 3

---

## Svelte

### Installation

```bash
npm install @de1/widget
npm install --save-dev @vitejs/plugin-react @vitejs/plugin-svelte
```

### Configuration

**vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [svelte(), react()],
})
```

### Usage

**src/lib/De1Widget.svelte**

```svelte
<script>
import { De1Widget } from '@de1/widget'
import ReactAdapter from './ReactAdapter.svelte'
</script>

<ReactAdapter
  element={De1Widget}
  config={{
    theme: {
      container: {
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
        borderRadius: '16px',
      },
    },
  }}
  integrator="svelte-example"
/>
```

**src/lib/ReactAdapter.svelte**

You'll need a React adapter component. Check the example for the full implementation.

### Key Points

- Requires a React adapter to use React components in Svelte
- Both Svelte and React plugins needed
- Custom adapter implementation required

---

## Remix

### Installation

```bash
npm install @de1/widget @tanstack/react-query
```

### Configuration

**remix.config.js**

```javascript
/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverModuleFormat: 'esm',
  future: {
    v2_errorBoundary: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
}
```

### Usage

**app/routes/_index.tsx**

```tsx
import { ClientOnly } from 'remix-utils/client-only'
import { Fallback } from '../components/Fallback'
import { De1Widget } from '../components/De1Widget'

export default function Index() {
  return (
    <ClientOnly fallback={<Fallback />}>
      {() => <De1Widget />}
    </ClientOnly>
  )
}
```

**app/components/De1Widget.tsx**

```tsx
import { De1Widget } from '@de1/widget'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../lib/queryClient'

export function De1Widget() {
  return (
    <QueryClientProvider client={queryClient}>
      <De1Widget
        integrator="remix-example"
        config={{
          theme: {
            container: {
              border: '1px solid rgb(234, 234, 234)',
              borderRadius: '16px',
            },
          },
        }}
      />
    </QueryClientProvider>
  )
}
```

### Key Points

- Requires React Query provider
- Server-side rendering support
- Configure Remix for ES modules

---

## RainbowKit

### Installation

```bash
npm install @de1/widget @rainbow-me/rainbowkit wagmi viem
npm install @tanstack/react-query
```

### Configuration

**src/config/wagmi.ts**

```typescript
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'De¹ Exchange Widget Example',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
})
```

### Usage

**src/App.tsx**

```tsx
import { De1Widget } from '@de1/widget'
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { config } from './config/wagmi'
import { queryClient } from './config/queryClient'

export default function App() {
  const { openConnectModal } = useConnectModal()
  
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ConnectButton chainStatus="none" />
          <De1Widget
            config={{
              walletConfig: {
                onConnect() {
                  openConnectModal?.()
                },
              },
              theme: {
                container: {
                  boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
                  borderRadius: '16px',
                },
              },
            }}
            integrator="rainbowkit-example"
          />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

### Key Points

- Integrates with RainbowKit wallet connection
- Uses `walletConfig.onConnect` to trigger RainbowKit modal
- Requires Wagmi and React Query setup

---

## ConnectKit

### Installation

```bash
npm install @de1/widget @de1/wallet-management
npm install connectkit wagmi viem @tanstack/react-query
```

### Configuration

**src/config/queryClient.ts**

```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()
```

**src/providers/WalletProvider.tsx**

Set up ConnectKit wallet provider. See example for full implementation.

### Usage

**src/App.tsx**

```tsx
import { De1Widget } from '@de1/widget'
import { QueryClientProvider } from '@tanstack/react-query'
import { WalletProvider } from './providers/WalletProvider'
import { queryClient } from './config/queryClient'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <De1Widget
          integrator="widget-connectkit-example"
          config={{
            theme: {
              container: {
                border: '1px solid rgb(234, 234, 234)',
                borderRadius: '16px',
              },
            },
          }}
        />
      </WalletProvider>
    </QueryClientProvider>
  )
}
```

### Key Points

- Uses De¹ Exchange's wallet-management package
- Integrates with ConnectKit
- Requires QueryClient setup

---

## Privy

### Installation

```bash
npm install @de1/widget @privy-io/react-auth
npm install @tanstack/react-query
```

### Configuration

**src/config/queryClient.ts**

```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()
```

### Usage

**src/App.tsx**

```tsx
import { De1Widget } from '@de1/widget'
import { PrivyProvider } from '@privy-io/react-auth'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './config/queryClient'

function App() {
  return (
    <PrivyProvider
      appId="YOUR_PRIVY_APP_ID"
      config={{
        loginMethods: ['wallet', 'email', 'sms'],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <De1Widget
          integrator="privy-example"
          config={{
            theme: {
              container: {
                border: '1px solid rgb(234, 234, 234)',
                borderRadius: '16px',
              },
            },
          }}
        />
      </QueryClientProvider>
    </PrivyProvider>
  )
}
```

### Key Points

- Integrates with Privy authentication
- Supports multiple login methods
- Requires Privy app ID

---

## Privy + Ethers

### Installation

```bash
npm install @de1/widget @privy-io/react-auth ethers
npm install @tanstack/react-query
```

### Usage

Similar to Privy example but with Ethers.js integration for wallet operations.

### Key Points

- Extends Privy with Ethers.js
- Provides more wallet control
- See example for wallet provider implementation

---

## Reown (WalletConnect)

### Installation

```bash
npm install @de1/widget @reown/appkit @reown/appkit-adapter-wagmi
npm install wagmi viem @tanstack/react-query
```

### Configuration

**src/config/wagmi.ts**

```typescript
import { createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

const metadata = {
  name: 'De¹ Exchange Widget',
  description: 'De¹ Exchange Widget Example',
  url: 'https://de1.exchange',
  icons: ['https://de1.exchange/favicon.ico'],
}

const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

createAppKit({
  adapters: [wagmiAdapter],
  chains: [mainnet, sepolia],
  projectId: 'YOUR_PROJECT_ID',
  metadata,
})
```

### Usage

**src/App.tsx**

```tsx
import { De1Widget } from '@de1/widget'
import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { config } from './config/wagmi'
import { queryClient } from './config/queryClient'

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <De1Widget
          integrator="reown-example"
          config={{
            theme: {
              container: {
                border: '1px solid rgb(234, 234, 234)',
                borderRadius: '16px',
              },
            },
          }}
        />
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

### Key Points

- Uses Reown (WalletConnect v4)
- Requires project ID from WalletConnect Cloud
- Full Wagmi integration

---

## Dynamic

### Installation

```bash
npm install @de1/widget @dynamic-labs/sdk-react-core
npm install @tanstack/react-query
```

### Configuration

**src/config/dynamic.ts**

```typescript
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'

export const dynamicConfig = {
  environmentId: 'YOUR_ENVIRONMENT_ID',
}
```

### Usage

**src/App.tsx**

```tsx
import { De1Widget } from '@de1/widget'
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './config/queryClient'
import { dynamicConfig } from './config/dynamic'

function App() {
  return (
    <DynamicContextProvider settings={dynamicConfig}>
      <QueryClientProvider client={queryClient}>
        <De1Widget
          integrator="dynamic-example"
          config={{
            theme: {
              container: {
                border: '1px solid rgb(234, 234, 234)',
                borderRadius: '16px',
              },
            },
          }}
        />
      </QueryClientProvider>
    </DynamicContextProvider>
  )
}
```

### Key Points

- Integrates with Dynamic Labs wallet SDK
- Requires environment ID
- Supports multiple wallet types

---

## Zustand Widget Config

### Installation

```bash
npm install @de1/widget zustand
npm install @mui/material
```

### Usage

This example demonstrates using Zustand for widget configuration state management with form controls.

**src/store/createWidgetConfigStore.ts**

```typescript
import { create } from 'zustand'
import type { WidgetConfig } from '@de1/widget'

interface WidgetConfigState {
  config: Partial<WidgetConfig>
  setConfig: (config: Partial<WidgetConfig>) => void
  setFormValues: (formValues: Partial<WidgetConfig>) => void
}

export const useWidgetConfigStore = create<WidgetConfigState>((set, get) => ({
  config: {
    buildUrl: true,
    theme: {
      container: {
        border: '1px solid rgb(234, 234, 234)',
        borderRadius: '16px',
      },
    },
  },
  setConfig: (config) => set({ config }),
  setFormValues: (formValues) => {
    const currentConfig = get().config ?? {}
    // Remove updatable form values
    const { fromAmount, fromChain, fromToken, toAddress, toChain, toToken, ...rest } = currentConfig
    set({
      config: {
        ...rest,
        ...formValues,
      },
    })
  },
}))
```

**src/App.tsx**

```tsx
import { Box } from '@mui/material'
import { FormControls } from './components/FormControls'
import { WidgetView } from './components/WidgetView'

function App() {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <FormControls />
      <WidgetView />
    </Box>
  )
}
```

**src/components/WidgetView.tsx**

```tsx
import { De1Widget } from '@de1/widget'
import { useWidgetConfigStore } from '../store/createWidgetConfigStore'

export function WidgetView() {
  const config = useWidgetConfigStore((state) => state.config)

  return (
    <De1Widget
      integrator="zustand-example"
      config={config}
    />
  )
}
```

### Key Points

- Uses Zustand for state management
- Separates form controls from widget view
- Allows dynamic widget configuration updates
- Good for complex state management scenarios
- Supports form value updates without affecting other config

---

## Deposit Flow

### Installation

```bash
npm install @de1/widget
```

### Usage

This example demonstrates a deposit flow integration with custom contract calls and deposit card.

**src/App.tsx**

```tsx
import type { ContractCall, WidgetConfig } from '@de1/widget'
import {
  ChainType,
  CoinKey,
  DisabledUI,
  HiddenUI,
  De1Widget,
} from '@de1/widget'
import { useMemo } from 'react'
import { DepositCard } from './components/DepositCard'
import { contractTool } from './config'

const depositAddress = '0x4bF3E32de155359D1D75e8B474b66848221142fc'
const contractCalls: ContractCall[] = []

export function App() {
  const widgetConfig: WidgetConfig = useMemo(() => {
    return {
      toAddress: {
        ...contractTool,
        address: depositAddress,
        chainType: ChainType.EVM,
      },
      subvariant: 'custom',
      subvariantOptions: { custom: 'deposit' },
      integrator: 'ProtocolName',
      disabledUI: [DisabledUI.ToAddress],
      hiddenUI: [HiddenUI.Appearance, HiddenUI.Language],
      useRecommendedRoute: true,
      theme: {
        container: {
          border: '1px solid rgb(234, 234, 234)',
          borderRadius: '16px',
        },
      },
    }
  }, [])

  return (
    <De1Widget
      contractComponent={
        <DepositCard
          token={{
            chainId: 10,
            address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
            symbol: 'USDC',
            name: 'USD Coin',
            decimals: 6,
            priceUSD: '1',
            coinKey: CoinKey.USDC,
            logoURI: '...',
          }}
          contractCalls={contractCalls}
        />
      }
      contractTool={contractTool}
      config={widgetConfig}
      integrator={widgetConfig.integrator}
    />
  )
}
```

### Key Points

- Custom deposit flow with contract calls
- Uses `subvariant: 'custom'` with `custom: 'deposit'`
- Custom `contractComponent` for deposit UI
- Disables and hides specific UI elements
- Requires `contractTool` configuration

---

## Common Configuration Options

All examples support these common configuration options:

```typescript
{
  integrator: string, // Required: Your integrator identifier
  variant?: 'wide' | 'compact' | 'drawer',
  subvariant?: 'split' | 'bridge' | 'swap',
  appearance?: 'light' | 'dark' | 'auto',
  theme?: {
    container?: {
      border?: string,
      borderRadius?: string,
      boxShadow?: string,
    },
    // ... more theme options
  },
  chains?: {
    allow?: number[],
    deny?: number[],
  },
  buildUrl?: boolean,
  // ... more config options
}
```

## Troubleshooting

### SSR Issues

- Use `ClientOnly` wrapper in Next.js/Nuxt
- Disable SSR if not needed
- Use `WidgetSkeleton` as fallback

### Wallet Connection Issues

- Ensure wallet providers are properly configured
- Check network/chain configurations
- Verify API keys and project IDs

### Build Issues

- Install required polyfills (buffer, process)
- Configure Vite/Rollup for React components
- Check transpilePackages in Next.js config

## Support

For more information, visit:
- [De¹ Exchange Documentation](https://docs.de1.exchange/docs/widget/overview)
- [GitHub Repository](https://github.com/de1-exchange/de1-widget-v2/tree/main/Widget_V2-examples)
