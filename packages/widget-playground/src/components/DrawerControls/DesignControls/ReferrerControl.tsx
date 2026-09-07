import { InputBase } from '@mui/material'
import { useState, type ChangeEvent } from 'react'
import { useConfigActions } from '../../../store/widgetConfig/useConfigActions'
import { useConfig } from '../../../store/widgetConfig/useConfig'
import { CardRowContainer, CardRowColumn } from '../../Card/Card.style'
import { ExpandableCard } from '../../Card/ExpandableCard'
import { ControlRowContainer } from './DesignControls.style'
import { TabButton, TabButtonsContainer, TabCustomInput } from './DesignControls.style'

const clickableValues = ['0.1', '0.5', '1.0']

type ReferrerKind = 'evm' | 'solana'

interface ReferrerConfig {
  address: string
  fee: string
}

const emptyReferrer: ReferrerConfig = { address: '', fee: '' }

const ReferrerFieldGroup = ({
  kind,
  value,
  onChange,
}: {
  kind: ReferrerKind
  value: ReferrerConfig
  onChange: (next: ReferrerConfig) => void
}) => {
  const [focused, setFocused] = useState<'input' | 'button'>()
  const initialCustomInputValue =
    value.fee && !clickableValues.includes(value.fee) ? value.fee : ''
  const [customValue, setCustomValue] = useState(initialCustomInputValue)

  const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, address: event.target.value })
  }

  const handleCustomInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value: next } = event.target
    setCustomValue(next)
    onChange({ ...value, fee: next })
  }

  const handleCustomInputBlur = () => {
    setFocused(undefined)
    if (customValue && clickableValues.includes(customValue)) {
      setCustomValue('')
    }
  }

  const handleFeeButtonClick = (fee: string) => {
    setCustomValue('')
    onChange({ ...value, fee })
  }

  const labelPrefix = kind === 'evm' ? 'EVM' : 'Solana'
  const addressPlaceholder =
    kind === 'evm' ? 'Enter EVM referrer address' : 'Enter Solana referrer address'

  return (
    <>
      <ControlRowContainer>
        <CardRowColumn>
          <label>{`${labelPrefix} Referrer Address`}</label>
        </CardRowColumn>
        <InputBase
          value={value.address}
          onChange={handleAddressChange}
          placeholder={addressPlaceholder}
          sx={{
            width: '100%',
            borderRadius: 1,
            padding: 1,
            backgroundColor: '#424242',
          }}
        />
      </ControlRowContainer>
      <ControlRowContainer>
        <CardRowColumn>
          <label>{`${labelPrefix} Referrer Fee (%)`}</label>
        </CardRowColumn>
        <TabButtonsContainer
          sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}
        >
          {clickableValues.map((feeValue) => (
            <TabButton
              key={feeValue}
              selected={value.fee === feeValue && focused !== 'input'}
              onClick={() => handleFeeButtonClick(feeValue)}
              onFocus={() => setFocused('button')}
              disableRipple
            >
              {feeValue}%
            </TabButton>
          ))}
          <TabCustomInput
            selected={
              value.fee !== undefined && !clickableValues.includes(value.fee)
            }
            onChange={handleCustomInputChange}
            onBlur={handleCustomInputBlur}
            inputProps={{ pattern: '[0-9.]' }}
            onFocus={() => setFocused('input')}
            placeholder={focused === 'input' ? '' : 'Custom'}
            value={customValue}
          />
        </TabButtonsContainer>
      </ControlRowContainer>
    </>
  )
}

export const ReferrerControl = () => {
  const { config } = useConfig()
  const { setConfig } = useConfigActions()

  const evmReferrer: ReferrerConfig = {
    ...emptyReferrer,
    ...config?.evmReferrer,
    ...(config?.evmReferrer ? null : config?.referrer),
  }
  const solanaReferrer: ReferrerConfig = {
    ...emptyReferrer,
    ...config?.solanaReferrer,
  }

  const handleEvmChange = (next: ReferrerConfig) => {
    setConfig({
      ...config,
      evmReferrer: next,
    })
  }

  const handleSolanaChange = (next: ReferrerConfig) => {
    setConfig({
      ...config,
      solanaReferrer: next,
    })
  }

  const evmHasValue = Boolean(evmReferrer.address)
  const solanaHasValue = Boolean(solanaReferrer.address)

  let headerValue: string
  if (evmHasValue && solanaHasValue) {
    headerValue = 'EVM / Solana'
  } else if (evmHasValue) {
    headerValue = 'EVM'
  } else if (solanaHasValue) {
    headerValue = 'Solana'
  } else {
    headerValue = 'Not set'
  }

  return (
    <ExpandableCard title="Referrer" value={headerValue}>
      <ReferrerFieldGroup kind="evm" value={evmReferrer} onChange={handleEvmChange} />
      <ReferrerFieldGroup
        kind="solana"
        value={solanaReferrer}
        onChange={handleSolanaChange}
      />
    </ExpandableCard>
  )
}
