import Arbitrum from '@/public/images/chains/arbitrum.svg'
import Avalanche from '@/public/images/chains/avalanche.svg'
import BNB from '@/public/images/chains/bnb.svg'
import Ethereum from '@/public/images/chains/ethereum.svg'
import Gnosis from '@/public/images/chains/gnosis.svg'
import Optimism from '@/public/images/chains/optimism.svg'
import Polygon from '@/public/images/chains/polygon.svg'
import Badge from '@mui/material/Badge'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import React from 'react'
import Identicon from '../common/Identicon'

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    height: 30,
    width: 30,
  },
}))

const BadgeAvatar: React.FC<{ safe: string, chainId: number }> = ({ safe, chainId }) => {
  return (
    <Stack direction="row" spacing={2}>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={<StyledBadge badgeContent={chainId === 42161 ? <Arbitrum /> : chainId === 56 ? <BNB /> : chainId === 100 ? <Gnosis /> : chainId === 137 ? <Polygon /> : chainId === 10 ? <Optimism /> : chainId === 1 ? <Ethereum /> : chainId === 43114 ? <Avalanche /> : ''} />}
      >
        <Identicon address={safe?.slice(safe?.lastIndexOf(':') + 1)} radius={6} size={32} />
      </Badge>
    </Stack >
  )
}

export default BadgeAvatar
