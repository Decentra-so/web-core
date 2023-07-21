import { ChatSection } from '@/components/chat/chatSection'
import useSafeAddress from '@/hooks/useSafeAddress'
import { useAppSelector } from '@/store'
import { selectGroup, selectUserItem } from '@/store/chatServiceSlice'
import { Box, Typography, useMediaQuery } from '@mui/material'
import dynamic from 'next/dynamic'
import React from 'react'
import { MobileChat } from './mobileChat'

const Login = dynamic(() => import('@/components/chat/Login'), { ssr: false })

const ChatWrapper: React.FC => {
  const safeAddress = useSafeAddress()

  const user = useAppSelector((state) => selectUserItem(state))
  const group = useAppSelector((state) => selectGroup(state))
  const matches = useMediaQuery('(max-width: 900px)')

  const matchGroup = () => {
    return group?.guid.split('_')[1] !== safeAddress.toLocaleLowerCase()
  }

  return (
    <>
      {!matches &&
        <>
          {
            safeAddress ? (
              <ChatSection />
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
        </>
      }
      {
        matches &&
        <MobileChat />
      }
      {(!user || !group || matchGroup()) && <Login />}
    </>
  )
}

export default ChatWrapper
