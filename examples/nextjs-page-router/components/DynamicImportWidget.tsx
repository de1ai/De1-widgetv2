import type { WidgetConfig } from '@de1/widget'
import { De1Widget } from '@de1/widget'

// NOTE: this example of the widget is for use with the nexts next/dynamic api
// see pages/dynamic-import.tsx for usage
export default function DynamicImportWidget() {
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
