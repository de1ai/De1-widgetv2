import type { FC, PropsWithChildren } from 'react'
import { createContext, useContext } from 'react'

export interface ConfigApi {
  setConfig: (params: any) => Promise<any>
  getConfig: (hash: string) => Promise<any>
}

const ConfigApiContext = createContext<ConfigApi | null>(null)

export interface ConfigApiProviderProps extends PropsWithChildren {
  api?: ConfigApi
}

export const ConfigApiProvider: FC<ConfigApiProviderProps> = ({
  children,
  api,
}) => {
  return (
    <ConfigApiContext.Provider value={api || null}>
      {children}
    </ConfigApiContext.Provider>
  )
}

export const useConfigApi = (): ConfigApi | null => {
  return useContext(ConfigApiContext)
}


