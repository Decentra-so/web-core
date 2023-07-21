import type { ReactElement } from 'react'
import { Link } from '@mui/material'
import { AppRoutes } from '@/config/routes'
import { useRouter } from 'next/router'

const TxFullShareLink = ({ id }: { id: string }): ReactElement => {

  const router = useRouter()
  const { safe = '' } = router.query
  const href = `${AppRoutes.transactions.tx}?safe=${safe}&id=${id}`

  return (
      <Link href={href} underline="none" sx={{ width: '100%', height: '100%', display: 'flex',justifyContent: 'center', alignItems: 'center', fontSize: '15px' }}>
        View more details
      </Link>
  )
}

export default TxFullShareLink
