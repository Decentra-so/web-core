import List from '@mui/material/List'
import { useEffect, useState } from 'react'
import SafeDisplay from './safe-display'
import { type Folder } from '@/types/folder'

const FolderGroup: React.FC<{
  group: any,
}> = ({ group }) => {
  const [safes, setSafes] = useState<Folder[]>([])

  window?.addEventListener('storage', () => {
    const items = JSON.parse(localStorage.getItem(group)!)
    if (items) {
      setSafes(items)
    }
  })

  useEffect(() => {
    const activeFolders = async () => {
      const items = JSON.parse(localStorage.getItem(group)!)
      if (items) {
        let foldersWithChain: Folder[] = []
        items.forEach((item: any) => {
          let folder = item.address.split(':')
          foldersWithChain.push({address: item.address, chainId: item.chainId})
        })
        setSafes(foldersWithChain)
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
      <List sx={{ padding: '0px' }}>
        {safes.map((folder, index) => (
          <SafeDisplay key={`${folder}-${index}`} safe={folder} index={index} />
        ))}
      </List>
    </>
  )
}

export default FolderGroup