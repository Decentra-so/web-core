import AddNewTxIconButton from '@/components/chat/AddNewTxIconButton'
import NewTxButton from '@/components/chat/NewTxButton'
import useTxQueue from '@/hooks/useTxQueue'
import { Box, List, Typography, SvgIcon } from '@mui/material'
import { useEffect, useState } from 'react'
import css from './styles.module.css'
import classNames from 'classnames'
import TxType from '@/components/transactions/TxType'
import OwnersIcon from '@/public/images/common/owners.svg'
import ChevronRight from '@mui/icons-material/ChevronRight'
import { isMultisigExecutionInfo } from '@/utils/transaction-guards'
import ViewTransactionsModal from '@/components/chat/modals/ViewTransactionsModal'

const TransactionQueue = () => {
  const txQueue = useTxQueue()
  const [queue, setQueue] = useState<any>()
  const [transactionsOpen, toggleTransactionsOpen] = useState<boolean>(false)

  useEffect(() => {
    if (txQueue?.page?.results && txQueue?.page?.results?.length > 0) {
      setQueue(txQueue?.page?.results.filter((tx) => tx.type !== 'LABEL'))
    }
  }, [txQueue?.page?.results])

  return (
    <>
      {transactionsOpen && (
        <ViewTransactionsModal open={transactionsOpen} onClose={() => toggleTransactionsOpen(!transactionsOpen)} />
      )}
      <Box sx={{ pt: 2, pl: 3, pr: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontWeight: 600 }}>Transaction queue</Typography>
        <AddNewTxIconButton />
      </Box>
      <List sx={{ p: 3, pt: 2, gap: '16px', display: 'flex', flexFlow: 'column' }}>
        {queue ? (
          queue.map((transaction: any, i: number) => {
            if (!transaction.transaction) return
            return <Box className={classNames(css.gridContainer, css.columnTemplate)} key={`queue-${i}`} onClick={() => toggleTransactionsOpen(true)}>
                    <Box gridArea="nonce">
                      {isMultisigExecutionInfo(transaction.transaction.executionInfo) && transaction.transaction.executionInfo.nonce}
                    </Box>
          
                    <Box gridArea="type" className={css.columnWrap}>
                      <TxType tx={transaction.transaction} />
                    </Box>
          
                    <Box gridArea="confirmations">
                      {isMultisigExecutionInfo(transaction.transaction.executionInfo) ? (
                        <Box className={css.confirmationsCount}>
                          <SvgIcon component={OwnersIcon} inheritViewBox fontSize="small" />
                          <Typography variant="caption" fontWeight="bold">
                            {`${transaction.transaction.executionInfo.confirmationsSubmitted}/${transaction.transaction.executionInfo.confirmationsRequired}`}
                          </Typography>
                        </Box>
                      ) : (
                        <Box flexGrow={1} />
                      )}
                    </Box>
          
                    <Box gridArea="icon" marginLeft="12px">
                      <ChevronRight color="border" />
                    </Box>
                  </Box>
          })
        ) : (
          <Box sx={{ border: '1px solid var(--color-border-light)', borderRadius: '6px', pt: 2, pb: 2, pl: 2 }}>
            <Typography pb={1} fontSize="sm" fontWeight={600}>
              No queued up transaction
            </Typography>
            <Typography paragraph fontSize="xs">
              Queue up a transaction by clicking the button below
            </Typography>
            <NewTxButton />
          </Box>
        )}
      </List>
    </>
  )
}

export default TransactionQueue
