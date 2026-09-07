import { Box } from '@mui/material'
import {
  ConfigApiProvider,
  DrawerControls,
  EditToolsProvider,
  EnvVariablesProvider,
  FontLoaderProvider,
  PlaygroundThemeProvider,
  WidgetConfigProvider,
  WidgetView,
  de1Theme,
} from '@de1/widget-playground'
import { defaultWidgetConfig } from '@de1/widget-playground/widget-config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'
import '@de1/widget-playground/fonts'
import { getConfig, setConfig } from './services/configApi'
import { applyTokenSelectionCache } from './services/tokenSelectionCache'
import { TokenSelectionCacheBridge } from './components/TokenSelectionCacheBridge'
import type { WidgetConfig } from '@de1/widget'

const queryClient = new QueryClient()

// const router = createBrowserRouter([
//   {
//     path: '/test/*',
//     element: (
//       <Box sx={{ display: 'flex', flexGrow: '1' }}>
//         <DrawerControls />
//         <WidgetView />
//       </Box>
//     ),
//   },
// ]);

const defaultConfig: Partial<WidgetConfig> = {
  ...defaultWidgetConfig,
  buildUrl: false,
  variant: 'compact',
  subvariant: 'split',
  appearance: 'dark',
  theme: de1Theme,
  // slippage: 0.08,
  // chains: { allow: [1151111081099710, 1,10,56,137,250,8453,42161,43114,59144,100,1088,146,80094,5000,999] },
  explorerUrls: {
    250: ['https://explorer.fantom.network/']
  }
}

// Check URL hash on module load, clear localStorage cache if hash exists
// This needs to execute before WidgetConfigProvider creates the store
const urlParams = new URLSearchParams(window.location.search)
const hash = urlParams.get('hash')
if (hash) {
  // When hash parameter exists, clear localStorage cache to ensure using server config
  localStorage.removeItem('de1-playground-config')
}

const AppProvider = ({ children }: PropsWithChildren) => {
  const [initialConfig, setInitialConfig] = useState<Partial<WidgetConfig>>(defaultConfig)
  const [configLoaded, setConfigLoaded] = useState(false)

  // Read hash from URL and load config
  useEffect(() => {
    const loadConfigFromHash = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const hash = urlParams.get('hash')

      if (hash) {
        try {
          const configData = await getConfig(hash);
          if (configData) {
            // Merge config, prioritize config from server
            setInitialConfig(
              applyTokenSelectionCache({
                ...defaultConfig,
                ...configData,
              })
            )
          } else {
            setInitialConfig(applyTokenSelectionCache(defaultConfig))
          }
        } catch (error) {
          console.error('Failed to load config:', error)
          setInitialConfig(applyTokenSelectionCache(defaultConfig))
        }
      } else {
        setInitialConfig(applyTokenSelectionCache(defaultConfig))
      }
      setConfigLoaded(true)
    }

    loadConfigFromHash()
  }, [])

  if (!configLoaded) {
    return null // Or show loading state
  }

  return (
    <EnvVariablesProvider
      EVMWalletConnectId={import.meta.env.VITE_EVM_WALLET_CONNECT}
    >
      <QueryClientProvider client={queryClient}>
        <ConfigApiProvider api={{ setConfig, getConfig }}>
          <WidgetConfigProvider defaultWidgetConfig={initialConfig}>
            <EditToolsProvider>
              <PlaygroundThemeProvider>
                <FontLoaderProvider>{children}</FontLoaderProvider>
              </PlaygroundThemeProvider>
            </EditToolsProvider>
          </WidgetConfigProvider>
        </ConfigApiProvider>
      </QueryClientProvider>
    </EnvVariablesProvider>
  )
}

export const App = () => {
  // Check URL parameter to control config panel visibility
  const [shouldShowConfig, setShouldShowConfig] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const showConfig = urlParams.get('showConfig')
    // Default to false if not specified, only show if showConfig is 'true' or '1'
    return showConfig === 'true' || showConfig === '1'
  })

  // Listen for URL changes (e.g., browser back/forward)
  useEffect(() => {
    const checkShowConfig = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const showConfig = urlParams.get('showConfig')
      setShouldShowConfig(showConfig === 'true' || showConfig === '1')
    }

    // Check on mount
    checkShowConfig()

    // Listen for popstate events (browser back/forward)
    window.addEventListener('popstate', checkShowConfig)

    // Listen for custom events if URL changes programmatically
    window.addEventListener('pushstate', checkShowConfig)
    window.addEventListener('replacestate', checkShowConfig)

    return () => {
      window.removeEventListener('popstate', checkShowConfig)
      window.removeEventListener('pushstate', checkShowConfig)
      window.removeEventListener('replacestate', checkShowConfig)
    }
  }, [])

  return (
    <AppProvider>
      <TokenSelectionCacheBridge />
      {/* <RouterProvider router={router} /> */}
      <Box sx={{ display: 'flex', flexGrow: '1' }}>
        {shouldShowConfig && <DrawerControls />}
        <WidgetView />
      </Box>
    </AppProvider>
  )
}

if (!import.meta.env.VITE_EVM_WALLET_CONNECT) {
  console.error(
    'VITE_EVM_WALLET_CONNECT is require in your .env.local file for external wallet management'
  )
}
