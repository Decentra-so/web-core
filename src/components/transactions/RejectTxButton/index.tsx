import type { TransactionSummary } from '@safe-global/safe-gateway-typescript-sdk'
import { Button, SvgIcon, Box } from '@mui/material'

import type { SyntheticEvent, ReactElement } from 'react'
import { useState, Suspense } from 'react'
import { isMultisigExecutionInfo } from '@/utils/transaction-guards'
import dynamic from 'next/dynamic'
import useIsPending from '@/hooks/useIsPending'
import IconButton from '@mui/material/IconButton'
import ErrorIcon from '@/public/images/notifications/error.svg'
import Track from '@/components/common/Track'
import { TX_LIST_EVENTS } from '@/services/analytics/events/txList'
import CheckWallet from '@/components/common/CheckWallet'

const NewTxModal = dynamic(() => import('@/components/tx/modals/NewTxModal'))

const RejectTxButton = ({
  txSummary,
  compact = false,
}: {
  txSummary: TransactionSummary
  compact?: boolean
}): ReactElement | null => {
  const [open, setOpen] = useState<boolean>(false)
  const txNonce = isMultisigExecutionInfo(txSummary.executionInfo) ? txSummary.executionInfo.nonce : undefined
  const isDisabled = useIsPending(txSummary.id)

  const onClick = (e: SyntheticEvent) => {
    e.stopPropagation()
    setOpen(true)
  }

  return (
    <>
      <CheckWallet>
        {(isOk) => (
          <Track {...TX_LIST_EVENTS.REJECT}>
            {compact ? (
                <span>
                  <IconButton onClick={onClick} color="error" size="small" disabled={!isOk || isDisabled}>
                    <SvgIcon component={ErrorIcon} inheritViewBox fontSize="small" />
                    <Box sx={{ fontSize: '16px', marginLeft: '4px', fontWeight: '600' }}>Replace</Box>
                  </IconButton>
                </span>
            ) : (
              <Button onClick={onClick} variant="danger" disabled={!isOk || isDisabled} size="stretched">
                Replace
              </Button>
            )}
          </Track>
        )}
      </CheckWallet>

      {open && (
        <Suspense>
          <NewTxModal onClose={() => setOpen(false)} txNonce={txNonce} />
        </Suspense>
      )}
    </>
  )
}

export default RejectTxButton
