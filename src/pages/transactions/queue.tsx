import PaginatedTxns from '@/components/common/PaginatedTxns'
import BatchExecuteButton from '@/components/transactions/BatchExecuteButton'
import { BatchExecuteHoverProvider } from '@/components/transactions/BatchExecuteButton/BatchExecuteHoverProvider'
import TxHeader from '@/components/transactions/TxHeader'
import { useHasPendingTxs, usePendingTxsQueue } from '@/hooks/usePendingTxs'
import useTxQueue from '@/hooks/useTxQueue'
import { Box } from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'

const Queue: NextPage<{ showTabs: boolean }> = ({ showTabs = true }) => {
  const hasPending = useHasPendingTxs()

  return (
    <>
      <Head>
        <title>{'Safe{Wallet} – Transaction queue'}</title>
      </Head>

      <BatchExecuteHoverProvider>
        {
          showTabs &&
          <TxHeader>
            <BatchExecuteButton />
          </TxHeader>
        }

        <main>
          <Box mb={4}>
            {/* Pending unsigned transactions */}
            {hasPending && <PaginatedTxns useTxns={usePendingTxsQueue} />}

            {/* The main queue of signed transactions */}
            <PaginatedTxns useTxns={useTxQueue} />

            <PaginatedTxns useTxns={useTxHistory} />
          </Box>
        </main>
      </BatchExecuteHoverProvider>
    </>
  )
}

export default Queue
