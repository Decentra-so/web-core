import { Link } from '@mui/material'
import { useState } from 'react'
import useWallet from '@/hooks/wallets/useWallet'
import { createWeb3 } from '@/hooks/wallets/web3'
import { authenticateWallet } from './helpers'

export const SignInLink: React.FC<{
  setAuth: any
}> = ({ setAuth }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const wallet = useWallet()

  const handleAuthenticate = async () => {
    if (!wallet) return
    const provider = createWeb3(wallet?.provider)
    const token = await authenticateWallet(provider)
    if (token.length) {
      setAuth(true)
      setLoading(false)
    }
  }

  return (
    <Link onClick={handleAuthenticate}>Verify here</Link>
  )
}

export default SignInLink
