import { Box, Typography } from '@mui/material'
import type { ReactElement } from 'react'

import EthHashInfo from '@/components/common/EthHashInfo'
import type { ConnectedWallet } from '@/hooks/wallets/useOnboard'
import { useAppSelector } from '@/store'
import { selectChainById } from '@/store/chainsSlice'

import css from './styles.module.css'

export const UNKNOWN_CHAIN_NAME = 'Unknown'

const WalletInfo = ({ wallet }: { wallet: ConnectedWallet }): ReactElement => {
  const prefix = walletChain?.shortName

  return (
    <Box className={css.container}>
      <Box>
        <Typography fontWeight="bold" component="div">
          {wallet.ens ? (
            <div>{wallet.ens}</div>
          ) : (
            <EthHashInfo prefix={prefix || ''} address={wallet.address} showName={false} showAvatar avatarSize={32} />
          )}
        </Typography>
      </Box>
    </Box>
  )
}

export default WalletInfo
