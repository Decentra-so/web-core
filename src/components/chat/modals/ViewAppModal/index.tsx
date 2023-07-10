import ModalDialog from '@/components/common/ModalDialog'
import { DialogContent } from '@mui/material'
import SafeApps from '@/pages/apps/open'
import React from 'react'

const ViewAppModal: React.FC<{
  open: boolean
  onClose: () => void
}> = ({ open, onClose }) => {
  return (
    <ModalDialog open={open} dialogTitle="View App" onClose={onClose} maxWidth="md">
      <DialogContent sx={{ maxHeight: '90vh', overflow: 'auto' }}>
        <SafeApps />
      </DialogContent>
    </ModalDialog>
  )
}

export default ViewAppModal
