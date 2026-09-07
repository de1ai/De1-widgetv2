import { type WidgetConfig, WidgetSkeleton } from '@de1/widget'
import { Suspense, lazy } from 'react'

const De1WidgetLazy = lazy(async () => {
  const module = await import('@de1/widget')

  return { default: module.De1Widget }
})

export function De1Widget() {
  const config = {
    appearance: 'light',
    theme: {
      container: {
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
        borderRadius: '16px',
      },
    },
  } as Partial<WidgetConfig>

  return (
    <Suspense fallback={<WidgetSkeleton config={config} />}>
      <De1WidgetLazy config={config} integrator="remix-example" />
    </Suspense>
  )
}
