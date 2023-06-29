import { useAuthRequestChallengeEvm } from '@moralisweb3/next'
import { Box, Button, Typography } from '@mui/material'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import type { EIP1193Provider } from '@web3-onboard/core'

const Auth = () => {
  const router = useRouter()
  const { connectAsync } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const { isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { requestChallengeAsync } = useAuthRequestChallengeEvm()
  const { push } = useRouter()
  const [auth, setAuth] = useState<any>()

  const handleAuth = async () => {
    if (isConnected) {
      await disconnectAsync()
    }

    const { account, chain } = await connectAsync({
      connector: new InjectedConnector({  
       name: 'ethereum',     
    getProvider: () =>
      typeof window !== 'undefined' && !!window?.ethereum,
  },
}),
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
      callbackUrl: `/chat?safe=${router.query.safe}`,
    })
    /**
     * instead of using signIn(..., redirect: "/user")
     * we get the url from callback and push it to the router to avoid page refreshing
     */
    setAuth(url)
    push(url)
  }

  if (!auth) {
    return (
      <Box p={3}>
        <Typography variant='h3' pb={3}>Web3 Authentication</Typography>
        <Button variant="contained" onClick={handleAuth}>Authenticate via Metamask</Button>
      </Box>
    )
  }
}

export default Auth
