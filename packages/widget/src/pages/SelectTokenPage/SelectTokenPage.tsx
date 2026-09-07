import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material'
import type { FC } from 'react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'
import { ChainSelect } from '../../components/ChainSelect/ChainSelect.js'
import { FullPageContainer } from '../../components/FullPageContainer.js'
import { TokenList } from '../../components/TokenList/TokenList.js'
import type { TokenSourceFilter } from '../../components/TokenList/types.js'
import { useHeader } from '../../hooks/useHeader.js'
import { useListHeight } from '../../hooks/useListHeight.js'
import { useNavigateBack } from '../../hooks/useNavigateBack.js'
import { useScrollableOverflowHidden } from '../../hooks/useScrollableContainer.js'
import { useSwapOnly } from '../../hooks/useSwapOnly.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import type { FormTypeProps } from '../../stores/form/types.js'
import { SearchTokenInput } from './SearchTokenInput.js'

export const SelectTokenPage: FC<FormTypeProps> = ({ formType }) => {
  useScrollableOverflowHidden()
  const theme = useTheme()
  const { navigateBack } = useNavigateBack()
  const headerRef = useRef<HTMLElement>(null)
  const listParentRef = useRef<HTMLUListElement | null>(null)
  const { listHeight, minListHeight } = useListHeight({
    listParentRef,
    headerRef,
  })

  const swapOnly = useSwapOnly()
  const [tokenSourceFilter, setTokenSourceFilter] =
    useState<TokenSourceFilter>('all')

  const { subvariant } = useWidgetConfig()
  const { t } = useTranslation()
  const title =
    formType === 'from'
      ? subvariant === 'custom'
        ? t('header.payWith')
        : t('header.from')
      : t('header.to')

  useHeader(title)

  const hideChainSelect = swapOnly && formType === 'to'
  const tokenSourceIndex = tokenSourceFilter === 'all' ? 0 : 1

  return (
    <FullPageContainer disableGutters>
      <Box
        ref={headerRef}
        sx={{
          pb: 2,
          px: 3,
        }}
      >
        {!hideChainSelect ? <ChainSelect formType={formType} /> : null}
        <Box
          sx={{
            mt: !hideChainSelect ? 2 : 0,
          }}
        >
          <SearchTokenInput />
          <Box
            sx={{
              mt: 1.5,
              position: 'relative',
              backgroundColor: alpha(theme.palette.common.white, 0.04),
              p: 0.5,
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 4,
                bottom: 4,
                left: 4,
                width: 'calc(50% - 4px)',
                borderRadius: 1.5,
                backgroundColor: alpha(theme.palette.common.black, 0.56),
                boxShadow: `0 6px 18px ${alpha(theme.palette.common.black, 0.32)}`,
                transform:
                  tokenSourceIndex === 0 ? 'translateX(0)' : 'translateX(calc(100% + 4px))',
                transition: theme.transitions.create('transform', {
                  duration: 280,
                  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                }),
                pointerEvents: 'none',
              }}
            />
            <ToggleButtonGroup
              exclusive
              fullWidth
              size="small"
              value={tokenSourceFilter}
              onChange={(_, nextValue: TokenSourceFilter | null) => {
                if (nextValue) {
                  setTokenSourceFilter(nextValue)
                }
              }}
              aria-label="token source filter"
              sx={{
                position: 'relative',
                zIndex: 1,
                '& .MuiToggleButton-root': {
                  textTransform: 'none',
                  border: 'none',
                  borderRadius: 1.5,
                  fontWeight: 600,
                  py: 0.75,
                  flex: 1,
                  zIndex: 1,
                  backgroundColor: 'transparent',
                  color: 'inherit',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                  '&:active': {
                    backgroundColor: 'transparent',
                  },
                  '&.Mui-focusVisible': {
                    backgroundColor: 'transparent',
                  },
                  '&.Mui-selected, &.Mui-selected:hover, &.Mui-selected:active, &.Mui-selected.Mui-focusVisible':
                    {
                      backgroundColor: 'transparent !important',
                      color: 'inherit !important',
                      boxShadow: 'none',
                    },
                  '& .MuiTouchRipple-root': {
                    display: 'none',
                  },
                  '&.Mui-selected .MuiTouchRipple-root': {
                    display: 'none',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'transparent',
                    color: 'inherit',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  },
                },
              }}
            >
              <ToggleButton value="all" disableRipple>
                ALL
              </ToggleButton>
              <ToggleButton value="rwa" disableRipple>
                RWA
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          height: minListHeight,
        }}
      >
        <TokenList
          parentRef={listParentRef}
          height={listHeight}
          onClick={navigateBack}
          formType={formType}
          tokenSourceFilter={tokenSourceFilter}
        />
      </Box>
    </FullPageContainer>
  )
}
