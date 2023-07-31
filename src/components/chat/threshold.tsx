import { ChangeThresholdDialogEditIcon } from '@/components/settings/owner/ChangeThresholdDialog'
import { Box, Typography } from '@mui/material'

export const ThresholdOverview = ({ threshold, owners }: { threshold: number; owners: number }) => {
  return (
    <Box sx={{ display: 'flex', gap: '6px' }}>
            {threshold}/{owners} THRESHOLD
          {owners > 1 && <ChangeThresholdDialogEditIcon />}
    </Box>
  )
}
