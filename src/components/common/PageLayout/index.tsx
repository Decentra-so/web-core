import classnames from 'classnames'
import { useState, type ReactElement } from 'react'

import Header from '@/components/common//Header'
import { AppRoutes } from '@/config/routes'
import useDebounce from '@/hooks/useDebounce'
import Footer from '../Footer'
import SafeLoadingError from '../SafeLoadingError'
import SideDrawer from './SideDrawer'
import css from './styles.module.css'

const isNoSidebarRoute = (pathname: string): boolean => {
  return [
    AppRoutes.share.safeApp,
    AppRoutes.newSafe.create,
    AppRoutes.newSafe.load,
    AppRoutes.chat,
    AppRoutes.safeList,
    AppRoutes.addressBook,
    AppRoutes.wallet,
    AppRoutes.index,
    AppRoutes.import,
    AppRoutes.environmentVariables,
    AppRoutes.imprint,
    AppRoutes.privacy,
    AppRoutes.terms,
    AppRoutes.licenses,
  ].includes(pathname)
}

const PageLayout = ({ pathname, children }: { pathname: string; children: ReactElement }): ReactElement => {
  const noSidebar = isNoSidebarRoute(pathname)
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true)
  let isAnimated = useDebounce(!noSidebar, 300)
  if (noSidebar) isAnimated = false

  return (
    <>
      <header className={css.header}>
        <Header onMenuToggle={noSidebar ? undefined : setSidebarOpen} />
      </header>

      {!noSidebar && <SideDrawer isOpen={isSidebarOpen} onToggle={setSidebarOpen} />}

      <div
        className={classnames(css.main, {
          [css.mainNoSidebar]: noSidebar || !isSidebarOpen,
          [css.mainAnimated]: isAnimated,
        })}
      >
        <div className={css.content}>
          <SafeLoadingError>{children}</SafeLoadingError>
        </div>

        <Footer />
      </div>
    </>
  )
}

export default PageLayout
