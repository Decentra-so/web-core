import { ListItemButton, Typography } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import List from '@mui/material/List'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Link from 'next/link'
import ListItemText from '@mui/material/ListItemText'
import { AppRoutes } from '@/config/routes'
import { useEffect, useState } from 'react'
import ellipsisAddress from '../../utils/ellipsisAddress'
import useOwnedSafes from '@/hooks/useOwnedSafes'
import { useRouter } from 'next/router'
import useSafeInfo from '@/hooks/useSafeInfo'

export default function FolderList() {
  const ownedSafes = useOwnedSafes()
  const history = useRouter()
  const [safeFolder, setSafeFolder] = useState([''])
  const [selectedIndex, setSelectedIndex] = useState<any>()
  const { safe, safeAddress } = useSafeInfo()

  useEffect(() => {
    if (ownedSafes) {
      let folderList: any[] = []
      const polygonSafes = ownedSafes[137]
      const optimismSafes = ownedSafes[5]
      const ethSafes = ownedSafes[1]
      if (polygonSafes) {
        polygonSafes.forEach((safe) => folderList.push(`matic:${safe}`))
      }
      if (optimismSafes) {
        optimismSafes.forEach((safe) => folderList.push(`oeth:${safe}`))
      }
      if (ethSafes) {
        ethSafes.forEach((safe) => folderList.push(`eth:${safe}`))
      }
      if (!folderList) {
        return
      }
      setSafeFolder(folderList)
    }
  }, [ownedSafes])

  const handleListItemClick = (folder: string, index: number) => {
    setSelectedIndex(folder)
    history.push(`${folder}/new-chat`)
  }

  const matchSafe = (safe: string) => {
    return safe.slice(safe.lastIndexOf(':') + 1) === safeAddress
  }
  return (
    <List>
      {safeFolder.map((safe, index) => (
        <Link href={{ pathname: AppRoutes.chat, query: { safe: `${safe}` } }} key={`${safe}-${index}`} passHref>
          <ListItemButton
            sx={{ borderRadius: '6px' }}
            //key={folder.name}
            key={safe}
            selected={matchSafe(safe)}
            onClick={() => handleListItemClick(safe, index)}
          >
            {/* <ListItemAvatar>
              {folder.badge ? <BadgeAvatar name={folder.name} /> : <Avatar alt={folder.name} />}
            </ListItemAvatar> */}
            <ListItemAvatar>
              <Avatar alt={safe} />
            </ListItemAvatar>
            <ListItemText
              primary={<Typography sx={{ fontWeight: 500 }}>{ellipsisAddress(safe)}</Typography>}
              //secondary={<Typography sx={{ color: grey[600] }}>{ellipsisAddress(folder.address)}</Typography>}
            />
          </ListItemButton>
        </Link>
      ))}
    </List>
  )
}
