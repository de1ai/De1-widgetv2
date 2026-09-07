import { De1Widget } from '@de1/widget'
import { useWidgetConfig } from '../store/useWidgetConfig.ts'

export function WidgetView() {
  const { config } = useWidgetConfig()
  return <De1Widget integrator="vite-example" config={config} />
}
