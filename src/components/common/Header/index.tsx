import ConnectWallet from '@/components/common/ConnectWallet'
import NotificationCenter from '@/components/notification-center/NotificationCenter'
import { AppRoutes } from '@/config/routes'
import useChainId from '@/hooks/useChainId'
import { useDarkMode } from '@/hooks/useDarkMode'
import useSafeInfo from '@/hooks/useSafeInfo'
import { useAppDispatch } from '@/store'
import { setDarkMode } from '@/store/settingsSlice'
import ChatIcon from '@mui/icons-material/Chat'
import MenuIcon from '@mui/icons-material/Menu'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import ModeNightIcon from '@mui/icons-material/ModeNight'
import WalletIcon from '@mui/icons-material/Wallet'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import { Box, Button, FormControlLabel, IconButton, Paper } from '@mui/material'
import classnames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { Dispatch, SetStateAction } from 'react'
import { useState, type ReactElement } from 'react'
import css from './styles.module.css'

type HeaderProps = {
  onMenuToggle?: Dispatch<SetStateAction<boolean>>
}

enum Pages {
  Wallet = 'Wallet',
  Chat = 'Chat',
  AddressBook = 'Address Book'
}

const Header = ({ onMenuToggle }: HeaderProps): ReactElement => {
  const chainId = useChainId()
  const { safe, safeAddress } = useSafeInfo()
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

  const [selectedButton, setSelectedButton] = useState(Pages.Chat);

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

      <Box display='flex' alignItems='center'>
        <Link href={{ pathname: AppRoutes.wallet, query: { safe: `${safeAddress}` } }} key={`${safe}`} passHref>
          <Button onClick={() => setSelectedButton(Pages.Wallet)} startIcon={<WalletIcon />} className={selectedButton === Pages.Wallet ? css.ButtonNavSelected : css.ButtonNav} size='small'>Wallet</Button>
        </Link>
        <Link href={{ pathname: AppRoutes.chat, query: { safe: `${safeAddress}` } }} key={`${safe}`} passHref>
          <Button onClick={() => setSelectedButton(Pages.Chat)} startIcon={<ChatIcon />} className={selectedButton === Pages.Chat ? css.ButtonNavSelected : css.ButtonNav} size='small'>Chat</Button>
        </Link>
        <Link href={{ pathname: AppRoutes.addressBook, query: { safe: `${safeAddress}` } }} key={`${safe}`} passHref>
          <Button onClick={() => setSelectedButton(Pages.AddressBook)} startIcon={<MenuBookIcon />} className={selectedButton === Pages.AddressBook ? css.ButtonNavSelected : css.ButtonNav} size='small'>Address Book</Button>
        </Link>
      </Box>

      <Box display='flex' alignItems='center' justifyContent='space-evenly'>
        <div className={classnames(css.element)}>
          <FormControlLabel
            sx={{ margin: 0 }}
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
      </Box>
    </Paper>
  )
}

export default Header
