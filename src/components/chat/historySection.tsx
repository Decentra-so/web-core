import useTxHistory from '@/hooks/useTxHistory'
import useWallet from '@/hooks/wallets/useWallet'
import { Box, Button } from '@mui/material'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import useOnboard from '@/hooks/wallets/useOnboard'
import { createWeb3 } from '@/hooks/wallets/web3'
import { getExistingAuth } from '@/components/auth-sign-in/helpers'
import DecentraPaginatedTxns from '../common/PaginatedTxns/DecentraPaginatedTxns'
import { AuthField } from './authField'
import { useTxFilter } from '@/utils/tx-history-filter'
import TxFilterForm from '@/components/transactions/TxFilterForm'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export const HistorySection = () => {
  
  //auth
  const [auth, setAuth] = useState<boolean>(false)
  const wallet = useWallet()
  const onboard = useOnboard()
  const [authToken, setAuthToken] = useState<string | any>('')
  //tx filters
  const [showFilter, setShowFilter] = useState(false)
  const [filter] = useTxFilter()

  const toggleFilter = () => {
    setShowFilter((prev) => !prev)
  }
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

  
  const ExpandIcon = showFilter ? ExpandLessIcon : ExpandMoreIcon
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
          {showFilter && <TxFilterForm modal={true} toggleFilter={toggleFilter} />}
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
             <Button variant="outlined" onClick={toggleFilter} size="small" endIcon={<ExpandIcon />}>
            {filter?.type ?? 'Filter'}
          </Button>
      </Box>
    </Box>
  )
}
