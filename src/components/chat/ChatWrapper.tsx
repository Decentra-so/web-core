'use client'

import useSafeAddress from '@/hooks/useSafeAddress'
import useWallet from '@/hooks/wallets/useWallet'
import { useEffect, useState } from 'react'
import { Hidden, Typography, Box } from '@mui/material'
import React from 'react'
import { ChatSection } from '@/components/chat/chatSection'
import { toast } from 'react-toastify'
import { initCometChat, loginWithCometChat, signUpWithCometChat, getMessages, listenForMessage, joinGroup, createNewGroup, getGroup } from '@/services/chat'

const ChatWrapper = () => {

  const [group, setGroup] = useState<any>()
  const [user, setCurrentUser] = useState<any>()
  const [messages, setMessages] = useState<any[]>()
  const [signedUp, setSignedUp] = useState<boolean>(false)
  const wallet = useWallet()
  const safeAddress = useSafeAddress()

  useEffect(() => {

    const init = async () => {
      handleCreateGroup()
      handleJoin()
      handleGetGroup()
      initCometChat()
      handleSignup().then(() => setSignedUp(true)).catch()
      handleLogin()
    }
    init()
  }, [])

  useEffect(() => {
    async function getM() {
      await getMessages(`pid_${safeAddress!}`)
        .then((msgs: any) => {
          console.log(msgs, 'messages 1')
          setMessages(msgs)
        })
        .catch((error) => {
          console.log(error, 'error 1')
          setMessages([])
        })

      await listenForMessage(`pid_${safeAddress!}`)
        .then((msg: any) => {
          setMessages((prevState: any) => [...prevState, msg])
        })
        .catch((error) => console.log(error))
    }
    getM()
  }, [safeAddress])

  const handleJoin = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await joinGroup(`pid_${safeAddress}`)
          .then((user) => {
            console.log(user)
            resolve(user)
          })
          .catch((err) => {
            console.log(err)
            reject(err)
          })
      }),
      {
        pending: 'Signing up...',
        success: 'Signned up successful 👌',
        error: 'Error, maybe you should login instead? 🤯',
      },
    )
    await handleGetGroup()
  }

  const handleCreateGroup = async () => {
    if (!user) {
      toast.warning('You need to login or sign up first.')
      return
    }

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await createNewGroup(`pid_${safeAddress}`, 'safe')
          .then((gp) => {
            setGroup(gp)
            resolve(gp)
          })
          .catch((error) => {
            console.log(error)
            return
          })
      }),
      {
        pending: 'Creating...',
        success: 'Group created 👌',
        error: 'Encountered error 🤯',
      },
    )
    await handleJoin()
    await handleGetGroup()
  }

  const handleGetGroup = async () => {
    if (!user) {
      toast.warning('You need to login or sign up first.')
      return
    }

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await getGroup(`pid_${safeAddress}`)
          .then((gp) => {
            setGroup(gp)
            resolve(gp)
          })
          .catch((error) => console.log(error))
      }),
      {
        pending: 'Creating...',
        success: 'Group created 👌',
        error: 'Encountered error 🤯',
      },
    )
  }

  const handleLogin = async () => {
    if (!wallet?.address) return
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await loginWithCometChat(wallet?.address)
          .then((user) => {
            setCurrentUser(user)
            console.log(user)
          })
          .catch((err) => {
            console.log(err)
            reject()
          })
      }),
      {
        pending: 'Logging in...',
        success: 'Logged in successfully 👌',
        error: 'Error, are you signed up? 🤯',
      },
    )
  }

  const handleSignup = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await signUpWithCometChat(wallet?.address!)
          .then((user) => {
            console.log(user)
            resolve(user)
          })
          .catch((err) => {
            console.log(err)
            reject(err)
          })
      }),
      {
        pending: 'Signing up...',
        success: 'Signed up successfully 👌',
        error: 'Error, maybe you should login instead? 🤯',
      },
    )
  }


  return (
    <Hidden mdDown>
      {
        safeAddress ? (
          <ChatSection
            currentUser={user}
            setCurrentUser={setCurrentUser}
            group={group}
            setGroup={setGroup}
          />
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
  )
}

export default ChatWrapper