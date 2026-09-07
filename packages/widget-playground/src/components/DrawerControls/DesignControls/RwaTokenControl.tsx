import type * as React from 'react'
import { useConfigActions } from '../../../store/widgetConfig/useConfigActions'
import { useConfig } from '../../../store/widgetConfig/useConfig'
import {
  Card,
  CardRowContainer,
  CardTitleContainer,
  CardValue,
} from '../../Card/Card.style'
import { Switch } from '../../Switch'

export const RwaTokenControl = () => {
  const { config } = useConfig()
  const { setConfig } = useConfigActions()

  const handleRwaTokenEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setConfig({
      ...(config ?? {}),
      isRwaTokenEnabled: checked,
    })
  }

  return (
    <Card>
      <CardRowContainer>
        <CardTitleContainer>
          <CardValue>Including RWA tokens</CardValue>
        </CardTitleContainer>
        <Switch
          checked={!!config?.isRwaTokenEnabled}
          onChange={handleRwaTokenEnabled}
          aria-label="Enable Including RWA tokens"
        />
      </CardRowContainer>
    </Card>
  )
}
