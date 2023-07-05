import { ListItemButton, Typography } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import List from '@mui/material/List'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Link from 'next/link'
import ListItemText from '@mui/material/ListItemText'
import { AppRoutes } from '@/config/routes'
import { useEffect, useState } from 'react'
import ellipsisAddress from '../../utils/ellipsisAddress'

const FolderGroup: React.FC<{
  group: any,
  currentSafe: string
}> = ({ group, currentSafe }) => {
  const [safes, setSafes] = useState<string[]>([''])

  window?.addEventListener('storage', () => {
    const items = JSON.parse(localStorage.getItem(group)!)
    if (items) {
      setSafes(items)
    }
  })

  useEffect(() => {
    const activeFolders = async () => {
      const items = JSON.parse(localStorage.getItem(group)!)
      // const myArray = items.split(",");
      if (items) {
        setSafes(items)
      }
    }
    activeFolders()
    window.addEventListener('storage', activeFolders)
    return () => {
      window.removeEventListener('storage', activeFolders)
    }
  }, [localStorage.getItem(group)])

  //TODO
  return (
    <>
      <List>
        {safes.map((folder, index) => (
          <Link href={{ pathname: AppRoutes.chat, query: { safe: `${folder}` } }} key={`${folder}-${index}`} passHref>
            <ListItemButton
              sx={{ borderRadius: '6px' }}
              //key={folder.name}
              key={folder}
              selected={currentSafe === folder.split(':')[1]}
            >
              <ListItemAvatar>
                <Avatar alt={folder} />
              </ListItemAvatar>
              <ListItemText primary={<Typography sx={{ fontWeight: 500 }}>{ellipsisAddress(folder)}</Typography>} />
            </ListItemButton>
          </Link>
        ))}
      </List>
    </>
  )
}

export default FolderGroup
