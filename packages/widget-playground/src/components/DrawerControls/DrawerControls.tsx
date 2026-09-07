import CloseIcon from '@mui/icons-material/Close'
import DesignServicesIcon from '@mui/icons-material/DesignServices'
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SaveIcon from '@mui/icons-material/Save'
import TabContext from '@mui/lab/TabContext'
import { Box, IconButton, Tooltip } from '@mui/material'
import { useState } from 'react'
import { useFontInitialisation } from '../../providers/FontLoaderProvider/FontLoaderProvider'
import { useConfigApi } from '../../providers/ConfigApiProvider/ConfigApiProvider'
import { useDrawerToolValues } from '../../store/editTools/useDrawerToolValues'
import { useEditToolsActions } from '../../store/editTools/useEditToolsActions'
import { useConfigActions } from '../../store/widgetConfig/useConfigActions'
import { useConfig } from '../../store/widgetConfig/useConfig'
import { getConfigOutput } from '../../store/widgetConfig/utils/getConfigOutput'
import { ExpandableCardAccordion } from '../Card/ExpandableCardAccordion'
import { Tab, Tabs } from '../Tabs/Tabs.style'
import { CodeControl } from './CodeControl/CodeControl'
import { AppearanceControl } from './DesignControls/AppearanceControl'
import { ButtonRadiusControl } from './DesignControls/ButtonRaduisControl'
import { CardRadiusControl } from './DesignControls/CardRadiusControl'
import { ColorControl } from './DesignControls/ColorControls'
import { FontsControl } from './DesignControls/FontsControl/FontsControl'
import { FormValuesControl } from './DesignControls/FormValuesControls'
import { LayoutControls } from './DesignControls/LayoutControls'
import { PlaygroundSettingsControl } from './DesignControls/PlaygroundSettingsControl/PlaygroundSettingsControl'
import { SkeletonControl } from './DesignControls/SkeletonControl'
import { SubvariantControl } from './DesignControls/SubvariantControl'
import { ThemeControl } from './DesignControls/ThemeControl'
import { VariantControl } from './DesignControls/VariantControl'
import { WalletManagementControl } from './DesignControls/WalletManagementControl'
import { WidgetEventControls } from './DesignControls/WidgetEventsControls'
import { ReferrerControl } from './DesignControls/ReferrerControl'
import { SlippageToleranceControl } from './DesignControls/SlippageToleranceControl'
import { DefaultChainToken } from './DesignControls/DefaultChainToken'
import {
  Drawer,
  DrawerContentContainer,
  Header,
  HeaderRow,
  TabContentContainer,
  WidgetConfigControls,
  tooltipPopperZIndex,
} from './DrawerControls.style'
import { DrawerHandle } from './DrawerHandle'
import { BrowserRouter } from 'react-router-dom';

export const DrawerControls = () => {
  const { isDrawerOpen, drawerWidth, visibleControls } = useDrawerToolValues()
  const { setDrawerOpen, setVisibleControls } = useEditToolsActions()
  const { resetConfig } = useConfigActions()
  const { resetEditTools } = useEditToolsActions()
  const { config } = useConfig()
  const configApi = useConfigApi()
  const [saving, setSaving] = useState(false)

  useFontInitialisation()

  const handleReset = () => {
    resetConfig()
    resetEditTools()
  }

  const handleSave = async () => {
    if (!configApi) {
      console.warn('ConfigApi not provided, cannot save config')
      return
    }

    try {
      setSaving(true)
      const configOutput = getConfigOutput(config || {})
      const response = await configApi.setConfig(configOutput)

      // Assume server response data structure contains hash field
      const hash = response?.data?.hash || response?.data?.data?.hash || response?.hash

      if (hash) {
        // Update URL, add hash parameter
        const url = new URL(window.location.href)
        url.searchParams.set('hash', hash)
        window.history.pushState({}, '', url.toString())

        // Show success message (can be replaced with a more friendly notification)
        alert(`Config saved! Hash: ${hash}`)
      }
    } catch (error) {
      console.error('Failed to save config:', error)
      alert('Failed to save config, please try again')
    } finally {
      setSaving(false)
    }
  }

  return (
    <BrowserRouter>
      <DrawerHandle />
      <Drawer
        variant="persistent"
        anchor="left"
        open={isDrawerOpen}
        drawerWidth={drawerWidth}
      >
        <DrawerContentContainer drawerWidth={drawerWidth}>
          <HeaderRow>
            <Header>Config</Header>
            <Box>
              {configApi && (
                <Tooltip
                  title="Save config"
                  PopperProps={{ style: { zIndex: tooltipPopperZIndex } }}
                  arrow
                >
                  <IconButton onClick={handleSave} disabled={saving}>
                    <SaveIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip
                title="Reset config"
                PopperProps={{ style: { zIndex: tooltipPopperZIndex } }}
                arrow
              >
                <IconButton onClick={handleReset}>
                  <RestartAltIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title="Close tools"
                PopperProps={{ style: { zIndex: tooltipPopperZIndex } }}
                arrow
              >
                <IconButton onClick={() => setDrawerOpen(!isDrawerOpen)}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </HeaderRow>
          <Box sx={{ maxWidth: 344, height: 56 }}>
            <Tabs
              value={visibleControls}
              aria-label="tabs"
              indicatorColor="primary"
              onChange={(_, value) => setVisibleControls(value)}
            >
              <Tab
                icon={<DesignServicesIcon />}
                iconPosition="start"
                label={'Design'}
                value="design"
                disableRipple
              />
              <Tab
                icon={<IntegrationInstructionsIcon />}
                iconPosition="start"
                label={'Code'}
                value="code"
                disableRipple
              />
            </Tabs>
          </Box>
          <TabContext value={visibleControls}>
            <TabContentContainer
              value="design"
              sx={{ justifyContent: 'space-between' }}
            >
              <ExpandableCardAccordion>
                <WidgetConfigControls>
                  <VariantControl />
                  <SubvariantControl />
                  <AppearanceControl />
                  <ThemeControl />
                  <ColorControl />
                  <FontsControl />
                  <CardRadiusControl />
                  <ButtonRadiusControl />
                  <FormValuesControl />
                  <WidgetEventControls />
                  <WalletManagementControl />
                  <SkeletonControl />
                  <DefaultChainToken />
                  <LayoutControls />
                  <ReferrerControl />
                  <SlippageToleranceControl />
                </WidgetConfigControls>
                <PlaygroundSettingsControl />
              </ExpandableCardAccordion>
            </TabContentContainer>
            <TabContentContainer value="code">
              <CodeControl />
            </TabContentContainer>
          </TabContext>
        </DrawerContentContainer>
      </Drawer>
    </BrowserRouter>
  )
}
