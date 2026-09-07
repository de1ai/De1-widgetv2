import { De1Widget } from '@de1/widget'
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit'

export default function App() {
  const { openConnectModal } = useConnectModal()
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: 12,
        }}
      >
        <ConnectButton chainStatus="none" />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
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
      </div>
    </div>
  )
}
