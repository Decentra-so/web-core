import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react';

import ViewAppModal from '@/components/chat/modals/ViewAppModal';
import ViewAssetsModal from '@/components/chat/modals/ViewAssetsModal';
import { AppRoutes } from '@/config/routes';
import { useTxBuilderApp } from '@/hooks/safe-apps/useTxBuilderApp';
import { MODALS_EVENTS, trackEvent } from '@/services/analytics';
import RejectTxModal from '../RejectTxModal';
import TokenTransferModal from '../TokenTransferModal';
import { SendAssetsField } from '../TokenTransferModal/SendAssetsForm';
import CreationModal from './CreationModal';
import ReplacementModal from './ReplacementModal';

const NewTxModal = ({
  onClose,
  recipient = '',
  txNonce,
}: {
  onClose: () => void
  recipient?: string
  txNonce?: number
}): ReactElement => {
  const router = useRouter()
  const [tokenModalOpen, setTokenModalOpen] = useState<boolean>(false)
  const [nftModalOpen, setNftModalOpen] = useState<boolean>(false)
  const [appModalOpen, setAppModalOpen] = useState<boolean>(false)
  const [appUrl, setAppUrl] = useState<string>()
  const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false)
  const isReplacement = txNonce !== undefined
  const showNftButton = router.pathname !== AppRoutes.balances.nfts
  const txBuilder = useTxBuilderApp()

  useEffect(() => {
    if (txBuilder && txBuilder.app) setAppUrl(txBuilder.app.url)
  }, [txBuilder])

  // These cannot be Track components as they intefere with styling
  const onTokenModalOpen = () => {
    trackEvent(MODALS_EVENTS.SEND_FUNDS)
    setTokenModalOpen(true)
  }

  const onNFTModalOpen = () => {
    trackEvent(MODALS_EVENTS.SEND_COLLECTIBLE)
    setNftModalOpen(true)
  }

  const onRejectModalOpen = () => {
    trackEvent(MODALS_EVENTS.REJECT_TX)
    setRejectModalOpen(true)
  }

  const onContractInteraction = () => {
    trackEvent(MODALS_EVENTS.CONTRACT_INTERACTION)
    setAppModalOpen(true)
  }

  const sharedProps = {
    open: !tokenModalOpen,
    onClose,
    onTokenModalOpen,
  }

  return (
    <>
      {isReplacement ? (
        <ReplacementModal txNonce={txNonce} onRejectModalOpen={onRejectModalOpen} {...sharedProps} />
      ) : (
        <CreationModal
          shouldShowTxBuilder={!recipient}
          onNFTModalOpen={showNftButton ? onNFTModalOpen : undefined}
          onContractInteraction={onContractInteraction}
          {...sharedProps}
        />
      )}
      {appModalOpen && (<ViewAppModal open={appModalOpen} onClose={onClose} url={appUrl} />)}
      {nftModalOpen && (
        <ViewAssetsModal open={nftModalOpen} onClose={onClose} nfts={true} />
      )}

      {tokenModalOpen && (
        <TokenTransferModal
          onClose={onClose}
          initialData={[{ [SendAssetsField.recipient]: recipient, disableSpendingLimit: isReplacement }, { txNonce }]}
        />
      )}

      {rejectModalOpen && typeof txNonce === 'number' ? (
        <RejectTxModal onClose={onClose} initialData={[txNonce]} />
      ) : null}
    </>
  )
}

export default NewTxModal
