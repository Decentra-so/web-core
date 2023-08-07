import type { Palette } from '@mui/material'
import { Box, CircularProgress, Typography, Divider, Button } from '@mui/material'
import type { ReactElement } from 'react'
import { useState, useEffect } from 'react'
import { type Transaction, TransactionStatus } from '@safe-global/safe-gateway-typescript-sdk'
import TxFullShareLink from '@/components/transactions/TxFullShareLink'
import DateTime from '@/components/common/DateTime'
import TxInfo from '@/components/transactions/TxInfo'
import SignTxButton from '@/components/transactions/SignTxButton'
import ExecuteTxButton from '@/components/transactions/ExecuteTxButton'
import css from './styles.module.css'
import useWallet from '@/hooks/wallets/useWallet'
import { isAwaitingExecution, isMultisigExecutionInfo, isTxQueued } from '@/utils/transaction-guards'
import RejectTxButton from '@/components/transactions/RejectTxButton'
import useTransactionStatus from '@/hooks/useTransactionStatus'
import TxType from '@/components/transactions/TxType'
import TxConfirmations from '../TxConfirmations'
import useIsPending from '@/hooks/useIsPending'
import { useAppDispatch } from '@/store'
import { openModal } from '@/store/modalServiceSlice'
import { modalTypes } from '@/components/chat/modals'
import { readDescription } from '@/services/supabase'
import { getCookie } from 'typescript-cookie'
import useSafeInfo from '@/hooks/useSafeInfo'

const getStatusColor = (value: TransactionStatus, palette: Palette) => {
  switch (value) {
    case TransactionStatus.SUCCESS:
      return palette.success.main
    case TransactionStatus.FAILED:
    case TransactionStatus.CANCELLED:
      return palette.error.main
    case TransactionStatus.AWAITING_CONFIRMATIONS:
    case TransactionStatus.AWAITING_EXECUTION:
      return palette.warning.main
    default:
      return palette.primary.main
  }
}

type TxSummaryProps = {
  isGrouped?: boolean
  item: Transaction
}

const TxSummaryChat = ({ item, isGrouped }: TxSummaryProps): ReactElement => {

  const [description, setDescription] = useState<{ description: string, owner: string } | null>()
  const [update, setUpdate] = useState(false)
  const dispatch = useAppDispatch()
  const tx = item.transaction
  const wallet = useWallet()
  const txStatusLabel = useTransactionStatus(tx)
  const isPending = useIsPending(tx.id)
  const isQueue = isTxQueued(tx.txStatus)
  const awaitingExecution = isAwaitingExecution(tx.txStatus)
  const nonce = isMultisigExecutionInfo(tx.executionInfo) ? tx.executionInfo.nonce : undefined
  const { safe } = useSafeInfo()
  const requiredConfirmations = isMultisigExecutionInfo(tx.executionInfo)
    ? tx.executionInfo.confirmationsRequired
    : undefined
  const submittedConfirmations = isMultisigExecutionInfo(tx.executionInfo)
    ? tx.executionInfo.confirmationsSubmitted
    : undefined
    const owners = safe?.owners || ['']
    const ownerArray = owners.map((owner) => owner.value)
  const auth = getCookie(wallet?.address || '')
  const displayConfirmations = isQueue && !!submittedConfirmations && !!requiredConfirmations

  useEffect(() => {
    const read = async () => {
      const des = readDescription(tx.id, auth!)
      return des
    }
    read().then((res) => res?.length && setDescription(res[0]))
  }, [tx?.id, update, auth])

  return (
    <Box
      className={css.gridContainer}
      id={tx.id}
    >
      <Box sx={{ display: 'flex', filter: 'drop-shadow(0px 1px 1px #00000010)' }}>
      	<Box sx={{ borderTop: '11px solid var(--color-background-papercolor)', borderLeft: '7px solid transparent', borderRadius: '3px 0px 0px 0px' }} />	  
        <Box className={css.txfullgridview}>
        <Box className={css.coretxbackground}>
      {nonce && !isGrouped && <Box gridArea="nonce" className={css.transactionnonce}>TRANSACTION #{nonce}</Box>}

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ padding: '16px 0' }}>
      <Box gridArea="type" className={css.columnWrap}>
        <TxType tx={tx} />
      </Box>

      <Box gridArea="info" className={css.columnWrap}>
        <TxInfo info={tx.txInfo} />
      </Box>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      {displayConfirmations && (
      <Box className={css.infosectiontransaction}>
        <Box sx={{ fontSize: '13px', color: '#757575' }}>Confirmations</Box>
        <Box gridArea="confirmations" display="flex" alignItems="center" gap={1}>
          <TxConfirmations
            submittedConfirmations={submittedConfirmations}
            requiredConfirmations={requiredConfirmations}
          />
        </Box>
      </Box>
      )}

      <Box className={css.infosectiontransaction}>
        <Box sx={{ fontSize: '13px', color: '#757575' }}>Status</Box>
          <Box
            gridArea="status"
            display="flex"
            alignItems="center"
            gap={1}
            color={({ palette }) => getStatusColor(tx.txStatus, palette)}
          >
            {isPending && <CircularProgress size={14} color="inherit" />}

            <Typography variant="caption" fontWeight="bold" color={({ palette }) => getStatusColor(tx.txStatus, palette)}>
              {txStatusLabel}
            </Typography>
      
          </Box>
        </Box>
        
          {
            auth && description && ownerArray.includes(wallet?.address || '') && <Box className={css.infosectiontransaction}>
              <Box sx={{ fontSize: '13px', color: '#757575' }}>Description</Box>
              <Box gridArea="description" display="flex" alignItems="center" gap={1}>
                <Typography variant="caption" fontWeight="bold" color={({ palette }) => getStatusColor(tx.txStatus, palette)}>
                  {description.description}
                </Typography>
              </Box>
            </Box>
          }
          {
            auth && !description && ownerArray.includes(wallet?.address || '') && <Button
            onClick={() => dispatch(
              openModal({
                modalName: modalTypes.addTransactionDescription,
                modalProps: {
                  id: tx.id,
                  owner: wallet?.address!,
                  updateDescription: setUpdate
                }
              }
            ))}>
              Add description
            </Button>
          }
          </Box>

          <Box gridArea="date" className={css.transactiondate}>
            <DateTime value={tx.timestamp} />
          </Box>

        </Box>
      </Box>
      
      {tx.txInfo.type !== 'Creation' && (
        <Box className={css.actiontransactionbutton}>
          <TxFullShareLink id={tx.id} />
        </Box>
      )}
      

      {wallet && isQueue && (
        <Box gridArea="actions" className={css.twoactiontransactionbutton}>
          <Box className={css.actiondirectbox}>
          {awaitingExecution ? (
            <ExecuteTxButton txSummary={item.transaction} compactnew />
          ) : (
            <SignTxButton txSummary={item.transaction} compactnew />
          )}
            </Box>
            <Box className={css.actiondirectbox}>
              <RejectTxButton txSummary={item.transaction} compactnew />
            </Box>
        </Box>
      )}
    </Box>
  )
}

export default TxSummaryChat
