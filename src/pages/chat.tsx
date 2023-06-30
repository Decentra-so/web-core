import { ChatOverview } from '@/components/chat/chatOverview'
import { AuthModal } from '@/components/chat/modals/AuthModal'
import ViewCreateSafe from '@/components/chat/modals/CreateSafe'

import ViewSettingsModal from '@/components/chat/modals/ViewSettingsModal'
import { SafeList } from '@/components/chat/SafeList'
import FormattedName from '@/components/common/FormattedName/FormattedName'
import Identicon from '@/components/common/Identicon'
import { AppRoutes } from '@/config/routes'
import useSafeInfo from '@/hooks/useSafeInfo'
import useWallet from '@/hooks/wallets/useWallet'
import { ArrowBackIos } from '@mui/icons-material'
import SettingsIcon from '@mui/icons-material/Settings'
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar'
import {
  Box, Button, Container,
  Drawer,
  Hidden,
  IconButton, Toolbar,
  Typography,
  useMediaQuery
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { getSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
const ChatWrapper = dynamic(() => import('@/components/chat/ChatWrapper'), { ssr: false })

const drawerWidth = 360

const Main = styled('div', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean
}>(({ theme, open }) => ({
  flexGrow: 1,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: -drawerWidth,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  }),
}))

//Get auth session, if not reroute
export async function getServerSideProps(context: any) {
  const session = await getSession(context)

  return {
    props: { session: session || null },
  }
}

const Chat: React.FC<{
  session: any
}> = ({ session }) => {
  console.log(session, 'user')
  const matches = useMediaQuery('(max-width: 600px)')
  //routing
  const router = useRouter()
  //modals and modal control
  const [createSafe, setCreateSafe] = useState<boolean>(false)
  const [settings, toggleSettings] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(true)
  const [auth, setAuth] = useState<boolean>(false)
  //user and safe
  const wallet = useWallet()
  const { safe, safeAddress } = useSafeInfo()
  const owners = safe?.owners || ['']
  const ownerArray = owners.map((owner) => owner.value)

  useEffect(() => {
    if (session?.user?.address === wallet?.address && wallet?.address) {
      setAuth(false)
    }
    if (session?.user?.address !== wallet?.address && wallet?.address) {
      setAuth(true)
    }
    if (router.asPath.includes('chain')) {
      setCreateSafe(true)
    }
  }, [wallet?.address, session?.user?.address])

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }

    setOpen(open)
  }

  return (
    <>
      {auth && <AuthModal open={auth} onClose={() => setAuth(!auth)} />}
      {settings && <ViewSettingsModal open={settings} onClose={() => toggleSettings(!settings)} />}
      {createSafe && <ViewCreateSafe open={createSafe} onClose={() => setCreateSafe(!createSafe)} />}
      <Head>
        <title>Decentra &mdash; Chat</title>
      </Head>
      <Box sx={{ display: 'flex' }}>
        <Hidden mdDown>
          <Drawer
            sx={{
              width: 287,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: 287,
                bgcolor: 'var(--color-background-lightcolor)',
                boxSizing: 'border-box',
                height: 'calc(100vh - var(--header-height))',
                top: 'var(--header-height)',
                borderRadius: '0',
                borderRight: '1px solid var(--color-border-light)',
              },
            }}
            variant="permanent"
            anchor="left"
          >
            <SafeList createSafe={createSafe} setCreateSafe={setCreateSafe} />
          </Drawer>
        </Hidden>
        <Main open={open} sx={{ flexGrow: 1, bgcolor: 'var(--color-background-lightcolor)' }}>
          <Box display="flex">
            <Box flexGrow={1}>
              <Toolbar
                sx={{
                  display: 'flex',
                  position: 'sticky',
                  zIndex: 1,
                  top: 'var(--header-height)',
                  px: 3,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  bgcolor: 'var(--color-background-lightcolor)',
                  borderBottom: '1px solid var(--color-border-light)',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '14px' }}>
                  {matches &&
                    <Link href={{ pathname: AppRoutes.safeList }}>
                      <IconButton aria-label="back">
                        <ArrowBackIos />
                      </IconButton>
                    </Link>
                  }
                  {safeAddress && <>
                      <Identicon address={safeAddress} radius={6} size={32} />
                      <FormattedName address={safeAddress} weight={600} />
                    </>
                  }
                </Box>
                <Box>
                  <IconButton aria-label="settings" onClick={() => toggleSettings(!settings)}>
                    <SettingsIcon />
                  </IconButton>
                  <Hidden mdDown>
                    <IconButton onClick={toggleDrawer(!open)}>
                      {open ? <ViewSidebarIcon sx={{ background: 'var(--color-background-mediumcolor)', borderRadius: '6px', width: '32px', height: '32px', px: '6px' }} aria-label="close sidebar" /> : <ViewSidebarIcon aria-label="show sidebar" />}
                    </IconButton>
                  </Hidden>
                </Box>
              </Toolbar>
              {
                (ownerArray?.length && !ownerArray.includes(wallet?.address!)) ?
                  <Container fixed sx={{ height: '100vh', width: '100vw' }}>
                    <Box
                      sx={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 3,
                      }}
                    >
                      <Typography variant="h4">
                        You are not a signer on this safe.
                      </Typography>
                    </Box>
                  </Container>
                  :
                  <>
                    {!wallet?.address && <Typography variant='h5' p={3}>Connect Wallet to continue</Typography>}
                    {wallet?.address && !session?.user && <Button onClick={() => setAuth(true)}>Authenticate</Button>}
                    {wallet?.address && session?.user && <ChatWrapper />}
                  </>
              }
            </Box>
          </Box>
        </Main>
        <Hidden mdDown>
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                bgcolor: 'var(--color-background-papercolor)',
                boxSizing: 'border-box',
                height: 'calc(100vh - var(--header-height) - 24px)',
                top: 'var(--header-height)',
                margin: '12px 0',
                boxShadow: 'var(--color-shadow-paper)',
                borderRadius: '10px 0 0 10px',
                border: '0px',
              },
            }}
            variant="persistent"
            anchor="right"
            open={open}
          >
            <ChatOverview owners={owners} />
          </Drawer>
        </Hidden>
      </Box>
    </>
  )
}

export default Chat
