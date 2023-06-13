import { Hidden, Typography, Box } from '@mui/material'
import React from 'react'
import { ChatSection } from './chatSection'

export const DesktopChat: React.FC<{
  currentUser: any
  setCurrentUser: any
  setGroup: any
  group: any
  safe: string
}> = ({ setCurrentUser, currentUser, setGroup, group, safe }) => {
  return (
    <Hidden mdDown>
      {
        safe ? (
          <ChatSection
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            group={group}
            setGroup={setGroup}
          />
        ) : (
          <Box
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
            }}
          >
            <title>No Chat Selected</title>
            <Typography>
              Please add, or select a chat from the sidebar.
            </Typography>
          </Box>
        )
      }
     
    </Hidden>
  )
}
