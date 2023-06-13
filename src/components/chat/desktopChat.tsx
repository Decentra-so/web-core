import { Hidden, Typography, Box } from '@mui/material'
import React from 'react'
import { ChatSection } from './chatSection'

export const DesktopChat: React.FC<{
  chatData: any[]
  message: string
  messages: string[]
  currentUser: any
  setCurrentUser: any
  setGroup: any
  setMessage: any
  setMessages: any
  bottom: any
  group: any
  safe: string
}> = ({ chatData, message, setMessage, messages, setMessages, bottom, setCurrentUser, currentUser, setGroup, group, safe }) => {
  return (
    <Hidden mdDown>
      {
        safe && chatData ? (
          <ChatSection
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            group={group}
            setGroup={setGroup}
            message={message}
            setMessage={setMessage}
            messages={messages}
            setMessages={setMessages}
            bottom={bottom}
            chatData={chatData}
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
