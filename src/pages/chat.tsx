import { AddFolder } from '@/components/chat/addFolder'
import ChatNotifications from '@/components/chat/chatNotifications'
import { ChatOverview } from '@/components/chat/chatOverview'
import { DesktopChat } from '@/components/chat/desktopChat'
import { MobileChat } from '@/components/chat/mobileChat'
import ConnectionCenter from '@/components/common/ConnectWallet/ConnectionCenter'
import useConnectWallet from '@/components/common/ConnectWallet/useConnectWallet'
import { FolderList } from '@/components/folder-list'
import FolderGroup from '@/components/folder-list/folderGroups'
import { AppRoutes } from '@/config/routes'
import useSafeInfo from '@/hooks/useSafeInfo'
import useTxHistory from '@/hooks/useTxHistory'
import useTxQueue from '@/hooks/useTxQueue'
import useWallet from '@/hooks/wallets/useWallet'
import ellipsisAddress from '@/utils/ellipsisAddress'
import { ArrowBackIos } from '@mui/icons-material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar'
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  Tab,
  Tabs,
  Toolbar,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import css from './styles.module.css'

const JoinNoSSR = dynamic(() => import('@/components/chat/join'), { ssr: false })

const CometChatLoginNoSSR = dynamic(() => import('@/components/chat/login'), { ssr: false })

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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
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

const Chat = () => {
  const [folders, setFolders] = useState([])
  const [popup, togglePopup] = useState<boolean>(false)
  const [open, setOpen] = useState(true)
  const [value, setValue] = React.useState(0)
  const wallet = useWallet()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([''])
  const connectWallet = useConnectWallet()
  const [chatData, setChatData] = useState<any[]>([''])
  const txHistory = useTxHistory()
  const txQueue = useTxQueue()
  const [group, setGroup] = useState<any>()
  const [currentUser, setCurrentUser] = useState<any>()
  const { safe, safeAddress } = useSafeInfo()
  const [ownerStatus, setOwnerStatus] = useState<boolean>()
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
    const activeFolders = async () => {
      const items = JSON.parse(localStorage.getItem('folders')!)
      // const myArray = items.split(",");
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

  useEffect(() => {
    let isOwnerArr: any[] = []
    if (owners && wallet?.address) {
      owners.map((owner) => {
        if (owner.value == wallet.address) {
          isOwnerArr.push(wallet.address)
        }
      })
      isOwnerArr.length > 0 ? setOwnerStatus(true) : setOwnerStatus(false)
    }
  }, [owners, wallet])

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
      if (tx.type === 'LABEL') {
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
  }, [chatData])

  if (!wallet?.address)
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

  if (!ownerArray.includes(wallet?.address!))
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
          <Typography variant="h4">You are not a signer on this safe.</Typography>
          <Link href={{ pathname: AppRoutes.home, query: { safe: `${safeAddress}` } }}>
            <Button variant="contained">Go Back</Button>
          </Link>
        </Box>
      </Container>
    )

  if (!currentUser) {
    return <CometChatLoginNoSSR setCurrentUser={setCurrentUser} />
  }

  //WHY TF is he not re-rendering?
  if (!group) {
    return <JoinNoSSR user={currentUser} setGroup={setGroup} setMessages={setMessages} />
  }

  return (
    <>
      {popup ? <AddFolder open={popup} onClose={() => togglePopup(!popup)} /> : ''}
      <Head>
        <title>Safe &mdash; Chat</title>
      </Head>
      <Box sx={{ display: 'flex' }}>
        <Hidden mdDown>
          <Drawer
            sx={{
              width: 287,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: 287,
                bgcolor: 'background.default',
                boxSizing: 'border-box',
                height: 'calc(100vh - var(--header-height))',
                top: 'var(--header-height)',
              },
            }}
            variant="permanent"
            anchor="left"
          >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
              <Typography sx={{ color: '#757575', fontSize: 12, fontWeight: 600 }}>VIEW AS:</Typography>
              <Typography sx={{ fontWeight: 600, fontSize: 15 }}>{ellipsisAddress(`${wallet.address}`)}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap="10px">
                <IconButton sx={{ border: '1px solid #e7e7e7', borderRadius: '6px', width: '32px', height: '32px' }} aria-label="add folder" onClick={() => togglePopup(!popup)}>
                  <AddIcon />
                </IconButton>
              </Box>
            </Toolbar>
            <ChatNotifications />
            <Box sx={{ width: '100%', height: '100%' }}>
              {/*@ts-ignore*/}
              <Tabs sx={{ padding: '0 16px', borderBottom: '1px solid var(--color-border-light)' }} value={value} onChange={handleChange} aria-label="folder tabs">
                <Tab className={css.tab} label="All" {...a11yProps(0)} />
                {folders.map((folder, i) => {
                  return <Tab label={folder} key={`${folder}-${i}`} />
                })}
                {/* <Tab label="Ricochet-related" {...a11yProps(1)} />
                <Tab label="Company multisigs" {...a11yProps(2)} /> */}
              </Tabs>
              <TabPanel value={value} index={0}>
                <FolderList resetGroup={resetGroup} />
              </TabPanel>
              {folders.map((folder, i) => {
                return (
                  <TabPanel value={value} index={i + 1} key={`${folder}-${i}`}>
                    <FolderGroup group={folder} />
                  </TabPanel>
                )
              })}
            </Box>
          </Drawer>
        </Hidden>
        <Main open={open} sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
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
                  bgcolor: 'background.default',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '14px' }}>
                  <Link href={{ pathname: AppRoutes.home, query: { safe: `${safeAddress}` } }}>
                    <IconButton aria-label="back">
                      <ArrowBackIos />
                    </IconButton>
                  </Link>
                  <Avatar sx={{ height: 32, width: 32, borderRadius: '6px' }} alt="Decentra" />
                  <Typography sx={{ fontWeight: 600 }}>{ellipsisAddress(`${safeAddress}`)}</Typography>
                </Box>
                <Hidden mdDown>
                  <IconButton onClick={toggleDrawer(!open)}>
                    {open ? <CloseIcon aria-label="close sidebar" /> : <ViewSidebarIcon aria-label="show sidebar" />}
                  </IconButton>
                </Hidden>
              </Toolbar>
              <Divider />
              <MobileChat
                message={message}
                setMessage={setMessage}
                messages={messages}
                setMessages={setMessages}
                bottom={bottom}
                chatData={chatData}
                owners={owners}
              />
              <DesktopChat
                message={message}
                setMessage={setMessage}
                messages={messages}
                setMessages={setMessages}
                bottom={bottom}
                chatData={chatData}
              />
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
                bgcolor: 'background.paper',
                boxSizing: 'border-box',
                height: 'calc(100vh - var(--header-height) - 24px)',
                top: 'var(--header-height)',
                margin: '12px 0',
                boxShadow: '0 0.75rem 1.5rem rgba(0,0,0,0.08)',
                borderRadius: '8px 0 0 8px',
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
