import Skeleton from '@mui/material/Skeleton'
import makeBlockie from 'ethereum-blockies-base64'
import type { CSSProperties, ReactElement } from 'react'
import { useMemo } from 'react'

import css from './styles.module.css'

export interface IdenticonProps {
  address: string
  size?: number
  radius?: number
}

const Identicon = ({ address, radius, size = 40 }: IdenticonProps): ReactElement => {
  const style = useMemo<CSSProperties | null>(() => {
    try {
      const blockie = makeBlockie(address)
      return {
        backgroundImage: `url(${blockie})`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${radius}px`
      }
    } catch (e) {
      return null
    }
  }, [address, size, radius])

  return !style ? (
    <Skeleton variant="circular" width={size} height={size} />
  ) : (
    <div className={css.icon} style={style} />
  )
}

export default Identicon
