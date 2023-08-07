import { Link } from '@mui/material'
import { useState, useEffect   } from 'react'
import useWallet from '@/hooks/wallets/useWallet'
import { createWeb3 } from '@/hooks/wallets/web3'
import { authenticateWallet } from './helpers'
import { setCookie } from 'typescript-cookie';

export const SignInLink: React.FC<{
  setAuth: any
}> = ({ setAuth }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [nonce, setNonce] = useState<string>('')

  const wallet = useWallet()

  useEffect(() =>  {
    const handleNonce = async() => {
      await handleGetNonce()
    }
    if (wallet?.address) {
      handleNonce()
    }
  }, [wallet?.address])

  const handleGetNonce = async () => {
    try {
      const address = wallet?.address
      const response = await fetch('/api/nonce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        throw new Error('Failed to get nonce.');
      }

      const data = await response.json();
      setNonce(data.nonce);
    } catch (error: any) {
      console.error('Error fetching nonce:', error.message);
    }
  };

  const handleAuthenticate = async () => {
    if (!wallet) return
    const address = wallet?.address
    const provider = createWeb3(wallet?.provider)
    const token = await authenticateWallet(provider, nonce)

    const loginResponse = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address, token, nonce }),
    });

    const data = await loginResponse.json();
    setCookie(address, data.token, { path: '/' });
    if (token.length) {
      setAuth(true)
      setLoading(false)
    }
  }

  return (
    <>
      { nonce ? <Link sx={{ cursor: 'pointer' }} onClick={handleAuthenticate}>Verify here</Link> : 'loading...' }
    </>

  )
}

export default SignInLink
