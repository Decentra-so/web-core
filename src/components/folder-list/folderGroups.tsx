import useSafeInfo from '@/hooks/useSafeInfo'
import type { Folder } from '@/types/folder'
import List from '@mui/material/List'
import { useEffect, useState } from 'react'
import SafeDisplay from './safe-display'
import css from './styles.module.css'

const FolderGroup: React.FC<{
  group: any,
  currentSafe: string
}> = ({ group, currentSafe }) => {
  const [safes, setSafes] = useState<Folder[]>([])
  const { safeAddress, safe } = useSafeInfo()

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
      <List sx={{ padding: '0px' }} className={css.marginbottomlistmobile}>
        {safes.map((folder, index) => (
          <SafeDisplay key={`${folder}-${index}`} safe={folder} index={index} />
        ))}
      </List>
    </>
  )
}

export default FolderGroup
