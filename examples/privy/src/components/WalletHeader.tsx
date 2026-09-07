import { Box, Typography } from '@mui/material'
import { PrivyButton } from './PrivyButton'

export function WalletHeader() {
  return (
    <Box
      p={2}
      mb={2}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      color="#fff"
    >
      <Typography px={2} fontWeight={600} fontSize={24}>
      De¹ Exchange Widget
      </Typography>
      <Box display="flex" alignItems="center">
        <PrivyButton />
      </Box>
    </Box>
  )
}
