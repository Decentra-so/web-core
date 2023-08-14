import useSafeAddress from '@/hooks/useSafeAddress'
import useWallet from '@/hooks/wallets/useWallet'
import { useAppSelector } from '@/store'
import { selectGroup, selectUserItem, setChat } from '@/store/chatServiceSlice'
import { Box, List, ListItem, Button } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getMessages, listenForMessage, fetchMoreMessages } from '../../services/chat'
import ChatMessage from './chatMessage'
import useOnboard from '@/hooks/wallets/useOnboard'
import { createWeb3 } from '@/hooks/wallets/web3'
import { getExistingAuth } from '@/components/auth-sign-in/helpers'
import ChatTextField from './chatTextField'
import { getCookie } from "typescript-cookie";

const fetchMore = async (
  id: string,
  messages: any[] | undefined,
  dispatch: any,
  setMessages: any,
  setMoreMessages: any,
) => {
  console.log('fetch more')
  try {
    const msgs: any = await fetchMoreMessages(`pid_${id}`, messages || []);
    console.log(msgs, 'msgs')
    dispatch(setChat({ safeAddress: id, messages: msgs }));
    if (msgs.length < 20) setMoreMessages(false);
    setMessages([...msgs, ...messages || []])
  } catch (e) {
    console.log(e, 'cant fetch more messages');
  }
}

export const ChatSection = () => {
  //state auth
  const [auth, setAuth] = useState<boolean>(false)
  const wallet = useWallet()
  const onboard = useOnboard()
  const [authToken, setAuthToken] = useState<string | any>('')
  const dispatch = useDispatch()
  const group = useAppSelector((state) => selectGroup(state))
  const user = useAppSelector((state) => selectUserItem(state))
  const authCookie = getCookie(wallet?.address || '')
  //chat
  const [messages, setMessages] = useState<any[]>([''])
  const safeAddress = useSafeAddress()
  const bottom = useRef<HTMLDivElement>(null)
  const [moreMessages, setMoreMessages] = useState(true);

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
    if (!onboard || !wallet) return
    const provider = createWeb3(wallet?.provider)
    const getToken = async () => {
      await getExistingAuth(provider, wallet?.address).then(setAuthToken)
    }
    getToken()
  }, [onboard, wallet?.address, wallet?.provider, auth])

  useEffect(() => {
    if (!authToken) return
    async function getM() {
      await getMessages(`pid_${safeAddress!}`)
        .then((msgs: any) => {
          dispatch(setChat({ safeAddress, messages: msgs }))
          setMessages(msgs)
          scrollToBottom()
        })
        .catch((error) => {
          setMessages([])
        })

      await listenForMessage(`pid_${safeAddress!}`)
        .then((msg: any) => {
          setMessages((prevState: any) => [...prevState, msg])
          scrollToBottom()
        })
        .catch((error) => console.log(error))
    }
    getM()
  }, [safeAddress, user, group, authToken])

  const handleSendMessage = async (message: string) => {
    setMessages((prevState: any) => [...prevState, message])
    scrollToBottom()
  }
  console.log(auth, authToken, 'auth')
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }} >
      <Box sx={{ height: '100%'}}>
        <Box
          sx={{
            flex: '1 0 auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            alignItems: 'start',
            overflowY: 'auto',
            gap: '16px',
            p: '0 24px',
          }}
        >
          <List sx={{ height: '100%'}}>
            {authToken && authCookie && moreMessages ? (
              <Button
                onClick={
                  () => fetchMore(safeAddress, messages, dispatch, setMessages, setMoreMessages)
                }
              >
                load more
              </Button>
              ) : (
                <div>Beginning of conversation.</div>
              )
            }
              {authToken && authCookie && messages &&
                messages.map((chat, index) => {
                  if (chat?.receiverId !== `pid_${safeAddress!.toLocaleLowerCase()}`) return
                  if (!chat.text) return
                  if (chat?.sender) {
                    return (
                      <ChatMessage key={`msg-${index}`} chat={chat} wallet={wallet} />
                    )
                  }
                },
              )}
              <Box ref={bottom} sx={{ height: 35 }} />
              {!messages ? <ListItem>No Chat</ListItem> : ''}
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
          <ChatTextField setMessages={handleSendMessage} authToken={authToken} setAuth={setAuth} />
        }
      </Box>
    </Box>
  )
}
