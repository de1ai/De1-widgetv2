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
