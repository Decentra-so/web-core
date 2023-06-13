import useSafeAddress from '@/hooks/useSafeAddress'
import useWallet from '@/hooks/wallets/useWallet'
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import React, { useCallback } from 'react'
import TxListItem from '../transactions/TxListItem'
import { useState, useEffect, useRef } from 'react'
import useTxHistory from '@/hooks/useTxHistory'
import useTxQueue from '@/hooks/useTxQueue'

const SendMessage = dynamic(() => import('@/components/chat/sendMessage'), { ssr: false })
const LoginButton = dynamic(() => import('@/components/chat/LoginButton'), { ssr: false })

export const ChatSection: React.FC<{
  currentUser: any
  setCurrentUser: any
  group: any
  setGroup: any
}> = ({
  currentUser,
  setCurrentUser,
  group,
  setGroup,
}) => {
  //transactions
  const txHistory = useTxHistory()
  const txQueue = useTxQueue()
  const wallet = useWallet()
  //chat
  const [messages, setMessages] = useState([''])
  const [chatData, setChatData] = useState<any[]>([''])
  const safeAddress = useSafeAddress()
  const [message, setMessage] = useState<string>()
  const bottom = useRef<HTMLDivElement>(null)
  const getLast5Items = (arr: any) => {
    if (arr) {
      return arr.length > 5 ? arr.slice(Math.max(arr.length - 5, 0)) : arr
    }
    return arr
  }

  const getChat = useCallback(() => {
    let allData: any[] = []
    const historyItems = getLast5Items(txHistory.page?.results)
    const queueItems = getLast5Items(txQueue?.page?.results)
    historyItems?.forEach((tx: any) => {
      if (tx.type === 'DATE_LABEL') {
        return
      }
      allData.push({
        data: tx,
        timestamp: tx.transaction.timestamp,
        type: 'tx',
      })
    })
    queueItems?.forEach((tx: any) => {
      if (tx.type === 'LABEL' || tx.type === 'CONFLICT_HEADER') {
        return
      }
      allData.push({
        data: tx,
        timestamp: tx.transaction.timestamp,
        type: 'tx',
      })
    })
    if (!messages.length) {
      setChatData(allData)
      return
    }
    messages?.forEach((message: any) => {
      allData.push({
        data: message,
        timestamp: +message.sentAt * 1000,
        type: 'message',
      })
    })
    allData.sort(function (a, b) {
      if (a['timestamp'] > b['timestamp']) {
        return 1
      } else if (a['timestamp'] < b['timestamp']) {
        return -1
      } else {
        return 0
      }
    })
    setChatData(allData)
  }, [messages, txHistory?.page?.results, txQueue?.page?.results])
  
  useEffect(() => {
    getChat()
  }, [group, messages, currentUser])

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
            p: 3,
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
                        sx={{ background: 'rgb(155 155 155 / 11%)', padding: '12px 16px', borderRadius: '0 10px 10px 10px' }}            
                        primary={
                          <React.Fragment>
                            <Typography sx={{ display: 'inline', pr: '12px', fontWeight: 600 }} component="span">
                              {chat.data.sender.name === wallet?.address ? 'You' : chat?.data?.sender.uid}
                            </Typography>
                            <Typography sx={{ display: 'inline' }} component="span" variant="body2">
                              {chat.timeStamp}
                            </Typography>
                          </React.Fragment>
                        }
                        secondary={
                          <Typography sx={{ display: 'inline' }} component="span">
                            {chat.data.text}
                          </Typography>
                        }
                      />
                    </ListItem>
                  )
                } else if (chat?.type) {
                  return (
                    <ListItem
                      key={index}
                      sx={{ pt: '6px', pb: '6px', width: { sm: '100%', lg: 'calc(100vw - 695px)' } }}
                      alignItems="flex-start"
                      disableGutters
                    >
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
          position: 'sticky',
          bottom: 0,
          p: '0px 24px 12px 24px',
          background: 'var(--color-background-lightcolor)'
        }}
      >
        {currentUser ? (
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
          <LoginButton setCurrentUser={setCurrentUser} user={currentUser} setGroup={setGroup} setMessages={setMessages} />
        )}
      </Box>
    </Box>
  )
}
