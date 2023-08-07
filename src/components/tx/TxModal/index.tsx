import ModalDialog from '@/components/common/ModalDialog'
import type { TxStepperProps } from '@/components/tx/TxStepper/useTxStepper'
import type { ReactElement } from 'react'
import TxStepper from '../TxStepper'

export type TxModalProps = {
  open: boolean
  onClose: () => void
  steps: TxStepperProps['steps']
  wide?: boolean
  initialData?: TxStepperProps['initialData']
}

const TxModal = ({ open, onClose, steps, wide = false, initialData }: TxModalProps): ReactElement => {
  return (
    <ModalDialog open={open} onClose={onClose} maxWidth={wide ? 'md' : 'sm'} fullWidth>
      <TxStepper steps={steps} initialData={initialData} onClose={onClose} />
    </ModalDialog>
  )
}

export default TxModal
