import { ListItemButton, Typography } from '@mui/material'
import ListItem from '@mui/material/ListItem'
import Avatar from '@mui/material/Avatar'
import List from '@mui/material/List'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Link from 'next/link'
import ListItemText from '@mui/material/ListItemText'
import { AppRoutes } from '@/config/routes'
import { useEffect, useState, memo } from 'react'
import ellipsisAddress from '../../utils/ellipsisAddress'
import useSafeInfo from '@/hooks/useSafeInfo'
import FolderListContextMenu from './folderItemContextItem'
import { useAllOwnedSafes } from '@/hooks/useAllOwnedSafes'

const FolderList: React.FC<{
  resetGroup: () => void
}> = ({ resetGroup }) => {
  const allOwnedSafes = useAllOwnedSafes()
  const [safeFolder, setSafeFolder] = useState<string[]>([])
  const { safeAddress } = useSafeInfo()
  //TODO: can be signficantly refactored
  useEffect(() => {
    if (allOwnedSafes?.size) {
      let folderList: string[] = []
      //getting pre-fix for all networks and creating links
      allOwnedSafes.get(42161)?.forEach((safe: string) => folderList.push(`arb1:${safe}`))
      allOwnedSafes.get(56)?.forEach((safe: string) => folderList.push(`bnb:${safe}`))
      allOwnedSafes.get(100)?.forEach((safe: string) => folderList.push(`gno:${safe}`))
      allOwnedSafes.get(137)?.forEach((safe: string) => folderList.push(`matic:${safe}`))
      allOwnedSafes.get(10)?.forEach((safe: string) => folderList.push(`oeth:${safe}`))
      allOwnedSafes.get(1)?.forEach((safe: string) => folderList.push(`eth:${safe}`))
      if (!folderList) {
        return
      }
      setSafeFolder(folderList)
    }
  }, [allOwnedSafes])

  const handleListItemClick = (folder: string, index: number) => {
    resetGroup()
  }

  const matchSafe = (safe: string) => {
    return safe.slice(safe.lastIndexOf(':') + 1) === safeAddress
  }
  return (
    <List sx={{ padding: '0px' }}>
      {safeFolder?.map((safe, index) => (
        <ListItem
          key={`safe-${index}`}
          disablePadding
          selected={matchSafe(safe)}
          sx={{ padding: '2px 6px', minHeight: '69px', borderBottom: '1px solid var(--color-border-light)' }}
        >
          <Link href={{ pathname: AppRoutes.chat, query: { safe: `${safe}` } }} key={`${safe}-${index}`} passHref>
            <ListItemButton
              key={safe}
              onClick={() => handleListItemClick(safe, index)}
            >
              {/* <ListItemAvatar>
                {folder.badge ? <BadgeAvatar name={folder.name} /> : <Avatar alt={folder.name} />}
              </ListItemAvatar> */}
              <ListItemAvatar>
                <Avatar sx={{ height: 32, width: 32, borderRadius: '6px' }} alt={safe} />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ fontWeight: 500 }}>{ellipsisAddress(safe)}</Typography>}
                //secondary={<Typography sx={{ color: grey[600] }}>{ellipsisAddress(folder.address)}</Typography>}
              />
              
            </ListItemButton>
          </Link>
          
          <FolderListContextMenu address={safe} />
        </ListItem>
      ))}
    </List>
  )
}

export default memo(FolderList)