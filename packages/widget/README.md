# De¹ Widget

De¹ Exchange cross-chain swap and bridge widget. Embed Swap / Bridge into any web app, with wallets on EVM, Solana, Bitcoin, NEAR, and more.

- Product site: [de1.exchange](https://de1.exchange)
- Integration docs: [docs.de1.exchange/docs/widget/overview](https://docs.de1.exchange/docs/widget/overview)
- Live demo: [widget-v2.de1.exchange](https://widget-v2.de1.exchange)
- Support: [t.me/De1_Exchange](https://t.me/De1_Exchange)

---

## Features

- **Same-chain swap** and **cross-chain bridge**, with aggregated quotes
- **Ready-to-use UI**: token selection, wallet connect, transaction progress, history
- **Multi-chain wallets**: MetaMask, WalletConnect, Coinbase, Solana, UTXO, NEAR
- **Customizable**: theme, layout, language, chain/token allowlists, fees, and referrer codes
- **Observable**: transaction lifecycle events for analytics and risk control
- **Framework examples**: React, Next.js, Vue, Nuxt, Svelte, Remix, plus RainbowKit / Privy / Dynamic wallet stacks

## Packages

This repo is a pnpm monorepo. The public npm packages are:

| Package | Description |
| --- | --- |
| [`@de1/widget`](packages/widget) | React Widget — the primary integration package |
| [`@de1/widget-sdk`](packages/widget-sdk) | Headless SDK for quotes, balances, and route execution |
| [`@de1/wallet-management`](packages/wallet-management) | Wallet connection and account management |
| [`@de1/widget-types`](packages/widget-types) | Shared TypeScript types |

Current versions: `@de1/widget@1.0.3`, `@de1/widget-sdk@1.0.1`, `@de1/wallet-management@1.0.2`, `@de1/widget-types@1.0.1`.

---

## Quick start

### 1. Install

```bash
npm install @de1/widget
# or
pnpm add @de1/widget
```

Peer dependencies (provided by the host app):

```bash
npm install react react-dom @tanstack/react-query wagmi @bigmi/react @solana/wallet-adapter-react
```

| Dependency | Version |
| --- | --- |
| `react` / `react-dom` | >= 18 |
| `wagmi` | ^2.14.0 |
| `@tanstack/react-query` | ^5.62.0 |
| `@bigmi/react` | >= 0.1.0 |
| `@solana/wallet-adapter-react` | ^0.15.35 |

Vite projects also need Node polyfills:

```bash
npm install -D vite-plugin-node-polyfills
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({ include: ['buffer', 'process'] }),
  ],
})
```

### 2. Render the Widget

`integrator` is **required** and identifies the integrator. Use a stable English identifier such as a product name or domain.

```tsx
import { De1Widget } from '@de1/widget'

export function App() {
  return (
    <De1Widget
      integrator="your-app-name"
      config={{
        variant: 'compact',
        appearance: 'auto',
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

Next.js App Router must render on the client. Use `WidgetSkeleton` as an SSR placeholder:

```tsx
'use client'

import { De1Widget, WidgetSkeleton } from '@de1/widget'
import { useEffect, useState } from 'react'

export function Widget() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const config = {
    appearance: 'light' as const,
    theme: { container: { borderRadius: '16px' } },
  }

  if (!mounted) {
    return <WidgetSkeleton config={config} />
  }

  return <De1Widget integrator="your-app-name" config={config} />
}
```

Add this to `next.config.js`:

```js
module.exports = {
  transpilePackages: ['@de1/widget'],
}
```

---

## Common configuration

`De1Widget` accepts both top-level props and a `config` object; they are merged. See [`WidgetConfig`](packages/widget/src/types/widget.ts) for the full type.

### Layout and mode

| Field | Values | Description |
| --- | --- | --- |
| `variant` | `'compact'` \| `'wide'` \| `'drawer'` | Card / wide / drawer |
| `subvariant` | `'default'` \| `'swap'` \| `'bridge'` \| `'split'` \| `'custom'` \| `'refuel'` | Product mode |
| `appearance` | `'light'` \| `'dark'` \| `'auto'` | Color scheme |
| `buildUrl` | `boolean` | Sync form state to the URL |

Swap-only or bridge-only:

```tsx
<De1Widget integrator="your-app-name" config={{ subvariant: 'swap' }} />
<De1Widget integrator="your-app-name" config={{ subvariant: 'bridge' }} />
```

Control the drawer with a `ref`:

```tsx
import { useRef } from 'react'
import { De1Widget, type WidgetDrawer } from '@de1/widget'

export function SwapDrawer() {
  const drawerRef = useRef<WidgetDrawer>(null)
  return (
    <>
      <button onClick={() => drawerRef.current?.openDrawer()}>Open</button>
      <De1Widget
        ref={drawerRef}
        integrator="your-app-name"
        variant="drawer"
      />
    </>
  )
}
```

### Default pair

```tsx
<De1Widget
  integrator="your-app-name"
  config={{
    fromChain: 1,
    fromToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
    toChain: 56,
    toToken: '0x0000000000000000000000000000000000000000', // BNB
    fromAmount: '100',
  }}
/>
```

### Chain and token filters

```tsx
import { ChainType } from '@de1/widget'

<De1Widget
  integrator="your-app-name"
  config={{
    chains: {
      allow: [1, 56, 137, 42161],
      types: { allow: [ChainType.EVM] },
    },
    tokens: {
      deny: [{ chainId: 1, address: '0x...' }],
    },
  }}
/>
```

### Hide / disable UI

```tsx
import { DisabledUI, HiddenUI, RequiredUI } from '@de1/widget'

<De1Widget
  integrator="your-app-name"
  config={{
    hiddenUI: [HiddenUI.History, HiddenUI.PoweredBy],
    disabledUI: [DisabledUI.ToAddress],
    requiredUI: [RequiredUI.ToAddress],
  }}
/>
```

### Theme

Use the built-in `de1Theme`, or override the palette for your brand:

```tsx
import { De1Widget, de1Theme } from '@de1/widget'

<De1Widget
  integrator="your-app-name"
  config={{
    appearance: 'dark',
    theme: {
      ...de1Theme,
      palette: {
        ...de1Theme.palette,
        primary: { main: '#fb534f' },
      },
      container: {
        borderRadius: '16px',
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
      },
    },
  }}
/>
```

### Language

Built-in: `en`, `zh`, `ja`, `ko`, `es`, `fr`, `de`, `pt`, `vi`, `th`, `id`, `tr`, `it`, `uk`, `bn`. Default is English.

```tsx
<De1Widget
  integrator="your-app-name"
  config={{
    languages: { default: 'en' },
  }}
/>
```

Override specific strings with `languageResources`. This version does not show a language picker in Settings; the locale follows `languages.default` (English if omitted).

### Fees and referrer codes

```tsx
<De1Widget
  integrator="your-app-name"
  config={{
    fee: 0.003, // 0.3%
    evmReferrer: {
      address: '0xYourFeeReceiver',
      fee: '0.003',
    },
    solanaReferrer: {
      address: 'YourSolanaAddress',
      fee: '0.003',
    },
  }}
/>
```

Use `feeConfig.calculateFee` for dynamic fees.

---

## Events

Subscribe to transaction and form events with `useWidgetEvents` for analytics or support handoff.

```tsx
import { useEffect } from 'react'
import { useWidgetEvents, WidgetEvent } from '@de1/widget'

export function WidgetAnalytics() {
  const events = useWidgetEvents()

  useEffect(() => {
    const onStarted = (route) => console.log('started', route.id)
    const onCompleted = (route) => console.log('completed', route.id)
    const onFailed = ({ route, process }) =>
      console.error('failed', route.id, process)

    events.on(WidgetEvent.RouteExecutionStarted, onStarted)
    events.on(WidgetEvent.RouteExecutionCompleted, onCompleted)
    events.on(WidgetEvent.RouteExecutionFailed, onFailed)

    return () => {
      events.off(WidgetEvent.RouteExecutionStarted, onStarted)
      events.off(WidgetEvent.RouteExecutionCompleted, onCompleted)
      events.off(WidgetEvent.RouteExecutionFailed, onFailed)
    }
  }, [events])

  return null
}
```

Common events:

| Event | When |
| --- | --- |
| `RouteExecutionStarted` | User confirms and execution starts |
| `RouteExecutionUpdated` | Step status updates |
| `RouteExecutionCompleted` | Success |
| `RouteExecutionFailed` | Failure |
| `RouteSelected` | User selects a route |
| `AvailableRoutes` | Quote list is ready |
| `SourceChainTokenSelected` / `DestinationChainTokenSelected` | Token changed |
| `ContactSupport` | User clicks contact support |
| `PageEntered` | Page changed |

---

## Wallet integration

The Widget ships with its own wallet menu. If the host already uses RainbowKit, Privy, Dynamic, or Reown, hand "Connect wallet" to the host via `walletConfig.onConnect`:

```tsx
<De1Widget
  integrator="your-app-name"
  config={{
    walletConfig: {
      onConnect() {
        openConnectModal?.()
      },
    },
  }}
/>
```

Enable `usePartialWalletManagement` when the Widget wallet menu should coexist with an external one.

Pass WalletConnect / MetaMask / Coinbase options in `walletConfig` (for example a WalletConnect `projectId`).

See [`examples/`](examples/README.md) for complete wallet-stack samples.

---

## Headless SDK

Use `@de1/widget-sdk` when you only need quotes or route execution, without UI:

```ts
import { createConfig, getRoutes, executeRoute } from '@de1/widget-sdk'

createConfig({ integrator: 'your-app-name' })

const { routes } = await getRoutes({
  fromChainId: 1,
  toChainId: 56,
  fromTokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  toTokenAddress: '0x0000000000000000000000000000000000000000',
  fromAmount: '100000000',
})

if (routes?.[0]) {
  await executeRoute(routes[0])
}
```

Common methods: `getRoutes`, `getQuote`, `getStatus`, `getTokens`, `getChains`, `getTokenBalances`, `executeRoute`, `resumeRoute`, `stopRouteExecution`.

---

## Framework examples

Step-by-step notes are in [`examples/README.md`](examples/README.md). Directory map:

| Directory | Scenario |
| --- | --- |
| [`examples/vite`](examples/vite) | Vite + React |
| [`examples/nextjs`](examples/nextjs) | Next.js App Router |
| [`examples/nextjs-page-router`](examples/nextjs-page-router) | Next.js Pages Router |
| [`examples/vue`](examples/vue) / [`examples/nuxt`](examples/nuxt) | Vue 3 / Nuxt 3 (veaury) |
| [`examples/svelte`](examples/svelte) | Svelte |
| [`examples/remix`](examples/remix) | Remix |
| [`examples/rainbowkit`](examples/rainbowkit) | RainbowKit |
| [`examples/privy`](examples/privy) | Privy |
| [`examples/dynamic`](examples/dynamic) | Dynamic |
| [`examples/reown`](examples/reown) | Reown (WalletConnect) |
| [`examples/connectkit`](examples/connectkit) | ConnectKit |
| [`examples/privy-ethers`](examples/privy-ethers) | Privy + ethers |
| [`examples/zustand-widget-config`](examples/zustand-widget-config) | External Zustand config store |
| [`examples/deposit-flow`](examples/deposit-flow) | Custom deposit / contract calls |

---

## Local development

```bash
pnpm install
pnpm dev          # Widget Playground (Vite)
pnpm build        # Build all packages
pnpm check        # Biome
pnpm check:types  # TypeScript
```

Requires Node.js 18+ and `pnpm@10`.

Repo layout:

```
packages/
  widget/                 # @de1/widget
  widget-sdk/             # @de1/widget-sdk
  wallet-management/      # @de1/wallet-management
  widget-types/           # @de1/widget-types
  widget-playground/      # Shared playground config
  widget-playground-vite/ # Local playground (Vite)
  widget-playground-next/ # Local playground (Next.js)
  widget-embedded/        # NFT checkout demo
examples/                 # Framework integration examples
```

---

## Integration notes

1. **`integrator` is required.** The SDK refuses to initialize without it.
2. The Widget depends on browser wallets and Web3 APIs. Wrap it as client-only in SSR frameworks.
3. Vite and some bundlers need `buffer` and `process` polyfills.
4. Do not rename on-chain fields such as contract ABI or Permit2 type names, or signatures and execution can break.
5. Configure a WalletConnect Project ID and the RPCs you need in production.

---

## Support

- Developer docs: <https://docs.de1.exchange/docs/widget/overview>
- Telegram: <https://t.me/De1_Exchange>
- Issues: open an issue in this repo with your `integrator`, reproduction steps, and browser console output

## License

Apache-2.0. See [LICENSE.md](LICENSE.md).
