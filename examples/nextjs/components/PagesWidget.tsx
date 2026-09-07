import type { WidgetConfig } from '@de1/widget'
import { De1Widget } from '@de1/widget'

export default function PagesWidget() {
  const config = {
    appearance: 'light',
    theme: {
      container: {
        border: '1px solid rgb(234, 234, 234)',
        borderRadius: '16px',
      },
    },
  } as Partial<WidgetConfig>

  return <De1Widget config={config} integrator="nextjs-example" />
}
