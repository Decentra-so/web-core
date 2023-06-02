import CookieBanner from '@/components/common/CookieBanner'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import MetaTags from '@/components/common/MetaTags'
import Notifications from '@/components/common/Notifications'
import PageLayout from '@/components/common/PageLayout'
import { cgwDebugStorage } from '@/components/sidebar/DebugToggle'
import { GATEWAY_URL_PRODUCTION, GATEWAY_URL_STAGING, IS_PRODUCTION } from '@/config/constants'
import { useInitSafeCoreSDK } from '@/hooks/coreSDK/useInitSafeCoreSDK'
import useAdjustUrl from '@/hooks/useAdjustUrl'
import useBeamer from '@/hooks/useBeamer'
import { useDarkMode } from '@/hooks/useDarkMode'
import { useInitSession } from '@/hooks/useInitSession'
import useLoadableStores from '@/hooks/useLoadableStores'
import { useSafeMsgTracking } from '@/hooks/useSafeMsgTracking'
import useSafeNotifications from '@/hooks/useSafeNotifications'
import useTxNotifications from '@/hooks/useTxNotifications'
import useTxPendingStatuses from '@/hooks/useTxPendingStatuses'
import { useTxTracking } from '@/hooks/useTxTracking'
import { useInitWeb3 } from '@/hooks/wallets/useInitWeb3'
import { useInitOnboard } from '@/hooks/wallets/useOnboard'
import useGtm from '@/services/analytics/useGtm'
import Sentry from '@/services/sentry'; // needs to be imported first
import { StoreHydrator } from '@/store'
import '@/styles/globals.css'
import createEmotionCache from '@/utils/createEmotionCache'
import { CacheProvider, type EmotionCache } from '@emotion/react'
import CssBaseline from '@mui/material/CssBaseline'
import type { Theme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material/styles'
import { setBaseUrl as setGatewayBaseUrl } from '@safe-global/safe-gateway-typescript-sdk'
import { SafeThemeProvider } from '@safe-global/safe-react-components'
import { Analytics } from '@vercel/analytics/react'
import { SessionProvider } from 'next-auth/react'
import { type AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import type { ReactNode } from 'react'
import { type ReactElement } from 'react'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

const { provider, webSocketProvider } = configureChains([mainnet], [publicProvider()])

const client = createClient({
  provider,
  webSocketProvider,
  autoConnect: true,
})

// Importing it dynamically to prevent hydration errors because we read the local storage
const TermsBanner = dynamic(() => import('@/components/common/TermsBanner'), { ssr: false })

import useSafeMessageNotifications from '@/hooks/useSafeMessageNotifications'
import useSafeMessagePendingStatuses from '@/hooks/useSafeMessagePendingStatuses'

const GATEWAY_URL = IS_PRODUCTION || cgwDebugStorage.get() ? GATEWAY_URL_PRODUCTION : GATEWAY_URL_STAGING

const InitApp = (): null => {
  setGatewayBaseUrl(GATEWAY_URL)
  useAdjustUrl()
  useGtm()
  useInitSession()
  useLoadableStores()
  useInitOnboard()
  useInitWeb3()
  useInitSafeCoreSDK()
  useTxNotifications()
  useSafeMessageNotifications()
  useSafeNotifications()
  useTxPendingStatuses()
  useSafeMessagePendingStatuses()
  useTxTracking()
  useSafeMsgTracking()
  useBeamer()

  return null
}

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

export const AppProviders = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const isDarkMode = useDarkMode()
  const themeMode = isDarkMode ? 'dark' : 'light'

  return (
    <SafeThemeProvider mode={themeMode}>
      {(safeTheme: Theme) => (
        <ThemeProvider theme={safeTheme}>
          <Sentry.ErrorBoundary showDialog fallback={ErrorBoundary}>
            {children}
          </Sentry.ErrorBoundary>
        </ThemeProvider>
      )}
    </SafeThemeProvider>
  )
}

interface WebCoreAppProps extends AppProps {
  emotionCache?: EmotionCache
}

const WebCoreApp = ({
  Component,
  pageProps,
  router,
  emotionCache = clientSideEmotionCache,
}: WebCoreAppProps): ReactElement => {
  return (
    <StoreHydrator>
      <WagmiConfig client={client}>
        <SessionProvider session={pageProps.session} refetchInterval={0}>
          <Head>
            <title key="default-title">{'Safe{Wallet}'}</title>
            <MetaTags prefetchUrl={GATEWAY_URL} />
          </Head>

          <CacheProvider value={emotionCache}>
            <AppProviders>
              <CssBaseline />

              <InitApp />
              <PageLayout pathname={router.pathname}>
                <>
                  <Component {...pageProps} key={router.query.safe?.toString()} />
                  <Analytics />
                </>
              </PageLayout>
              <CookieBanner />
              <TermsBanner />

              <Notifications />
            </AppProviders>
          </CacheProvider>
        </SessionProvider>
      </WagmiConfig>
    </StoreHydrator>
  )
}

export default WebCoreApp
