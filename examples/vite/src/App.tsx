import { De1Widget } from '@de1/widget'

export function App() {
  return (
    <De1Widget
      integrator="vite-example"
      config={{
        buildUrl: false,
        subvariant: 'split',
        subvariantOptions: {
          split: 'bridge',
        },
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
