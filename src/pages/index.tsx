import LoadingSpinner from '@/components/new-safe/create/steps/StatusStep/LoadingSpinner'
import { AppRoutes } from '@/config/routes'
import useLastSafe from '@/hooks/useLastSafe'
import { Box, useMediaQuery } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useLayoutEffect } from 'react'

const useIsomorphicEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const IndexPage = () => {
  const router = useRouter()
  const { safe, chain } = router.query
  const lastSafe = useLastSafe()
  const safeAddress = safe || lastSafe
  const matches = useMediaQuery('(max-width: 900px)')

  useIsomorphicEffect(() => {
    if (router.pathname !== AppRoutes.index) {
      return
    }
    console.log(matches)
    router.replace(
      safeAddress
        ? `${AppRoutes.chat}?safe=${safeAddress}`
        : chain
          ? `${AppRoutes.chat}?chain=${chain}`
          : window.innerWidth < 900 ? AppRoutes.safeList : AppRoutes.chat,
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
