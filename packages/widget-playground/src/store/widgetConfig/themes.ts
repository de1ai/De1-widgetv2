import {
  azureLightTheme,
  de1Theme,
  watermelonLightTheme,
  windows95Theme,
} from '@de1/widget'
import type { ThemeItem } from '../editTools/types'

export const themeItems: ThemeItem[] = [
  {
    id: 'azureLight',
    name: 'Azure Light',
    theme: {
      light: azureLightTheme,
    },
  },
  {
    id: 'watermelonLight',
    name: 'Watermelon Light',
    theme: {
      light: watermelonLightTheme,
    },
  },
  {
    id: 'windows95',
    name: 'Windows 95',
    theme: {
      light: windows95Theme,
    },
  },
  {
    id: 'de1',
    name: 'De1',
    theme: { dark: de1Theme },
  },
]
