import type { ChainType } from '@de1/widget-types'
import { config } from '../config.js'

export const getProvider = <T>(type: ChainType): T => {
  const provider = config
    .get()
    .providers.find((provider) => provider.type === type) as T
  if (!provider) {
    throw new Error(`${type} provider not found.`)
  }
  return provider
}
