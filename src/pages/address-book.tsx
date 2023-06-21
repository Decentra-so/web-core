import AddressBookTable from '@/components/address-book/AddressBookTable'
import MobileChatFooter from '@/components/chat/mobileChatFooter'
import type { NextPage } from 'next'
import Head from 'next/head'

const AddressBook: NextPage = () => {
  return (
    <>
      <Head>
        <title>{'Safe{Wallet} – Address book'}</title>
      </Head>

      <AddressBookTable />
      <MobileChatFooter />
    </>
  )
}

export default AddressBook
