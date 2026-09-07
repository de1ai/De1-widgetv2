import type { WidgetDrawer } from '@de1/widget'
import { De1Widget, WidgetSkeleton } from '@de1/widget'
import {
  WidgetViewContainer,
  useConfig,
  useSkeletonToolValues,
} from '@de1/widget-playground'
import { useCallback, useRef } from 'react'
import { ClientOnly } from './ClientOnly'

export function WidgetNextView() {
  const { config } = useConfig()
  const drawerRef = useRef<WidgetDrawer>(null)
  const { isSkeletonShown, isSkeletonSideBySide } = useSkeletonToolValues()

  const toggleDrawer = useCallback(() => {
    drawerRef?.current?.toggleDrawer()
  }, [])

  return (
    <WidgetViewContainer toggleDrawer={toggleDrawer}>
      {!isSkeletonShown || isSkeletonSideBySide ? (
        <ClientOnly fallback={<WidgetSkeleton config={config} />}>
          <De1Widget
            config={config}
            integrator="de1-playground"
            ref={drawerRef}
            open
          />
        </ClientOnly>
      ) : null}
      {isSkeletonShown ? <WidgetSkeleton config={config!} /> : null}
    </WidgetViewContainer>
  )
}
