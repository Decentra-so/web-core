import type { NextPage } from 'next'
import LoadingSpinner from '@/components/new-safe/create/steps/StatusStep/LoadingSpinner'
import { useAuthRequestChallengeEvm } from '@moralisweb3/next'
import { Box, Button, Typography, Container } from '@mui/material'
import ConnectionCenter from '@/components/common/ConnectWallet/ConnectionCenter'
import { signIn } from 'next-auth/react'
import useWallet from '@/hooks/wallets/useWallet'
import { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi'
import { useRouter } from 'next/router'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import useLastSafe from '@/hooks/useLastSafe'
import ErrorMessage from '@/components/tx/ErrorMessage'

const Welcome: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false)
 
  const { connectAsync } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const { isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { requestChallengeAsync } = useAuthRequestChallengeEvm()
  const wallet = useWallet()
  const [auth, setAuth] = useState<any>()
  const lastSafe = useLastSafe()
  const { push } = useRouter()

  const handleAuth = async () => {
    setLoading(true)
    
    if (isConnected) {
      await disconnectAsync()
    }

    const { account, chain } = await connectAsync({
      connector: new MetaMaskConnector(),
    })
    //TO-DO: fix this type pls
    //@ts-ignore
    const { message } = await requestChallengeAsync({
      address: account,
      chainId: chain.id,
    })

    const signature = await signMessageAsync({ message })
    // redirect user after success authentication to '/user' page
    //@ts-ignore
    const { url } = await signIn('moralis-auth', {
      message,
      signature,
      redirect: false,
      callbackUrl: lastSafe ? `/chat?safe=${lastSafe}` : '/chat',
    })

    setAuth(url)
    push(url)
    setLoading(false)
  }

  if (!wallet?.address)
    return (
      <Container fixed sx={{ height: '100vh', width: '100vw' }}>
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
          <Typography variant="h4">You are not connected.</Typography>
          <ConnectionCenter />
        </Box>
      </Container>
    )

  if (!auth && wallet?.address) {
    return (
      <Box
        sx={{
          height: '90vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
        }}
      >
        <Typography variant='h3' pb={3}>Web3 Authentication</Typography>
        {
        wallet?.chainId !== "137" ? (
          <ErrorMessage level="info">
            <Typography fontWeight="bold">Wallet network switch</Typography>
            When you submit the transaction, you will be asked to switch your wallet network to Polygon.
          </ErrorMessage>
        ) : ''
        }
        <Button variant="contained" onClick={handleAuth} disabled={loading}>
          
          {
            loading ? 'Loading' : 'Authenticate'
          }
        
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{
      height: '90vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
    }}
    >
      <LoadingSpinner status={0} />
    </Box>
  )
}

export default Welcome
