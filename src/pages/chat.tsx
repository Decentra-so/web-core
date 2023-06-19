import { ChatOverview } from '@/components/chat/chatOverview'

import { AddFolderModal } from '@/components/chat/modals/AddFolderModal'
import ViewCreateSafe from '@/components/chat/modals/CreateSafe'
import ViewSettingsModal from '@/components/chat/modals/ViewSettingsModal'
import ConnectionCenter from '@/components/common/ConnectWallet/ConnectionCenter'
import FolderList from '@/components/folder-list'
import FolderGroup from '@/components/folder-list/folderGroups'
import { AppRoutes } from '@/config/routes'
import useSafeInfo from '@/hooks/useSafeInfo'
import useWallet from '@/hooks/wallets/useWallet'
import ellipsisAddress from '@/utils/ellipsisAddress'
import { ArrowBackIos } from '@mui/icons-material'
import AddIcon from '@mui/icons-material/Add'
import SettingsIcon from '@mui/icons-material/Settings'
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar'
import {
  Avatar,
  Box,
  Button,
  Container,
  Drawer,
  Hidden,
  IconButton,
  Tab,
  Tabs,
  Toolbar,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { getSession, signOut } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import css from './styles.module.css'
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

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

//wtf is this lol
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

//Get auth session, if not reroute
export async function getServerSideProps(context: any) {
  const session = await getSession(context)
  const path = context.req.url.split('?')
  // redirect if not authenticated
  if (!session) {
    return {
      redirect: {
        destination: path[1] ? `/welcome?${path[1]}` : '/welcome',
        permanent: false,
      },
    }
  }

  return {
    props: { user: session.user },
  }
}

//TO DO: move state out of this component and into the relevant components to avoid pointless re-renders and speed up app.
const Chat: React.FC<{
  user: any
}> = ({ user }) => {
  //routing
  const router = useRouter()
  //folders and folder control
  const [folders, setFolders] = useState([])
  const [popup, togglePopup] = useState<boolean>(false)
  //modals and modal control
  const [createSafe, setCreateSafe] = useState<boolean>(false)
  const [settings, toggleSettings] = useState<boolean>(false)
  const [open, setOpen] = useState(true)
  const [value, setValue] = React.useState(0)
  //user and safe
  const wallet = useWallet()
  const { safe, safeAddress } = useSafeInfo()
  const owners = safe?.owners || ['']
  const ownerArray = owners.map((owner) => owner.value)

  useEffect(() => {
    if (user.address !== wallet?.address) {
      signOut({ redirect: true })
    }
    if (router.asPath.includes('chain')) {
      setCreateSafe(true)
    }
  }, [])

  useEffect(() => {
    const activeFolders = async () => {
      const items = JSON.parse(localStorage.getItem('folders')!)
      if (items) {
        setFolders(items)
      }
    }
    activeFolders()
    window.addEventListener('storage', activeFolders)
    return () => {
      window.removeEventListener('storage', activeFolders)
    }
  }, [])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }

    setOpen(open)
  }

  if (!wallet?.address || !user)
    return (
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
          <Typography variant="h4">You are not connected.</Typography>
          <ConnectionCenter />
        </Box>
      </Container>
    )

  return (
    <>
      {popup && <AddFolderModal open={popup} onClose={() => togglePopup(!popup)} />}
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
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography sx={{ color: '#757575', fontSize: 12, fontWeight: 600 }}>VIEW AS:</Typography>
                <Typography sx={{ fontWeight: 600 }}>{ellipsisAddress(`${wallet.address}`)}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap="10px">
                <IconButton
                  sx={{ border: '1px solid var(--color-border-light)', borderRadius: '6px', width: '32px', height: '32px' }}
                  aria-label="add folder"
                  onClick={() => togglePopup(!popup)}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Toolbar>
            <Box sx={{ width: '100%', height: '100%' }}>
              <Tabs sx={{ padding: '0 16px', borderBottom: '1px solid var(--color-border-light)' }} value={value} onChange={handleChange} aria-label="folder tabs">
                <Tab className={css.tab} label="All" {...a11yProps(0)} />
                {folders.map((folder, i) => {
                  return <Tab className={css.tab} label={folder} key={`${folder}-${i}`} />
                })}
              </Tabs>
              <TabPanel value={value} index={0}>
                <FolderList />
              </TabPanel>
              {folders.map((folder, i) => {
                return (
                  <TabPanel value={value} index={i + 1} key={`${folder}-${i}`}>
                    <FolderGroup group={folder} currentSafe={safeAddress} />
                  </TabPanel>
                )
              })}
              <Button onClick={() => setCreateSafe(!createSafe)}>Add Safe</Button>
            </Box>
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
                  <Link href={{ pathname: AppRoutes.home, query: { safe: `${safeAddress}` } }}>
                    <IconButton aria-label="back">
                      <ArrowBackIos />
                    </IconButton>
                  </Link>
                  <Avatar sx={{ height: 32, width: 32, borderRadius: '6px' }} alt="Decentra" />
                  <Typography sx={{ fontWeight: 600 }}>{safeAddress ? ellipsisAddress(`${safeAddress}`) : ''}</Typography>
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
                (ownerArray.length && !ownerArray.includes(wallet?.address!)) ?
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
                    <ChatWrapper />
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
