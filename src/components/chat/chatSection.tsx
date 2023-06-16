import useSafeAddress from '@/hooks/useSafeAddress'
import useWallet from '@/hooks/wallets/useWallet'
import { Box, List, ListItem, TextField, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import React from 'react'
import TxListItem from '../transactions/TxListItem'
import ChatMessage from './chatMessage'

const SendMessage = dynamic(() => import('@/components/chat/sendMessage'), { ssr: false })
const LoginButton = dynamic(() => import('@/components/chat/LoginButton'), { ssr: false })
const JoinButton = dynamic(() => import('@/components/chat/JoinButton'), { ssr: false })

export const ChatSection: React.FC<{
  currentUser: any
  setCurrentUser: any
  group: any
  setGroup: any
  chatData: any[]
  message: string
  messages: string[]
  setMessage: any
  setMessages: any
  bottom: any
}> = ({
  currentUser,
  setCurrentUser,
  group,
  setGroup,
  chatData,
  message,
  setMessage,
  messages,
  setMessages,
  bottom,
}) => {
    const wallet = useWallet()
    const safeAddress = useSafeAddress()
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
            <List>
              {chatData &&
                chatData.map((chat, index) => {
                  if (chat.type === 'message' && chat?.data?.sender) {
                    return (
                      <ChatMessage key={index} chat={chat} wallet={wallet} />
                    )
                  } else if (chat?.type) {
                    return (
                      <ListItem
                        key={index}
                        sx={{ margin: '8px 0', pt: '6px', pb: '6px', width: { sm: '100%', lg: 'calc(100vw - 695px)' } }}
                        alignItems="flex-start"
                        disableGutters
                      >
                        <TxListItem key={`${index}-tx`} item={chat?.data} />
                      </ListItem>
                    )
                  }
                })}
              <Box ref={bottom} sx={{ height: 0 }} />
              {!chatData ? <ListItem>No Chat</ListItem> : ''}
            </List>
          </Box>
        </Box>
        <Box
          sx={{
            flexShrink: 0,
            position: 'sticky',
            bottom: 0,
            p: '0px 24px 12px 24px',
            background: 'var(--color-background-lightcolor)'
          }}
        >
          {currentUser && group ? (
            <Box sx={{ width: '100%', display: 'flex', gap: '16px' }}>
              <TextField
                sx={{ flexGrow: 1 }}
                label="Type Something"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <SendMessage
                message={message}
                safeAddress={safeAddress}
                setMessages={setMessages}
                setMessage={setMessage}
                prevState={messages}
              />
            </Box>
          ) : (
            <Box
              sx={{
                width: { sm: '100%', lg: 'calc(100vw - 695px)' },
                border: '1px solid var(--color-border-light)',
                borderRadius: '6px',
                p: 3,
              }}
            >
              <Typography pb={1} fontSize="sm" fontWeight={600}>
                Join the chat
              </Typography>
              <Typography paragraph fontSize="xs">
                To view messages, click the button below
              </Typography>
              {!currentUser ? (
                <LoginButton setCurrentUser={setCurrentUser} />
              ) : currentUser && !group ? (
                <JoinButton user={currentUser} setGroup={setGroup} setMessages={setMessages} />
              ) : (
                ''
              )}
            </Box>
          )}
        </Box>
      </Box>
    )
  }
