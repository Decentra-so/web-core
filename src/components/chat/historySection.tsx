import useTxHistory from '@/hooks/useTxHistory'
import useWallet from '@/hooks/wallets/useWallet'
import { Box } from '@mui/material'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import useOnboard from '@/hooks/wallets/useOnboard'
import { createWeb3 } from '@/hooks/wallets/web3'
import { getExistingAuth } from '@/components/auth-sign-in/helpers'
import DecentraPaginatedTxns from '../common/PaginatedTxns/DecentraPaginatedTxns'
import { AuthField } from './authField'

export const HistorySection = () => {
  //auth
  const [auth, setAuth] = useState<boolean>(false)
  const wallet = useWallet()
  const onboard = useOnboard()
  const [authToken, setAuthToken] = useState<string | any>('')

  //scroll to top
  const top = useRef<HTMLDivElement>(null)
  
  const scrollToTop = useCallback(() => {
    if (!top.current) return
    const { current: topOfHistory } = top
    const rect = topOfHistory.getBoundingClientRect()
    if (rect.top >= 0 && rect.top <= window.innerHeight) {
      return
    }
    topOfHistory.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToTop()
  }, [])

  useEffect(() => {
    if (!onboard || !wallet) return
    const provider = createWeb3(wallet?.provider)
    const getToken = async () => {
      await getExistingAuth(provider, wallet?.address).then(setAuthToken)
    }
    getToken()
  }, [onboard, wallet?.address, wallet?.provider, auth])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ height: '100%', overflowY: 'auto' }}>
        <Box
          sx={{
            flex: '1 0 auto',
            display: 'flex',
            minHeight: '100%',
            flexDirection: 'column',
            justifyContent: 'start',
            alignItems: 'start',
            gap: '16px',
            p: '0 24px',
          }}
        >
          <Box ref={top} sx={{ height: 35 }} />
          <DecentraPaginatedTxns useTxns={useTxHistory} />
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
        {!authToken &&
          <AuthField setAuth={setAuth} authToken={authToken} />
        }
      </Box>
    </Box>
  )
}
