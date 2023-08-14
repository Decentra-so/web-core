import { Box } from '@mui/material'
import React from 'react'
import Messages from '@/pages/transactions/messages'

export const MessagesSection = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ height: '100%', overflowY: 'auto' }}>
        <Box
          sx={{
            flex: '1 0 auto',
            display: 'flex',
            minHeight: '100vh',
            flexDirection: 'column',
            justifyContent: 'start',
            alignItems: 'start',
            gap: '16px',
            p: '0 24px',
          }}
        >
          <Messages showTabs={false} />
        </Box>
      </Box>
    </Box>
  )
}
