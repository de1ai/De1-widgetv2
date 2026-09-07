import {
  WidgetEvent,
  type FormFieldChanged,
  widgetEvents,
} from '@de1/widget'
import { useEffect, useRef } from 'react'
import {
  isSwapSelection,
  saveTokenSelection,
  type CachedTokenSelection,
} from '../services/tokenSelectionCache'

const CACHED_FORM_FIELDS = new Set([
  'fromChain',
  'fromToken',
  'toChain',
  'toToken',
])

/**
 * Integrator-side bridge: persists same-chain swap token selection only.
 * Cross-chain (bridge) selections are not cached or restored.
 */
export function TokenSelectionCacheBridge() {
  const formStateRef = useRef<Partial<CachedTokenSelection>>({})

  useEffect(() => {
    const persistSwapSelectionIfReady = () => {
      if (isSwapSelection(formStateRef.current)) {
        saveTokenSelection(formStateRef.current)
      }
    }

    const updateFormState = (patch: Partial<CachedTokenSelection>) => {
      formStateRef.current = {
        ...formStateRef.current,
        ...patch,
      }
      persistSwapSelectionIfReady()
    }

    const handleFormFieldChanged = (event: FormFieldChanged) => {
      if (!CACHED_FORM_FIELDS.has(event.fieldName)) {
        return
      }

      updateFormState({
        [event.fieldName]: event.newValue,
      } as Partial<CachedTokenSelection>)
    }

    const handleSourceTokenSelected = ({
      chainId,
      tokenAddress,
    }: {
      chainId: number
      tokenAddress: string
    }) => {
      updateFormState({
        fromChain: chainId,
        fromToken: tokenAddress,
      })
    }

    const handleDestinationTokenSelected = ({
      chainId,
      tokenAddress,
    }: {
      chainId: number
      tokenAddress: string
    }) => {
      updateFormState({
        toChain: chainId,
        toToken: tokenAddress,
      })
    }

    widgetEvents.on(WidgetEvent.FormFieldChanged, handleFormFieldChanged)
    widgetEvents.on(
      WidgetEvent.SourceChainTokenSelected,
      handleSourceTokenSelected
    )
    widgetEvents.on(
      WidgetEvent.DestinationChainTokenSelected,
      handleDestinationTokenSelected
    )

    return () => {
      widgetEvents.off(WidgetEvent.FormFieldChanged, handleFormFieldChanged)
      widgetEvents.off(
        WidgetEvent.SourceChainTokenSelected,
        handleSourceTokenSelected
      )
      widgetEvents.off(
        WidgetEvent.DestinationChainTokenSelected,
        handleDestinationTokenSelected
      )
    }
  }, [])

  return null
}
