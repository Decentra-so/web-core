import useSafeAddress from '@/hooks/useSafeAddress'
import useWallet from '@/hooks/wallets/useWallet'
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material'
import dynamic from 'next/dynamic'
import React from 'react'
import TxListItem from '../transactions/TxListItem'

const SendMessage = dynamic(() => import('@/components/chat/sendMessage'), { ssr: false })

export const ChatSection: React.FC<{
  chatData: any[]
  message: string
  messages: string[]
  setMessage: any
  setMessages: any
  bottom: any
}> = ({ chatData, message, setMessage, messages, setMessages, bottom }) => {
  const wallet = useWallet()
  const safeAddress = useSafeAddress()
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Box sx={{ height: '100%', overflowY: 'auto' }}>
        <Box
          sx={{
            flex: '1 0 auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            alignItems: 'start',
            gap: '16px',
            p: '8px 19px 8px 24px',
            bgcolor: 'var(--color-background-lightcolor)',
            height: 'calc(100vh - 189px)',
            overflowY: 'overlay',
            marginRight: '5px',
          }}
        >
          <List>
            {chatData &&
              chatData.map((chat, index) => {
                if (chat.type === 'message' && chat?.data?.sender) {
                  return (
                    <ListItem
                      sx={{
                        display: 'flex',
                        alignItems: 'start',
                        p: 0,
                        width: 'fit-content',
                      }}
                      key={index}
                      alignItems="flex-start"
                    >
                      <ListItemAvatar sx={{ minWidth: 32, pr: '16px' }}>
                        <Avatar sx={{ width: 32, height: 32 }} alt={chat?.data?.sender.uid || ''} />
                      </ListItemAvatar>
                      <ListItemText
                        sx={{ background: 'rgb(155 155 155 / 11%)', padding: '14px', borderRadius: '0 12px 12px 12px' }}            
                        primary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: 'inline', pr: '12px', fontWeight: 600, fontSize: '15px' }}
                              component="span"
                            >
                              {chat.data.sender.name === wallet?.address ? 'You' : chat?.data?.sender.uid}
                            </Typography>
                            <Typography sx={{ display: 'inline' }} component="span" variant="body2">
                              {chat.timeStamp}
                            </Typography>
                          </React.Fragment>
                        }
                        secondary={
                            <Typography
                              sx={{ display: 'inline', fontSize: '15px' }}
                              component="span"
                            >
                              {chat.data.text}
                            </Typography>
                        }   
                      />
                    </ListItem>
                  )
                } else {
                  return (
                    <ListItem key={index} sx={{ pt: '6px', pb: '6px' }} alignItems="flex-start" disableGutters>
                      <TxListItem key={`${index}-tx`} item={chat?.data} />
                      <ListItemText
                         primary={
                           <React.Fragment>
                             <Typography
                               sx={{ display: 'inline', pr: '8px', fontWeight: 600 }}
                               component="span"
                               variant="subtitle2"
                             >
                               {chat.name}
                             </Typography>
                             <Typography sx={{ display: 'inline' }} component="span" variant="body2">
                               {chat.timeAgo}
                             </Typography>
                           </React.Fragment>
                         }
                         secondary={chat.message}
                    />
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
          bgcolor: 'var(--color-background-lightcolor)',
          position: 'sticky',
          bottom: 0,
        }}
      >
        <Box sx={{ width: '100%', display: 'flex', gap: '16px', p: 3, pt: 0, pb: '12px' }}>
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
      </Box>
    </Box>
  )
}
