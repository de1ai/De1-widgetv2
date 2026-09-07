import { AirlineStops, SwapHoriz, WarningRounded } from '@mui/icons-material'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { shallow } from 'zustand/shallow'
import { CardButton } from '../../components/Card/CardButton.js'
import { useSettingMonitor } from '../../hooks/useSettingMonitor.js'
import { useSettingsStore } from '../../stores/settings/useSettingsStore.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { BadgedValue } from './SettingsCard/BadgedValue.js'
import { SlippageLimitsWarningContainer } from './SlippageSettings/SlippageSettings.style.js'

const supportedIcons = {
  Bridges: AirlineStops,
  Exchanges: SwapHoriz,
}

export const BridgeAndExchangeSettings: React.FC<{
  type: 'Bridges' | 'Exchanges'
}> = ({ type }) => {
  const { isBridgesChanged, isExchangesChanged, isNoBridgesEnabled } =
    useSettingMonitor()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [enabledTools, tools] = useSettingsStore((state) => {
    const enabledTools = Object.values(state[`_enabled${type}`])
    return [enabledTools.filter(Boolean).length, enabledTools.length]
  }, shallow)

  const customisationLookUp = {
    Bridges: isBridgesChanged,
    Exchanges: isExchangesChanged,
  }

  const handleClick = () => {
    navigate(navigationRoutes[type.toLowerCase() as 'bridges' | 'exchanges'])
  }

  const Icon = supportedIcons[type]
  const showNoBridgesWarning = type === 'Bridges' && isNoBridgesEnabled
  const badgeColor = showNoBridgesWarning
    ? 'warning'
    : customisationLookUp[type]
      ? 'info'
      : undefined

  return (
    <>
      <CardButton
        onClick={handleClick}
        icon={type === 'Exchanges' ? <Icon /> : undefined}
        title={t(`settings.enabled${type}`)}
      >
        <BadgedValue badgeColor={badgeColor} showBadge={!!badgeColor}>
          {`${enabledTools}/${tools}`}
        </BadgedValue>
      </CardButton>
      {showNoBridgesWarning ? (
        <SlippageLimitsWarningContainer sx={{ px: 1 }}>
          <WarningRounded color="warning" />
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 400,
            }}
          >
            {t('warning.message.noBridgesEnabled')}
          </Typography>
        </SlippageLimitsWarningContainer>
      ) : null}
    </>
  )
}
