'use client'

import type { WidgetConfig } from '@de1/widget'
import { De1Widget } from '@de1/widget'
import type { ReactNode } from 'react'
import { ClientOnly } from './ClientOnly'

interface WidgetProps {
  fallback: ReactNode
  config: Partial<WidgetConfig>
}

export function Widget({ config, fallback }: WidgetProps) {
  return (
    <ClientOnly fallback={fallback}>
      <De1Widget config={config} integrator="nextjs-example" />
    </ClientOnly>
  )
}
