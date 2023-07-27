import useSafeAddress from '@/hooks/useSafeAddress'
import useTxHistory from '@/hooks/useTxHistory'
import useTxQueue from '@/hooks/useTxQueue'
import useWallet from '@/hooks/wallets/useWallet'
import { useAppSelector } from '@/store'
import { selectGroup, selectUserItem, setChat } from '@/store/chatServiceSlice'
import { Box, List, ListItem, useMediaQuery, ListItemAvatar } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getMessages, listenForMessage } from '../../services/chat'
import TxListItemChat from '../transactions/TxListItemChat'
import ChatMessage from './chatMessage'
import useOnboard from '@/hooks/wallets/useOnboard'
import { createWeb3 } from '@/hooks/wallets/web3'
import { getExistingAuth } from '@/components/auth-sign-in/helpers'
import ChatTextField from './chatTextField'

export const ChatSection: React.FC<{ drawerWidth?: number, drawerOpen?: boolean }> = ({ drawerWidth, drawerOpen }) => {
  const matches = useMediaQuery('(min-width:901px)');
  //state
  const [auth, setAuth] = useState<boolean>(false)
  const wallet = useWallet()
  const onboard = useOnboard()
  const [authToken, setAuthToken] = useState<string | any>('')
  const dispatch = useDispatch()
  const group = useAppSelector((state) => selectGroup(state))
  const user = useAppSelector((state) => selectUserItem(state))
  //transactions
  const txHistory = useTxHistory()
  const txQueue = useTxQueue()
  //chat
  const [messages, setMessages] = useState([''])
  const [chatData, setChatData] = useState<any[]>([''])
  const safeAddress = useSafeAddress()
  const bottom = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    if (!bottom.current) return
    const { current: bottomOfChat } = bottom
    const rect = bottomOfChat.getBoundingClientRect()
    if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
      return
    }
    bottomOfChat.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const getChat = useCallback(() => {

    let allData: any[] = []
    const historyItems = txHistory.page?.results
    const queueItems = txQueue?.page?.results
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
    authToken && messages?.forEach((message: any) => {
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
    if (JSON.stringify(allData) !== JSON.stringify(chatData))     setChatData(allData)

  }, [messages, txHistory?.page, txQueue?.page, safeAddress])

  useEffect(() => {
    if (!onboard || !wallet) return
    const provider = createWeb3(wallet?.provider)
    const getToken = async () => {
      await getExistingAuth(provider, wallet?.address).then(setAuthToken)
    }
    getToken()
  }, [onboard, wallet?.address, wallet?.provider, auth])

  useEffect(() => {
    scrollToBottom()
  }, [chatData])

  useEffect(() => {
    if (!authToken) return
    async function getM() {
      await getMessages(`pid_${safeAddress!}`)
        .then((msgs: any) => {
          dispatch(setChat({ safeAddress, messages: msgs }))
          setMessages(msgs)
        })
        .catch((error) => {
          setMessages([])
        })

      await listenForMessage(`pid_${safeAddress!}`)
        .then((msg: any) => {
          setMessages((prevState: any) => [...prevState, msg])
        })
        .catch((error) => console.log(error))
    }
    getM()
  }, [safeAddress, user, group, authToken])

  useEffect(() => {
    getChat()
  }, [messages, txHistory?.page, txQueue?.page, safeAddress])

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

                if (chat.type === 'message' && !chat.data.text) return
                if (chat.type === 'message' && chat?.data?.sender) {
                  return (
                    <ChatMessage key={index} chat={chat} wallet={wallet} />
                  )
                } else if (chat?.type) {
                  if (matches) {
                    if (drawerOpen) {
                      return (
                        <ListItem
                          key={index}
                          sx={{ margin: '8px 0px', padding: '6px 0px', width: 'calc(100vw - 695px)' }}
                          alignItems="flex-start"
                          disableGutters
                        >
                          <ListItemAvatar sx={{ minWidth: 32, pr: '16px', mt: '0' }}>
						                <svg height="32px" width="32px">
                              <image href="/images/actual-safe-logo-green.png" height="32px" width="32px" />
                            </svg>
		                      </ListItemAvatar>
                          <TxListItemChat key={`${index}-tx`} item={chat?.data} />
                        </ListItem>
                      )
                    } else {
                      return (
                        <ListItem
                          key={index}
                          sx={{ margin: '8px 0px', padding: '6px 0px', width: `calc(100vw - (695px - ${drawerWidth}px))` }}
                          alignItems="flex-start"
                          disableGutters
                        >
                          <ListItemAvatar sx={{ minWidth: 32, pr: '16px', mt: '0' }}>
						                <svg height="32px" width="32px">
                              <image href="/images/actual-safe-logo-green.png" height="32px" width="32px" />
                            </svg>
		                      </ListItemAvatar>
                          <TxListItemChat key={`${index}-tx`} item={chat?.data} />                        
                        </ListItem>
                      )
                    }
                  } else {
                    return (
                      <ListItem
                        key={index}
                        sx={{ margin: '8px 0px', padding: '6px 0px', width: 'calc(100vw - 48px)' }}
                        alignItems="flex-start"
                        disableGutters
                      >
                          <ListItemAvatar sx={{ minWidth: 32, pr: '16px', mt: '0' }}>
						                <svg height="32px" width="32px">
                              <image href="/images/actual-safe-logo-green.png" height="32px" width="32px" />
                            </svg>
		                      </ListItemAvatar>
                          <TxListItemChat key={`${index}-tx`} item={chat?.data} />                      
                      </ListItem>
                    )
                  }
                }
              })}
            <Box ref={bottom} sx={{ height: 35 }} />
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
        {user && group &&
          <ChatTextField messages={messages} setMessages={setMessages} authToken={authToken} setAuth={setAuth} />
        }
      </Box>
    </Box>
  )
}
