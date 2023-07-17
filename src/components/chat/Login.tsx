import useSafeAddress from '@/hooks/useSafeAddress'
import useWallet from '@/hooks/wallets/useWallet'
import { setUser, setGroup } from '@/store/chatServiceSlice'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { initCometChat, loginWithCometChat, signUpWithCometChat, joinGroup, createNewGroup, getGroup } from '../../services/chat'
import { useAppSelector } from '@/store'
import { selectUserItem } from '@/store/chatServiceSlice'

const Login = () => {
  const wallet = useWallet()
  const safeAddress = useSafeAddress()
  const dispatch = useDispatch()
  const user = useAppSelector((state) => selectUserItem(state))

  useEffect(() => {
    const init = () => {
      initCometChat()
      handleSignup().then(handleLogin).catch(handleLogin)
      handleCreateGroup().then(handleJoin).catch(handleGetGroup)
      handleGetGroup().then(handleJoin)
      handleJoin()
    }
    init()
  }, [user])

  const handleJoin = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await joinGroup(`pid_${safeAddress}`)
          .then((user) => {
            resolve(user)
          })
          .catch((err) => {
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
            dispatch(setGroup({ group: gp }))
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
            dispatch(setGroup({ group: gp }))
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
            dispatch(setUser({ user }))
          })
          .catch((err) => {
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
    <></>
  )
}

export default Login
