import useSafeAddress from '@/hooks/useSafeAddress'
import { useState } from 'react'
import { Hidden, Typography, Box } from '@mui/material'
import React from 'react'
import { ChatSection } from '@/components/chat/chatSection'
import useSafeInfo from '@/hooks/useSafeInfo'
import { MobileChat } from './mobileChat'

const ChatWrapper = () => {
  const [group, setGroup] = useState<any>()
  const [user, setCurrentUser] = useState<any>()
  const safeAddress = useSafeAddress()
  const { safe } = useSafeInfo()
  const owners = safe?.owners || ['']
  const ownerArray = owners.map((owner) => owner.value)

  return (
    <>
      <Hidden mdDown>
        {
          safeAddress ? (
            <ChatSection
              currentUser={user}
              setCurrentUser={setCurrentUser}
              setGroup={setGroup}
              group={group}
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
      <MobileChat
        group={group}
        owners={ownerArray}
        currentUser={user}
        setCurrentUser={setCurrentUser}
        setGroup={setGroup}
      />
    </>

  )
}

export default ChatWrapper