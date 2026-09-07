import { useState } from 'react'
import { useConfig } from '../../../store/widgetConfig/useConfig'
import { useConfigActions } from '../../../store/widgetConfig/useConfigActions'
import {} from '../../Card/Card.style'
import { ExpandableCard } from '../../Card/ExpandableCard'
import { ControlRowContainer } from './DesignControls.style'
import {
  TabButton,
  TabButtonsContainer,
  TabCustomInput,
} from './DesignControls.style'

const defaultSlippage = 0.01

const clickableValues = [0.005, 0.01, 0.03]

export const SlippageToleranceControl = () => {
  const { config } = useConfig()
  const { setConfig } = useConfigActions()
  const [focused, setFocused] = useState<'input' | 'button'>()

  const slippage = config?.slippage ? config?.slippage : defaultSlippage

  const initialCustomInputValue =
    slippage && !clickableValues.includes(slippage) ? slippage : ''
  const [customValue, setCustomValue] = useState(initialCustomInputValue)

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setCustomValue(value)
    setConfig({
      ...config,
      slippage: value ? Number(value) / 100 : defaultSlippage,
    })
  }

  const handleBlurInput = () => {
    setFocused(undefined)
    if (customValue && clickableValues.includes(Number(customValue))) {
      setCustomValue('')
    }
  }

  const handleButtonClick = (value: number) => {
    setCustomValue('')
    setConfig({
      ...config,
      slippage: value > 0 ? value : defaultSlippage,
    })
  }

  const handleFocusInput = () => {
    setFocused('input')
  }

  const handleFocusButton = () => {
    setFocused('button')
  }

  return (
    <ExpandableCard
      title="Slippage Tolerance"
      value={slippage ? `${slippage * 100}%` : '1%'}
    >
      <ControlRowContainer>
        <TabButtonsContainer
          sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}
        >
          {clickableValues.map((value) => {
            return (
              <TabButton
                key={value}
                selected={slippage === value && focused !== 'input'}
                onClick={() => handleButtonClick(value)}
                onFocus={handleFocusButton}
                disableRipple
              >
                {value * 100}%
              </TabButton>
            )
          })}

          <TabCustomInput
            selected={
              slippage !== undefined && !clickableValues.includes(slippage)
            }
            onChange={handleChangeInput}
            onBlur={handleBlurInput}
            inputProps={{ pattern: '[0-9.]' }}
            onFocus={handleFocusInput}
            placeholder={focused === 'input' ? '' : 'Custom'}
            value={customValue}
          />
        </TabButtonsContainer>
      </ControlRowContainer>
    </ExpandableCard>
  )
}
