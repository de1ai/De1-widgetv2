import SaveIcon from '@mui/icons-material/Save'
import { Button } from '@mui/material'
import { useState } from 'react'
import { useConfigApi } from '../../../providers/ConfigApiProvider/ConfigApiProvider'
import { useConfig } from '../../../store/widgetConfig/useConfig'
import { getConfigOutput } from '../../../store/widgetConfig/utils/getConfigOutput'

export const SaveConfigControl = () => {
  const { config } = useConfig()
  const configApi = useConfigApi()
  const [loading, setLoading] = useState(false)
  const [savedHash, setSavedHash] = useState<string | null>(null)

  const handleSave = async () => {
    if (!configApi) {
      console.warn('ConfigApi not provided, cannot save config')
      return
    }

    try {
      setLoading(true)
      const configOutput = getConfigOutput(config || {})
      const response = await configApi.setConfig(configOutput)
      
      // Assume server response data structure contains hash field
      const hash = response?.data?.hash || response?.data?.data?.hash || response?.hash
      
      if (hash) {
        setSavedHash(hash)
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
      setLoading(false)
    }
  }

  if (!configApi) {
    return null
  }

  return (
    <Button
      variant="contained"
      startIcon={<SaveIcon />}
      onClick={handleSave}
      disabled={loading}
      fullWidth
      sx={{ mt: 2 }}
    >
      {loading ? 'Saving...' : savedHash ? 'Saved' : 'Save Config'}
    </Button>
  )
}

