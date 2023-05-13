import type { Dispatch, SetStateAction } from 'react'
import { type ReactElement } from 'react'
import { useRouter } from 'next/router'
import { IconButton, Paper, FormControlLabel, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import classnames from 'classnames'
import css from './styles.module.css'
import ChainSwitcher from '@/components/common/ChainSwitcher'
import ConnectWallet from '@/components/common/ConnectWallet'
import NotificationCenter from '@/components/notification-center/NotificationCenter'
import { AppRoutes } from '@/config/routes'
import useChainId from '@/hooks/useChainId'
import Link from 'next/link'
import useSafeAddress from '@/hooks/useSafeAddress'
import { setDarkMode } from '@/store/settingsSlice'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import ModeNightIcon from '@mui/icons-material/ModeNight'

type HeaderProps = {
  onMenuToggle?: Dispatch<SetStateAction<boolean>>
}

const Header = ({ onMenuToggle }: HeaderProps): ReactElement => {
  const chainId = useChainId()
  const safeAddress = useSafeAddress()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const isDarkMode = useDarkMode()

  // Logo link: if on Dashboard, link to Welcome, otherwise to the root (which redirects to either Dashboard or Welcome)
  const logoHref = router.pathname === AppRoutes.home ? AppRoutes.welcome : AppRoutes.index

  const handleMenuToggle = () => {
    if (onMenuToggle) {
      onMenuToggle((isOpen) => !isOpen)
    } else {
      router.push(logoHref)
    }
  }

  return (
    <Paper className={css.container}>
      <div className={classnames(css.element, css.menuButton, !onMenuToggle ? css.hideSidebarMobile : null)}>
        <IconButton onClick={handleMenuToggle} size="large" edge="start" color="default" aria-label="menu">
          <MenuIcon />
        </IconButton>
      </div>

      <div className={classnames(css.element, css.hideMobile, css.logo)}>
        <Link href={logoHref} passHref>
          <b>
            Decentra&#123;Pro&#125;
          </b>
        </Link>
      </div>

      <div className={classnames(css.element, css.hideMobile)}>
        <ChainSwitcher />
      </div>
      
      <div className={classnames(css.element)}>
      {/* <Switch checked={isDarkMode} onChange={(_, checked) => dispatch(setDarkMode(checked))} /> */}
                  <FormControlLabel
                    control={
                      <IconButton onClick={() => dispatch(setDarkMode(!isDarkMode))}>
                        {isDarkMode ? <WbSunnyIcon /> : <ModeNightIcon />}
                      </IconButton>
                    }
                    label=""
                  />
      </div>

      <div className={classnames(css.element, css.hideMobile)}>
        <NotificationCenter />
      </div>

      <div className={classnames(css.element, css.connectWallet)}>
        <ConnectWallet />
      </div>

    </Paper>
  )
}

export default Header
