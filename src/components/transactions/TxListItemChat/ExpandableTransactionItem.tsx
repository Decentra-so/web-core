import { type Transaction, type TransactionDetails } from '@safe-global/safe-gateway-typescript-sdk'
import { Box, Skeleton } from '@mui/material'
import TxSummary from '@/components/transactions/TxSummary'
import { useContext } from 'react'
import { BatchExecuteHoverContext } from '@/components/transactions/BatchExecuteButton/BatchExecuteHoverProvider'
import css from './styles.module.css'
import classNames from 'classnames'

type ExpandableTransactionItemProps = {
  isGrouped?: boolean
  item: Transaction
  txDetails?: TransactionDetails
}

export const ExpandableTransactionItem = ({
  isGrouped = false,
  item,
  testId,
}: ExpandableTransactionItemProps & { testId?: string }) => {
  const hoverContext = useContext(BatchExecuteHoverContext)

  const isBatched = hoverContext.activeHover.includes(item.transaction.id)

  return (
    <Box
      className={classNames(css.accordion, { [css.batched]: isBatched })}
      data-testid={testId}
    >
      <Box sx={{ justifyContent: 'flex-start', overflowX: 'auto', padding: '0' }}>
        <TxSummary item={item} isGrouped={isGrouped} />
      </Box>
    </Box>
  )
}

export const TransactionSkeleton = () => (
  <>
    <Box pt="20px" pb="4px">
      <Skeleton variant="text" width="35px" />
    </Box>

    <Box className={css.accordion}>
      <Box sx={{ justifyContent: 'flex-start', overflowX: 'auto', padding: '0' }}>
        <Skeleton width="100%" />
      </Box>
    </Box>
  </>
)

export default ExpandableTransactionItem
