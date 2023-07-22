import ModalDialog from '@/components/common/ModalDialog'
import { DialogContent } from '@mui/material'
import SafeApps from '@/pages/apps/open'
import React from 'react'

const ViewAppModal: React.FC<{
  open: boolean
  onClose: () => void
  url?: string
}> = ({ open, onClose, url }) => {
  return (
    <ModalDialog open={open} dialogTitle="View App" onClose={onClose} maxWidth="xl">
      <DialogContent sx={{ maxHeight: '90vh', overflow: 'auto', padding: '0' }}>
        <SafeApps safeAppUrl={url} />
      </DialogContent>
    </ModalDialog>
  )
}

export default ViewAppModal
