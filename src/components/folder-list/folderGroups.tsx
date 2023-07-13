import List from '@mui/material/List'
import { useEffect, useState } from 'react'
import SafeDisplay from './safe-display'
import { type Folder } from '@/types/folder'
import { getChainId } from '@/utils/networkRegistry'

const FolderGroup: React.FC<{
  group: any,
  currentSafe: string
}> = ({ group, currentSafe }) => {
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
      // const myArray = items.split(",");
      if (items) {
        let foldersWithChain: Folder[] = []
        items.forEach((item: any) => {
          let folder = item.split(':')
          console.log(folder, 'folder')
          foldersWithChain.push({address: item, chainId: getChainId(folder[0]) || 0})
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