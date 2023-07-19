import type { ReactElement } from 'react'
import { Link } from '@mui/material'
import { AppRoutes } from '@/config/routes'
import { useRouter } from 'next/router'
import Track from '@/components/common/Track'
import { TX_LIST_EVENTS } from '@/services/analytics/events/txList'
import React, { useState } from 'react'

const TxFullShareLink = ({ id }: { id: string }): ReactElement => {
  const [isCopyEnabled, setIsCopyEnabled] = useState(true)

  const router = useRouter()
  const { safe = '' } = router.query
  const href = `${AppRoutes.transactions.tx}?safe=${safe}&id=${id}`

  return (
    <Track {...TX_LIST_EVENTS.COPY_DEEPLINK}>
      <Link href={href} underline="none">
        View more details
      </Link>
    </Track>
  )
}

export default TxFullShareLink
