import CheckWallet from '@/components/common/CheckWallet'
import { OVERVIEW_EVENTS, trackEvent } from '@/services/analytics'
import AddIcon from '@/public/images/chat/lightning-svgrepo-com.svg'
import { IconButton } from '@mui/material'
import dynamic from 'next/dynamic'
import { Suspense, useState, type ReactElement } from 'react'

const NewTxModal = dynamic(() => import('@/components/tx/modals/NewTxModal'))

const AddNewTxLightningIconButton = (): ReactElement => {
  const [txOpen, setTxOpen] = useState<boolean>(false)

  const onClick = () => {
    setTxOpen(true)

    trackEvent(OVERVIEW_EVENTS.NEW_TRANSACTION)
  }

  return (
    <>
      <CheckWallet allowSpendingLimit>
        {(isOk) => (
          <IconButton aria-label="add transaction" onClick={onClick} disabled={!isOk} sx={ margin: '0 6px' }>
            <AddIcon />
          </IconButton>
        )}
      </CheckWallet>

      {txOpen && (
        <Suspense>
          <NewTxModal onClose={() => setTxOpen(false)} />
        </Suspense>
      )}
    </>
  )
}

export default AddNewTxLightningIconButton
