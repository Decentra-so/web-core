import type { ReactElement } from 'react'
import { Button } from '@mui/material'
import { AppRoutes } from '@/config/routes'
import { useRouter } from 'next/router'
import { useAppDispatch } from '@/store'
import { openModal } from '@/store/modalServiceSlice'
import { modalTypes } from '@/components/chat/modals'

const TxFullShareLink = ({ id }: { id: string }): ReactElement => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { safe = '' } = router.query
  const href = `${AppRoutes.chat}?safe=${safe}&id=${id}`

  const openTX = () => {
    router.push(href)
    dispatch(openModal({ modalName: modalTypes.viewSingleTransaction, modalProps: '' }))
  }

  return (
    <Button
      onClick={openTX}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '15px' }}
      >
      View more details
    </Button>
  )
}

export default TxFullShareLink
