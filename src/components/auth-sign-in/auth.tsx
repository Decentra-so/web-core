
import { Box, Button, Typography } from '@mui/material'
import { useAccount, useDisconnect } from 'wagmi'
import { useState } from 'react'
import useWallet from '@/hooks/wallets/useWallet'
import { createWeb3 } from '@/hooks/wallets/web3'
import { authenticateWallet } from './helpers'

export const SignIn: React.FC<{
	onClose: () => void
  setAuthToken: any
}> = ({ onClose, setAuthToken }) => {
  const { disconnectAsync } = useDisconnect()
  const { isConnected } = useAccount()
  const [loading, setLoading] = useState<boolean>(false)
  const wallet = useWallet()

  const handleAuth = async () => {
    if (isConnected) {
      await disconnectAsync()
    }
    setLoading(true)
    try {
     await handleAuthenticate()
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const handleAuthenticate = async () => {
    if (!wallet) return
    const provider = createWeb3(wallet?.provider)
    const token = await authenticateWallet(provider)
    if (token.length) {
      setAuthToken(token)
      setLoading(false)
      onClose()
    }
  }

  return (
    <Box p={3}>
      <Typography variant='h3' pb={3}>Welcome to <b>Decentra</b></Typography>
      <Typography variant='subtitle2' pb={3}>By connecting your wallet you are agreeing to our terms of service</Typography>
      <Button variant="contained" onClick={handleAuth} disabled={loading}>
        { loading ? 'loading' : 'Authenticate' }
      </Button>
    </Box>
  )
}

export default SignIn
