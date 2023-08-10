import useAddressBook from '@/hooks/useAddressBook';
import { useAllOwnedSafes } from '@/hooks/useAllOwnedSafes';
import type { Folder } from '@/types/folder';
import List from '@mui/material/List';
import { memo, useEffect, useState } from 'react';
import SafeDisplay from './safe-display';
import css from './styles.module.css';

const FolderList: React.FC = () => {
  const addressBook = useAddressBook()
  const allOwnedSafes = useAllOwnedSafes()
  const [safeFolder, setSafeFolder] = useState<Folder[]>([])
  const [sortedFolders, setSortedFolders] = useState<Folder[]>([])

  //TODO: can be signficantly refactored
  useEffect(() => {
    if (allOwnedSafes?.size) {
      let folderList: Folder[] = []
      //getting pre-fix for all networks and creating links
      allOwnedSafes.get(42161)?.forEach((safe: string) => folderList.push({ chainId: 42161, address: `arb1:${safe}` }))
      allOwnedSafes.get(56)?.forEach((safe: string) => folderList.push({ chainId: 56, address: `bnb:${safe}` }))
      allOwnedSafes.get(100)?.forEach((safe: string) => folderList.push({ chainId: 100, address: `gno:${safe}` }))
      allOwnedSafes.get(137)?.forEach((safe: string) => folderList.push({ chainId: 137, address: `matic:${safe}` }))
      allOwnedSafes.get(10)?.forEach((safe: string) => folderList.push({ chainId: 10, address: `oeth:${safe}` }))
      allOwnedSafes.get(1)?.forEach((safe: string) => folderList.push({ chainId: 1, address: `eth:${safe}` }))
      allOwnedSafes.get(5)?.forEach((safe: string) => folderList.push({ chainId: 5, address: `gor:${safe}` }))
      if (!folderList) {
        return
      }
      setSafeFolder(folderList)
    }
  }, [allOwnedSafes])

  useEffect(() => {
    const sorted = safeFolder.sort((a, b) => {
      const havename = addressBook[b.address.slice(b.address.lastIndexOf(':') + 1)] ? true : false
      if (havename) {
        return 1
      } else {
        return -1
      }
    })
    setSortedFolders(sorted)
  }, [safeFolder])

  return (
    <List sx={{ padding: '0px' }} className={css.marginbottomlistmobile}>
      {sortedFolders?.map((folder, index) => (
        <SafeDisplay key={`${folder.address}-${index}`} safe={folder} index={index} />
      ))
      }
    </List >
  )
}

export default memo(FolderList)
