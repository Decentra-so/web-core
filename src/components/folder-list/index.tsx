import { AppRoutes } from '@/config/routes'
import { useAllOwnedSafes } from '@/hooks/useAllOwnedSafes'
import useSafeInfo from '@/hooks/useSafeInfo'
import { ListItem, ListItemButton, Typography } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import List from '@mui/material/List'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Link from 'next/link'
import { memo, useEffect, useState } from 'react'
import ellipsisAddress from '../../utils/ellipsisAddress'
import FolderListContextMenu from './folderItemContextItem'

const FolderList: React.FC = () => {
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

  const matchSafe = (safe: string) => {
    return safe.slice(safe.lastIndexOf(':') + 1) === safeAddress
  }
  return (
    <List sx={{ padding: '0px' }}>
      {safeFolder?.map((safe, index) => (
        <ListItem key={`${safe}-${index}`} selected={matchSafe(safe)} sx={{ "&:hover": { backgroundColor: 'var(--color-border-light)' } }}>
          <Link href={{ pathname: AppRoutes.chat, query: { safe: `${safe}` } }} key={`${safe}-${index}`} passHref>
            <ListItemButton
              key={`safe-${index}`}
              sx={{
                padding: '2px 6px', minHeight: '69px',
                "&:hover": {
                  backgroundColor: "transparent"
                }
              }}
              disableRipple
            >
              <ListItemAvatar>
                <Avatar sx={{ height: 32, width: 32, borderRadius: '6px' }} alt={safe} />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography sx={{ fontWeight: 500 }}>{ellipsisAddress(safe)}</Typography>}
              />
            </ListItemButton>
          </Link>
          <FolderListContextMenu address={safe} />
        </ListItem>
      ))
      }
    </List >
  )
}

export default memo(FolderList)