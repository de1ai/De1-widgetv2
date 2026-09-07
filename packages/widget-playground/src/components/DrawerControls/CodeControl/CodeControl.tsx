import TabContext from '@mui/lab/TabContext'
import { Box, Typography } from '@mui/material'
import { GatsbyLogo } from '../../../logo/Gatsby'
import { NextLogo } from '../../../logo/Next'
import { NuxtLogo } from '../../../logo/Nuxt'
import { RainbowKitLogo } from '../../../logo/RainbowKit'
import { RemixLogo } from '../../../logo/Remix'
import { SvelteLogo } from '../../../logo/Svelte'
import { ViteLogo } from '../../../logo/Vite'
import { VueLogo } from '../../../logo/Vue'
import { useCodeToolValues } from '../../../store/editTools/useCodeToolValues'
import { useEditToolsActions } from '../../../store/editTools/useEditToolsActions'
import { Card } from '../../Card/Card.style'
import { Tab, Tabs } from '../../Tabs/Tabs.style'
import { TabContentContainer } from '../DrawerControls.style'
import { CodeEditor } from './CodeEditor'
import { FontEmbedInfo } from './FontEmbedInfo'
import { ProjectButton } from './ProjectButton'

export const CodeControl = () => {
  const { codeControlTab } = useCodeToolValues()
  const { setCodeControlTab } = useEditToolsActions()

  return (
    <Card
      sx={[
        {
          p: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        },
        codeControlTab === 'config'
          ? {
              flexGrow: 1,
            }
          : {
              flexGrow: 0,
            },
      ]}
    >
      <TabContext value={codeControlTab}>
        <TabContentContainer value="config" sx={{ gap: 1 }}>
          <Typography variant="caption">
            Add this configuration to your widget
          </Typography>
          <CodeEditor />
          <FontEmbedInfo />
        </TabContentContainer>
      </TabContext>
    </Card>
  )
}
