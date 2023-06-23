import useSafeAddress from '@/hooks/useSafeAddress'
import { Hidden, Typography, Box } from '@mui/material'
import React from 'react'
import { ChatSection } from '@/components/chat/chatSection'
import { MobileChat } from './mobileChat'
import dynamic from 'next/dynamic'
import { useAppSelector } from '@/store'
import { selectUserItem, selectGroup } from '@/store/chatServiceSlice'

const Login = dynamic(() => import('@/components/chat/Login'), { ssr: false })

const ChatWrapper = () => {
  const user = useAppSelector((state) => selectUserItem(state))
  const group = useAppSelector((state) => selectGroup(state))

  const safeAddress = useSafeAddress()

  return (
    <>
      <Hidden mdDown>
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
      
      </Hidden>
      <MobileChat />
      {(!user || !group) && <Login />}
    </>

  )
}

export default ChatWrapper