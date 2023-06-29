import { useAuthRequestChallengeEvm } from '@moralisweb3/next'
import { Box, Button, Typography } from '@mui/material'
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { InjectedConnector } from 'wagmi/connectors/injected'

function SignIn() {
  const { connectAsync } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const { isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { requestChallengeAsync } = useAuthRequestChallengeEvm()

  const handleAuth = async () => {
    if (isConnected) {
      await disconnectAsync()
    }

    const { account, chain } = await connectAsync({
      connector: new MetaMaskConnector(), new InjectedConnector(),
    })

    //@ts-ignore
    const { message } = await requestChallengeAsync({
      address: account,
      chainId: chain.id,
    })

    const signature = await signMessageAsync({ message })
  }

  return (
    <Box p={3}>
      <Typography variant='h3' pb={3}>Web3 Authentication</Typography>
      <Button variant="contained" onClick={handleAuth}>Authenticate via Metamask</Button>
    </Box>
  )
}

export default SignIn
