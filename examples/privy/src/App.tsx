import { De1Widget, de1Theme } from '@de1/widget'
import { QueryClientProvider } from '@tanstack/react-query'
import { WalletHeader } from './components/WalletHeader'
import { queryClient } from './config/queryClient'
import { WalletProvider } from './providers/SyncedWalletProvider'
import { EVM_CHAIN_IDS } from '../../../packages/widget-playground-vite/src/config/evmChainIds';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <WalletHeader />
        <De1Widget
          integrator="vite-example"
          config={{
            theme: de1Theme,
            variant: 'compact',
            subvariant: 'split',
            appearance: 'dark',
            chains: { allow: EVM_CHAIN_IDS },
          }}
        />
      </WalletProvider>
    </QueryClientProvider>
  )
}

export default App
