import { useAppSelector } from '@/store'
import { selectAllAddressBooksOwned } from '@/store/addressBookSlice'
import { flattenObject } from '@/utils/flattenObject'

const useAddressBook = () => {
  const allAddresses = useAppSelector((state) => selectAllAddressBooksOwned(state))
  return flattenObject(allAddresses)
}

export default useAddressBook
