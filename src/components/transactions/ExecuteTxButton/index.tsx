import type { SyntheticEvent } from 'react'
import { useState, type ReactElement, useContext } from 'react'
import { type TransactionSummary } from '@safe-global/safe-gateway-typescript-sdk'
import { Button, Tooltip, SvgIcon, Box } from '@mui/material'

import useSafeInfo from '@/hooks/useSafeInfo'
import { isMultisigExecutionInfo } from '@/utils/transaction-guards'
import ExecuteTxModal from '@/components/tx/modals/ExecuteTxModal'
import useIsPending from '@/hooks/useIsPending'
import RocketIcon from '@/public/images/transactions/rocket.svg'
import IconButton from '@mui/material/IconButton'
import { ReplaceTxHoverContext } from '../GroupedTxListItems/ReplaceTxHoverProvider'
import CheckWallet from '@/components/common/CheckWallet'

const ExecuteTxButton = ({
  txSummary,
  compact = false,
  compactnew = false,
}: {
  txSummary: TransactionSummary
  compact?: boolean
  compactnew?: boolean
}): ReactElement => {
  const [open, setOpen] = useState<boolean>(false)
  const { safe } = useSafeInfo()
  const txNonce = isMultisigExecutionInfo(txSummary.executionInfo) ? txSummary.executionInfo.nonce : undefined
  const isPending = useIsPending(txSummary.id)
  const { setSelectedTxId } = useContext(ReplaceTxHoverContext)

  const isNext = txNonce !== undefined && txNonce === safe.nonce
  const isDisabled = !isNext || isPending

  const onClick = (e: SyntheticEvent) => {
    e.stopPropagation()
    setOpen(true)
  }

  const onMouseEnter = () => {
    setSelectedTxId(txSummary.id)
  }

  const onMouseLeave = () => {
    setSelectedTxId(undefined)
  }

  return (
    <>
      <CheckWallet allowNonOwner>
        {(isOk) => (
          <Box height={1} width={1}>
            {compact ? (
              <Tooltip title="Execute" arrow placement="top">
                <span>
                  <IconButton
                    onClick={onClick}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    color="primary"
                    disabled={!isOk || isDisabled}
                    size="small"
                  >
                    <SvgIcon component={RocketIcon} inheritViewBox fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            ) : compactnew? (
                  <IconButton
                    onClick={onClick}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    color="primary"
                    disabled={!isOk || isDisabled}
                    size="small"
                    sx={{ width: '100%', height: '100%', borderRadius: '0 0 0 16px' }}
                  >
                    <SvgIcon component={RocketIcon} inheritViewBox fontSize="small" />
                    <Box sx={{ fontSize: '16px', marginLeft: '6px', fontWeight: '600' }}>Execute</Box>
                  </IconButton>
            ) : (
              <Button
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                variant="contained"
                disabled={!isOk || isDisabled}
                size="stretched"
              >
                Execute
              </Button>
            )}
          </Box>
        )}
      </CheckWallet>

      {open && <ExecuteTxModal onClose={() => setOpen(false)} initialData={[txSummary]} />}
    </>
  )
}

export default ExecuteTxButton
