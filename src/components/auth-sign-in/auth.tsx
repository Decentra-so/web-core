import { useAuthRequestChallengeEvm } from '@moralisweb3/next'
import { Box, Button, Typography } from '@mui/material'
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState, useCallback } from 'react'
import { useCurrentChain } from '@/hooks/useChains'
import { switchWalletChain } from '@/services/tx/tx-sender/sdk'
import useWallet from '@/hooks/wallets/useWallet'
import useOnboard from '@/hooks/wallets/useOnboard'

function SignIn() {
  const { connectAsync } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const { isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { requestChallengeAsync } = useAuthRequestChallengeEvm()
  const router = useRouter();
  const currentChain = useCurrentChain()
  const onboard = useOnboard()
  const [loading, setLoading] = useState<boolean>(false)
  const wallet = useWallet()

  // Call this function whenever you want to
  // refresh props!
  const refreshData = () => {
    router.replace(router.asPath);
  }

  const handleChainSwitch = useCallback(async () => {

    if (!onboard || !currentChain) return

    await switchWalletChain(onboard, "137")
  }, [currentChain, onboard])

  const handleAuth = async () => {
    if (isConnected) {
      await disconnectAsync()
    }
    if (wallet?.chainId !== "137") {
      await handleChainSwitch()
    }
    setLoading(true)
    try {
      const { account, chain } = await connectAsync({
        connector: new MetaMaskConnector(),
      })
  
      //@ts-ignore
      const { message } = await requestChallengeAsync({
        address: account,
        chainId: chain.id,
      })
  
      const signature = await signMessageAsync({ message })
  
      //@ts-ignore
      const { url } = await signIn('moralis-auth', {
        message,
        signature,
        redirect: false,
      })
      setLoading(false)
      refreshData();
      
      return url
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  return (
    <Box p={3}>
      <Typography variant='h3' pb={3}>Welcome to <b>Decentra</b></Typography>
      <Typography variant='subtitle2' pb={3}>By connecting your wallet you are agreeing to our terms of service</Typography>
      <Button variant="contained" onClick={handleAuth} disabled={loading}>
        { loading ? 'loading' : 'Authenticate via Metamask' }
      </Button>
    </Box>
  )
}

export default SignIn
