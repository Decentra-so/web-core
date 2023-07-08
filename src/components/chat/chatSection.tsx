import useSafeAddress from '@/hooks/useSafeAddress'
import useTxHistory from '@/hooks/useTxHistory'
import useTxQueue from '@/hooks/useTxQueue'
import useWallet from '@/hooks/wallets/useWallet'
import { useAppSelector } from '@/store'
import { selectGroup, selectUserItem, setChat } from '@/store/chatServiceSlice'
import { Box, List, ListItem } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getMessages, listenForMessage } from '../../services/chat'
import TxListItem from '../transactions/TxListItem'
import ChatMessage from './chatMessage'
import ChatTextField from './chatTextField'

export const ChatSection = () => {
  //state
  const dispatch = useDispatch()
  const group = useAppSelector((state) => selectGroup(state))
  const user = useAppSelector((state) => selectUserItem(state))
  //transactions
  const txHistory = useTxHistory()
  const txQueue = useTxQueue()
  const wallet = useWallet()
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

  useEffect(() => {
    scrollToBottom()
  }, [chatData, messages])

  const getLast5Items = (arr: any) => {
    if (arr) {
      return arr.length > 5 ? arr.slice(Math.max(arr.length - 5, 0)) : arr
    }
    return arr
  }

  useEffect(() => {
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
  }, [safeAddress, user, group])


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
  }, [messages.length, txHistory?.page, txQueue?.page, safeAddress])

  useEffect(() => {
    getChat()
  }, [messages.length, txHistory?.page, txQueue?.page, safeAddress])

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
                      sx={{ margin: '8px 0', pt: '6px', pb: '6px', width: { sm: 'calc(100vw - 48px)', md: 'calc(100vw - 695px)' } }}
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
        {user && group &&
          <ChatTextField currentUser={user} messages={messages} setMessages={setMessages} />
        }
      </Box>
    </Box>
  )
}
