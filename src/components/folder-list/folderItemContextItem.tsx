import { useAppSelector } from '@/store'
import { selectAllAddressBooks } from '@/store/addressBookSlice'
import { getSafeData } from '@/utils/networkRegistry'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import type { MouseEvent } from 'react'
import { useEffect, useState, type ReactElement } from 'react'
//import EntryDialog from '@/components/address-book/EntryDialog'
import SafeListRemoveDialog from '@/components/sidebar/SafeListRemoveDialog'
//import EditIcon from '@/public/images/common/edit.svg'
import ContextMenu from '@/components/common/ContextMenu'
import AddIcon from '@/public/images/common/add.svg'
import CheckIcon from '@/public/images/common/circle-check.svg'
//import { trackEvent, OVERVIEW_EVENTS } from '@/services/analytics'
import { SvgIcon } from '@mui/material'

enum ModalType {
  RENAME = 'rename',
  REMOVE = 'remove',
}

const defaultOpen = { [ModalType.RENAME]: false, [ModalType.REMOVE]: false }

const FolderListContextMenu = ({
  address,
}: {
  address: string
}): ReactElement => {
  const [folderMenu, setDisplayFolderMenu] = useState<boolean>(false)
  const allAddressBooks = useAppSelector(selectAllAddressBooks)
  const safeData = getSafeData(address)
  /* const name = safeData?.chainId && allAddressBooks[safeData.chainId][safeData.address] || '' */
  const [folders, setFolders] = useState([])
  const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>()
  const [open, setOpen] = useState<typeof defaultOpen>(defaultOpen)
  const [folder, setFolder] = useState<any>()
  const [safes, setSafes] = useState<any>()

  const handleMoveFolder = async (folderName: string) => {
    if (!safes) return
    if (safes && safes[folderName] && safes[folderName].includes(address)) {
      await deleteSafeFromFolder()
    } else {
      await addSafeToFolder(folderName)
    }
  }

  useEffect(() => {
    const getFolders = async () => {
      let items
      const folders = localStorage.getItem('folders')
      if (folders) items = await JSON.parse(folders)
      if (items) setFolders(items)
    }
    getFolders()
    window.addEventListener('storage', getFolders)
    return () => {
      window.removeEventListener('storage', getFolders)
    }
  }, [])

  useEffect(() => {
    const folderMap: any = {}
    if (!folders) return
    const getSafesFromStorage = () => {
      folders.forEach(async (folderName) => {
        const items = JSON.parse(localStorage.getItem(folderName)!)
        if (items) folderMap[folderName] = items
      })
    }
    getSafesFromStorage()
    setSafes(folderMap)
    window.addEventListener('storage', getSafesFromStorage)
    return () => {
      window.removeEventListener('storage', getSafesFromStorage)
    }
  }, [folders])

  const addSafeToFolder = async (folderName: string) => {
    if (!address) return
    const safes = JSON.parse(localStorage.getItem(folderName)!)
    if (safes) {
      localStorage.setItem(folderName, JSON.stringify([...safes, address]))
    } else {
      localStorage.setItem(folderName, JSON.stringify([address]))
    }
    window.dispatchEvent(new Event('storage'))
  }

  const deleteSafeFromFolder = async () => {
    const safes = JSON.parse(localStorage.getItem(folder)!)
    const updated = safes.filter((safe: string) => safe !== address)
    if (updated) localStorage.setItem(folder, JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
  }

  const handleOpenContextMenu = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    setAnchorEl(e.currentTarget)
  }

  const handleCloseContextMenu = () => {
    setAnchorEl(undefined)
  }

  /* const handleOpenModal =
    (type: keyof typeof open, event: typeof OVERVIEW_EVENTS.SIDEBAR_RENAME | typeof OVERVIEW_EVENTS.SIDEBAR_RENAME) =>
    () => {
      handleCloseContextMenu()
      setOpen((prev) => ({ ...prev, [type]: true }))

      trackEvent(event)
    }
 */
  const handleCloseModal = () => {
    setOpen(defaultOpen)
  }

  const isInFolder = (folderName: 'string') => {
    return safes && safes[folderName] && safes[folderName].includes(address)
  }

  return (
    <>
      <IconButton edge="end" size="small" onClick={handleOpenContextMenu}>
        <MoreVertIcon sx={({ palette }) => ({ color: palette.border.main })} />
      </IconButton>
      <ContextMenu anchorEl={anchorEl} open={!!anchorEl} onClose={handleCloseContextMenu}>
        {/* <MenuItem onClick={handleOpenModal(ModalType.RENAME, OVERVIEW_EVENTS.SIDEBAR_RENAME)}>
          <ListItemIcon>
            <SvgIcon component={EditIcon} inheritViewBox fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem> */}
        <MenuItem
          onClick={() => setDisplayFolderMenu(true)}
        >
          <ListItemIcon>
            <SvgIcon component={AddIcon} inheritViewBox fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText>Add to folder</ListItemText>
        </MenuItem>
      </ContextMenu>
      <ContextMenu
        sx={{
          marginLeft: { base: '0px', lg: '160px' },
          marginTop: '36px',
        }}
        anchorEl={anchorEl}
        open={!!folderMenu}
        onClose={() => setDisplayFolderMenu(false)}
      >
        {folders.map((folder) =>
          <MenuItem
            onMouseEnter={() => setFolder(folder)}
            onClick={() => handleMoveFolder(folder)}
            key={`{${folder}}-i`}
          >
            <ListItemIcon>
              {isInFolder(folder) && <SvgIcon component={CheckIcon} inheritViewBox fontSize="small" color="success" />}
            </ListItemIcon>
            <ListItemText>{folder}</ListItemText>
          </MenuItem>
        )}
      </ContextMenu>
      {/*    
      {open[ModalType.RENAME] && (
        <EntryDialog
          handleClose={handleCloseModal}
          defaultValues={{ name, address }}
          chainId={`${safeData.chainId}`}
          disableAddressInput
        />
      )} */}

      {open[ModalType.REMOVE] && (
        <SafeListRemoveDialog handleClose={handleCloseModal} address={address} chainId={`${safeData.chainId}`} />
      )}
    </>
  )
}

export default FolderListContextMenu
