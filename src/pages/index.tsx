import { useEffect, useLayoutEffect } from 'react'
import { useRouter } from 'next/router'
import useLastSafe from '@/hooks/useLastSafe'
import { AppRoutes } from '@/config/routes'
import { Box } from '@mui/material'
import LoadingSpinner from '@/components/new-safe/create/steps/StatusStep/LoadingSpinner'

const useIsomorphicEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const IndexPage = () => {
  const router = useRouter()
  const { safe, chain } = router.query
  const lastSafe = useLastSafe()
  const safeAddress = safe || lastSafe

  useIsomorphicEffect(() => {
    if (router.pathname !== AppRoutes.index) {
      return
    }

    router.replace(
      safeAddress
        ? `${AppRoutes.chat}?safe=${safeAddress}`
        : chain
        ? `${AppRoutes.chat}?chain=${chain}`
        : AppRoutes.chat,
    )
  }, [router, safeAddress, chain])

  return <Box sx={{
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
}

export default IndexPage
