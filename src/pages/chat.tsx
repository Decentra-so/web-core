import { ChatOverview } from '@/components/chat/chatOverview'
import { DesktopChat } from '@/components/chat/desktopChat'
import { MobileChat } from '@/components/chat/mobileChat'
import { AddFolderModal } from '@/components/chat/modals/AddFolderModal'
import ViewSettingsModal from '@/components/chat/modals/ViewSettingsModal'
import ViewCreateSafe from '@/components/chat/modals/CreateSafe'
import ConnectionCenter from '@/components/common/ConnectWallet/ConnectionCenter'
import { FolderList } from '@/components/folder-list'
import { AppRoutes } from '@/config/routes'
import useSafeInfo from '@/hooks/useSafeInfo'
import useTxQueue from '@/hooks/useTxQueue'
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
import Head from 'next/head'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import useTxHistory from '@/hooks/useTxHistory'
import FolderGroup from '@/components/folder-list/folderGroups'
import { getSession, signOut } from 'next-auth/react'
import Link from 'next/link'

import css from './styles.module.css'
import { useRouter } from 'next/router'

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

const Chat: React.FC<{
  user: any
}> = ({ user }) => {
  const router = useRouter()
  //folders and folder control
  const [group, setGroup] = useState<any>()
  const [folders, setFolders] = useState([])
  const [popup, togglePopup] = useState<boolean>(false)
  //modals and modal control
  const [createSafe, setCreateSafe] = useState<boolean>(false)
  const [settings, toggleSettings] = useState<boolean>(false)
  const [open, setOpen] = useState(true)
  const [value, setValue] = React.useState(0)
  //Chat
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([''])
  const [chatData, setChatData] = useState<any[]>([''])
  //transactions
  const txHistory = useTxHistory()
  const txQueue = useTxQueue()
  //user and safe
  const wallet = useWallet()
  const [currentUser, setCurrentUser] = useState<any>()
  const { safe, safeAddress } = useSafeInfo()
  const bottom = useRef<HTMLDivElement>(null)
  const owners = safe?.owners || ['']
  const ownerArray = owners.map((owner) => owner.value)
  const resetGroup = () => {
    setGroup('')
  }

  const scrollToBottom = useCallback(() => {
    if (!bottom.current) return
    const { current: bottomOfChat } = bottom
    const rect = bottomOfChat.getBoundingClientRect()
    if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
      return
    }
    bottomOfChat.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (user.address !== wallet?.address) {
      //@ts-ignore
      signOut({ redirect: '/auth' })
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

  const getLast5Items = (arr: any) => {
    if (arr) {
      return arr.length > 5 ? arr.slice(Math.max(arr.length - 5, 0)) : arr
    }
    return arr
  }

  const getChat = useCallback(() => {
    let allData: any[] = []
    const historyItems = getLast5Items(txHistory.page?.results)
    const queueItems = getLast5Items(txQueue?.page?.results)
    historyItems?.forEach((tx: any) => {
      if (tx.type === 'DATE_LABEL') {
        return
      }
      allData.push({
        data: tx,
        timestamp: tx.transaction.timestamp,
        type: 'tx',
      })
    })
    queueItems?.forEach((tx: any) => {
      if (tx.type === 'LABEL' || tx.type === 'CONFLICT_HEADER') {
        return
      }
      allData.push({
        data: tx,
        timestamp: tx.transaction.timestamp,
        type: 'tx',
      })
    })
    if (!messages.length) {
      setChatData(allData)
      return
    }
    messages?.forEach((message: any) => {
      allData.push({
        data: message,
        timestamp: +message.sentAt * 1000,
        type: 'message',
      })
    })
    allData.sort(function (a, b) {
      if (a['timestamp'] > b['timestamp']) {
        return 1
      } else if (a['timestamp'] < b['timestamp']) {
        return -1
      } else {
        return 0
      }
    })
    setChatData(allData)
  }, [messages, txHistory?.page?.results, txQueue?.page?.results])

  useEffect(() => {
    if (safeAddress) {
      getChat()
    }
  }, [safeAddress, messages, txHistory?.page?.results, txQueue?.page?.results])

  useEffect(() => {
    scrollToBottom()
  }, [chatData, messages])

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
              <FolderList resetGroup={resetGroup} key={wallet?.chainId} />
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
                  <MobileChat
                    message={message}
                    setMessage={setMessage}
                    messages={messages}
                    setMessages={setMessages}
                    bottom={bottom}
                    chatData={chatData}
                    group={group}
                    owners={owners}
                    currentUser={currentUser}
                    setCurrentUser={setCurrentUser}
                    setGroup={setGroup}
                  />
                  <DesktopChat
                    setGroup={setGroup}
                    currentUser={currentUser}
                    setCurrentUser={setCurrentUser}
                    message={message}
                    setMessage={setMessage}
                    messages={messages}
                    setMessages={setMessages}
                    group={group}
                    bottom={bottom}
                    chatData={chatData}
                    safe={safeAddress}
                  />
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

export default React.memo(Chat)
