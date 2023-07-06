import NetworkSelector from '@/components/common/NetworkSelector'
import AddressBookTable from '@/components/address-book/AddressBookTable'
import MobileChatFooter from '@/components/chat/mobileChatFooter'
import type { NextPage } from 'next'
import Head from 'next/head'

const AddressBook: NextPage = () => {
  return (
    <>
      <Head>
        <title>{'Decentra{Pro} – Address book'}</title>
      </Head>
      
      <div>
        <NetworkSelector />
      </div>
      
      <AddressBookTable />
      <MobileChatFooter />
    </>
  )
}

export default AddressBook
