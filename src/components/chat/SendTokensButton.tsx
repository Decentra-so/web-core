import CheckWallet from '@/components/common/CheckWallet'
import { OVERVIEW_EVENTS, trackEvent } from '@/services/analytics'
import Button from '@mui/material/Button'
import dynamic from 'next/dynamic'
import { Suspense, useState, type ReactElement } from 'react'
import css from '@/components/chat/styles.module.css'

const NewTxModal = dynamic(() => import('@/components/tx/modals/NewTxModal'))

const SendTokensButton = (): ReactElement => {
  const [tokenModalOpen, setTokenModalOpen] = useState<boolean>(false)

  const onTokenModalOpen = () => {
    trackEvent(MODALS_EVENTS.SEND_FUNDS)
    setTokenModalOpen(true)
  }

  return (
    <>
      <CheckWallet allowSpendingLimit>
        {(isOk) => (
          <Button onClick={onTokenModalOpen} disabled={!isOk} variant="outlined" className={css.buttonstyled} size="small">
            Send tokens
          </Button>
        )}
      </CheckWallet>

      {tokenModalOpen && (
        <Suspense>
          <NewTxModal onClose={() => setTokenModalOpen(false)} />
        </Suspense>
      )}
    </>
  )
}

export default SendTokensButton
