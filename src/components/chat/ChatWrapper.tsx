import { ChatSection } from '@/components/chat/chatSection'
import useSafeAddress from '@/hooks/useSafeAddress'
import { Box, Typography, useMediaQuery } from '@mui/material'
import { MobileChat } from './mobileChat'
import dynamic from 'next/dynamic'
import { useAppSelector } from '@/store'
import { selectUserItem, selectGroup } from '@/store/chatServiceSlice'

const Login = dynamic(() => import('@/components/chat/Login'), { ssr: false })

const ChatWrapper = () => {
  const safeAddress = useSafeAddress()

  const user = useAppSelector((state) => selectUserItem(state))
  const group = useAppSelector((state) => selectGroup(state))
  const matches = useMediaQuery('(max-width: 600px)')

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
       {(!user || !group) && <Login />}
    </>
  )
}

export default ChatWrapper
