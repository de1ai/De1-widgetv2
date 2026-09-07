import { useTranslation } from 'react-i18next'
import { PageContainer } from '../../components/PageContainer.js'
import { useHeader } from '../../hooks/useHeader.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { BridgeAndExchangeSettings } from './BridgeAndExchangeSettings.js'
import { ResetSettingsButton } from './ResetSettingsButton.js'
import { SettingsList } from './SettingsCard/SettingCard.style.js'
import { SettingsCardAccordion } from './SettingsCard/SettingsAccordian.js'
import { SlippageSettings } from './SlippageSettings/SlippageSettings.js'
import { DynamicSlippageSettings } from './DynamicSlippageSettings.js'

export const SettingsPage = () => {
  const { t } = useTranslation()
  const { bridges } = useWidgetConfig()
  useHeader(t('translation:header.settings', 'Settings'))
  const showBridgeSettings = bridges?.showSettings !== false

  return (
    <PageContainer bottomGutters>
      <SettingsList>
        <SettingsCardAccordion>
          {/* <ThemeSettings /> */}
          {/* <LanguageSetting /> */}
          {/* <RoutePrioritySettings /> */}
          {/* <GasPriceSettings /> */}
          <DynamicSlippageSettings />
          <SlippageSettings />
          {showBridgeSettings ? (
            <BridgeAndExchangeSettings type="Bridges" />
          ) : null}
        </SettingsCardAccordion>
      </SettingsList>
      <ResetSettingsButton />
    </PageContainer>
  )
}
