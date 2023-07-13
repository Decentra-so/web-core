import ContextMenu from '@/components/common/ContextMenu'
import SafeListRemoveDialog from '@/components/sidebar/SafeListRemoveDialog'
import AddIcon from '@/public/images/common/add.svg'
import CheckIcon from '@/public/images/common/circle-check.svg'
import EditIcon from '@/public/images/common/edit.svg'
import { OVERVIEW_EVENTS, trackEvent } from '@/services/analytics'
import { useAppSelector } from '@/store'
import { selectAllAddressBooks } from '@/store/addressBookSlice'
import type { Folder } from '@/types/folder'
import { getSafeData } from '@/utils/networkRegistry'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { SvgIcon } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import { isArray } from 'lodash'
import type { MouseEvent } from 'react'
import { useEffect, useState, type ReactElement } from 'react'
import EntryDialog from '../address-book/EntryDialog'

enum ModalType {
  RENAME = 'rename',
  REMOVE = 'remove',
}

const defaultOpen = { [ModalType.RENAME]: false, [ModalType.REMOVE]: false }

const FolderListContextMenu = ({
  safeInfo,
}: {
  safeInfo: Folder
}): ReactElement => {
  const [folderMenu, setDisplayFolderMenu] = useState<boolean>(false)
  const safeData = getSafeData(safeInfo.address)
  const allAddressBooks = useAppSelector(selectAllAddressBooks)
  const name = allAddressBooks[safeData?.chainId!]?.[safeInfo.address]
  const [folders, setFolders] = useState([])
  const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>()
  const [open, setOpen] = useState<typeof defaultOpen>(defaultOpen)
  const [folder, setFolder] = useState<any>()
  const [safes, setSafes] = useState<any>()
  const includesAddress = safes && Object.values(safes).some((folders: unknown) =>
    isArray(folders) ? folders.some((safe: Folder) => safe.address === safeInfo.address) : false
  );

  const handleMoveFolder = async (folderName: string) => {
    if (!safes) return
    if (safes && safes[folderName] && includesAddress) {
      await deleteSafeFromFolder()
    } else {
      await addSafeToFolder(folderName)
    }
  }

  useEffect(() => {
    const getFolders = async () => {
      let items
      const folders = localStorage.getItem('folders')
      console.log({ folders })
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
    if (!safeInfo.address) return
    const safes = JSON.parse(localStorage.getItem(folderName)!)
    if (safes) {
      localStorage.setItem(folderName, JSON.stringify([...safes, safeInfo]))
    } else {
      localStorage.setItem(folderName, JSON.stringify([safeInfo]))
    }
    window.dispatchEvent(new Event('storage'))
  }

  const deleteSafeFromFolder = async () => {
    const safes = JSON.parse(localStorage.getItem(folder)!)
    const updated = safes.filter((safe: Folder) => safe.address !== safeInfo.address)
    if (updated) localStorage.setItem(folder, JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
  }

  const handleOpenContextMenu = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    setAnchorEl(e.currentTarget)
  }

  const handleCloseContextMenu = () => {
    setAnchorEl(undefined)
  }

  const handleOpenModal =
    (type: keyof typeof open, event: typeof OVERVIEW_EVENTS.SIDEBAR_RENAME | typeof OVERVIEW_EVENTS.SIDEBAR_RENAME) =>
      () => {
        handleCloseContextMenu()
        setOpen((prev) => ({ ...prev, [type]: true }))

        trackEvent(event)
      }
  const handleCloseModal = () => {
    setOpen(defaultOpen)
  }

  const isInFolder = (folderName: 'string') => {
    return safes && safes[folderName] && includesAddress
  }

  return (
    <>
      <IconButton edge="end" size="small" onClick={handleOpenContextMenu}>
        <MoreVertIcon sx={({ palette }) => ({ color: palette.border.main })} />
      </IconButton>
      <ContextMenu anchorEl={anchorEl} open={!!anchorEl} onClose={handleCloseContextMenu}>
        <MenuItem
          onClick={() => setDisplayFolderMenu(true)}
        >
          <ListItemIcon>
            <SvgIcon component={AddIcon} inheritViewBox fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText>Add to folder</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={handleOpenModal(ModalType.RENAME, OVERVIEW_EVENTS.SIDEBAR_RENAME)}
        >
          <ListItemIcon>
            <SvgIcon component={EditIcon} inheritViewBox fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
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
      {open[ModalType.RENAME] && (
        <EntryDialog
          handleClose={handleCloseModal}
          hideChainIndicator={true}
          defaultValues={{ name, address: safeInfo.address.slice(safeInfo.address.lastIndexOf(':') + 1) }}
          chainId={safeData?.chainId?.toString()}
          disableAddressInput
        />
      )}

      {open[ModalType.REMOVE] && (
        <SafeListRemoveDialog handleClose={handleCloseModal} address={safeInfo.address} chainId={`${safeData.chainId}`} />
      )}
    </>
  )
}

export default FolderListContextMenu
