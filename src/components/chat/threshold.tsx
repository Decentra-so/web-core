import { ChangeThresholdDialog } from '@/components/settings/owner/ChangeThresholdDialog'
import { Box, Typography } from '@mui/material'

export const ThresholdOverview = ({ threshold, owners }: { threshold: number; owners: number }) => {
  return (
    <Box sx={{ display: 'flex' }}>
          <Typography>
            {threshold} out of {owners} members
          </Typography>

          {owners > 1 && <ChangeThresholdDialog />}
    </Box>
  )
}
