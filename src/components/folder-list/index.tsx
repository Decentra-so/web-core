import useAddressBook from '@/hooks/useAddressBook';
import { useAllOwnedSafes } from '@/hooks/useAllOwnedSafes';
import List from '@mui/material/List';
import { memo, useEffect, useState } from 'react';
import SafeDisplay from './safe-display';

const FolderList: React.FC = () => {
  const addressBook = useAddressBook()
  const allOwnedSafes = useAllOwnedSafes()
  const [safeFolder, setSafeFolder] = useState<string[]>([])
  const [sortedFolders, setSortedFolders] = useState<string[]>([])

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

  useEffect(() => {
    const sorted = safeFolder.sort((a, b) => {
      const havename = addressBook[b.slice(b.lastIndexOf(':') + 1)] ? true : false
      if (havename) {
        return 1
      } else {
        return -1
      }
    })
    setSortedFolders(sorted)
  }, [safeFolder])

  return (
    <List sx={{ padding: '0px' }}>
      {sortedFolders?.map((folder, index) => (
        <SafeDisplay key={`${folder}-${index}`} safe={folder} index={index} />
      ))
      }
    </List >
  )
}

export default memo(FolderList)
