import CheckWallet from '@/components/common/CheckWallet'
import { trackEvent, MODALS_EVENTS } from '@/services/analytics'
import Button from '@mui/material/Button'
import dynamic from 'next/dynamic'
import { Suspense, useState, type ReactElement } from 'react'
import css from '@/components/chat/styles.module.css'

import TokenTransferModal from '@/components/tx/modals/TokenTransferModal'
import { SendAssetsField } from '@/components/tx/modals/TokenTransferModal/SendAssetsForm'

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
        <TokenTransferModal
          initialData={[{ [SendAssetsField.recipient]: recipient, { txNonce }]}
        />
      )}
    </>
  )
}

export default SendTokensButton
