import type { NextPage } from 'next'
import Head from 'next/head'

import { useSafeApps } from '@/hooks/safe-apps/useSafeApps'
import SafeAppList from '@/components/safe-apps/SafeAppList'

const BookmarkedSafeApps: NextPage = () => {
  const {
    pinnedSafeApps: bookmarkedSafeApps,
    pinnedSafeAppIds: bookmarkedSafeAppsId,
    togglePin: onBookmarkSafeApp,
  } = useSafeApps()

  return (
    <>
      <Head>
        <title>{'Bookmarked Decentra Apps'}</title>
      </Head>

      <main>
        <SafeAppList
          safeAppsList={bookmarkedSafeApps}
          bookmarkedSafeAppsId={bookmarkedSafeAppsId}
          onBookmarkSafeApp={onBookmarkSafeApp}
        />
      </main>
    </>
  )
}

export default BookmarkedSafeApps
