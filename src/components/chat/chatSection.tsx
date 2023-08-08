import useSafeAddress from '@/hooks/useSafeAddress'
import useWallet from '@/hooks/wallets/useWallet'
import { useAppSelector } from '@/store'
import { selectGroup, selectUserItem, setChat } from '@/store/chatServiceSlice'
import { Box, List, ListItem } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getMessages, listenForMessage } from '../../services/chat'
import ChatMessage from './chatMessage'
import useOnboard from '@/hooks/wallets/useOnboard'
import { createWeb3 } from '@/hooks/wallets/web3'
import { getExistingAuth } from '@/components/auth-sign-in/helpers'
import ChatTextField from './chatTextField'

export const ChatSection: React.FC<{ drawerWidth?: number, drawerOpen?: boolean }> = ({ drawerWidth, drawerOpen }) => {
  //state
  const [auth, setAuth] = useState<boolean>(false)
  const wallet = useWallet()
  const onboard = useOnboard()
  const [authToken, setAuthToken] = useState<string | any>('')
  const dispatch = useDispatch()
  const group = useAppSelector((state) => selectGroup(state))
  const user = useAppSelector((state) => selectUserItem(state))
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
    authToken && messages?.forEach((message: any) => {
      allData.push({
        data: message,
        timestamp: +message.sentAt * 1000,
        type: 'message',
      })
    })
    if (JSON.stringify(allData) !== JSON.stringify(chatData)) setChatData(allData)

  }, [messages])

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
  }, [messages, safeAddress])

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
                if (chat.type === 'message' && chat?.data?.receiverId !== `pid_${safeAddress!.toLocaleLowerCase()}`) return
                if (chat.type === 'message' && !chat.data.text) return
                if (chat.type === 'message' && chat?.data?.sender) {
                  return (
                    <ChatMessage key={`msg-${index}`} chat={chat} wallet={wallet} />
                  )
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
