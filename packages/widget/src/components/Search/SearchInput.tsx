import { Search } from '@mui/icons-material'
import { FormControl, InputAdornment } from '@mui/material'
import type { ChangeEventHandler, FocusEventHandler } from 'react'
import { InputCard } from '../../components/Card/InputCard.js'
import { useHeaderHeight } from '../../stores/header/useHeaderStore.js'
import { Input, StickySearchInputContainer } from './SearchInput.style.js'

/** Matches MUI InputBase inputProps: the underlying element may be input or textarea */
interface SearchInputProps {
  name?: string
  value?: string
  placeholder?: string
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
  autoFocus?: boolean
}

export const SearchInput = ({
  name,
  placeholder,
  onChange,
  onBlur,
  value,
  autoFocus,
}: SearchInputProps) => {
  return (
    <InputCard>
      <FormControl fullWidth>
        <Input
          size="small"
          placeholder={placeholder}
          endAdornment={
            <InputAdornment position="end">
              <Search />
            </InputAdornment>
          }
          inputProps={{
            inputMode: 'search',
            onChange,
            onBlur,
            name,
            value,
            maxLength: 128,
          }}
          autoComplete="off"
          autoFocus={autoFocus}
        />
      </FormControl>
    </InputCard>
  )
}

export const StickySearchInput = (props: SearchInputProps) => {
  const { headerHeight } = useHeaderHeight()

  return (
    <StickySearchInputContainer headerHeight={headerHeight}>
      <SearchInput {...props} autoFocus />
    </StickySearchInputContainer>
  )
}
