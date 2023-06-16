import css from '@/components/chat/styles.module.css'
import { AppRoutes } from '@/config/routes'
import useSafeInfo from '@/hooks/useSafeInfo'
import NftIcon from '@/public/images/common/nft.svg'
import AssetsIcon from '@/public/images/sidebar/assets.svg'
import ellipsisAddress from '@/utils/ellipsisAddress'
import { Box, Button, Divider, SvgIcon, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import Link from 'next/link'
import React, { useState } from 'react'
import Members from '../common/Members'
import TransactionHistory from '../common/TransactionHistory'
import TransactionQueue from '../common/TransactionQueue'
import TokenTransferModal from '../tx/modals/TokenTransferModal'
import ViewAppsModal from './modals/ViewAppsModal'
import ViewAssetsModal from './modals/ViewAssetsModal'
import { ThresholdOverview } from '@/components/chat/threshold'

import { useAppSelector } from '@/store'
import { selectSettings } from '@/store/settingsSlice'
import { useCurrentChain } from '@/hooks/useChains'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import AppsIcon from '@/public/images/apps/apps-icon.svg'
import CopyIcon from '@/public/images/common/copy.svg'
import LinkIcon from '@/public/images/common/link.svg'
import { getBlockExplorerLink } from '@/utils/chains'
import CopyButton from '@/components/common/CopyButton'
import QrCodeButton from '@/components/sidebar/QrCodeButton'

export const ChatOverview: React.FC<{
  owners: any[]
}> = ({ owners }) => {
  const { safe, safeAddress } = useSafeInfo()
  const ownerLength = safe.owners.length
  const threshold = safe.threshold
  const [tokenTransfer, toggleTokenTransfer] = useState<boolean>(false)
  const [assetsOpen, toggleAssetsOpen] = useState<boolean>(false)
  const [appsOpen, toggleAppsOpen] = useState<boolean>(false)
  const settings = useAppSelector(selectSettings)
  const chain = useCurrentChain()
  const addressCopyText = settings.shortName.copy && chain ? `${chain.shortName}:${safeAddress}` : safeAddress
  const blockExplorerLink = chain ? getBlockExplorerLink(chain, safeAddress) : undefined
  
  
  return (
    <>
      {tokenTransfer && (
        <TokenTransferModal
          onClose={() => toggleTokenTransfer(!tokenTransfer)}
          initialData={[{ disableSpendingLimit: false }]}
        />
      )}
      {assetsOpen && <ViewAssetsModal open={assetsOpen} onClose={() => toggleAssetsOpen(!assetsOpen)} />}
      {appsOpen && <ViewAppsModal open={appsOpen} onClose={() => toggleAppsOpen(!appsOpen)} />}
      <Box sx={{ p: 3 }}>
        <Typography sx={{ fontWeight: 600, mb: 3}}>
          Overview
        </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '40px' }}>
        <Typography sx={{ color: grey[600] }}>
          Address
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Typography noWrap>
          {ellipsisAddress(`${safeAddress}`)}
        </Typography>
         <div className={css.iconButtons}>
            <QrCodeButton>
              <Tooltip title="Open QR code" placement="top">
                <IconButton className={css.iconButton}>
                  <SvgIcon component={AppsIcon} inheritViewBox fontSize="small" />
                </IconButton>
              </Tooltip>
            </QrCodeButton>

            <CopyButton text={addressCopyText} className={css.iconButton}>
              <SvgIcon component={CopyIcon} inheritViewBox fontSize="small" />
            </CopyButton>

            <Tooltip title={blockExplorerLink?.title || ''} placement="top">
              <IconButton
                className={css.iconButton}
                target="_blank"
                rel="noreferrer"
                href={blockExplorerLink?.href || ''}
              >
                <SvgIcon component={LinkIcon} inheritViewBox fontSize="small" />
              </IconButton>
            </Tooltip>
        </div>  
      </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '40px', pt: '17px' }}>
        <Typography sx={{ color: grey[600] }}>Network</Typography>
        <Typography>
          {safe?.chainId === '137'
            ? 'Polygon'
            : safe?.chainId === '1'
            ? 'Ethereum'
            : safe?.chainId === '10'
            ? 'Optimism'
            : safe?.chainId === '42161'
            ? 'Arbitrum'
            : safe?.chainId === '56'
            ? 'BNB Smart Chain'
            : safe?.chainId === '100'
            ? 'Gnosis Chain'
            : ''}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '40px', pt: '20px' }}>
        <Typography sx={{ color: grey[600] }}>
          Threshold
        </Typography>
        <ThresholdOverview threshold={threshold} owners={ownerLength} />
      </Box>
      </Box>
      <Divider />
      <Members members={owners} />
      <Divider />
      <TransactionQueue />
      <Divider />
      <TransactionHistory />
      <Divider />
      <Box sx={{ p: 3 }}>
        <Typography sx={{ fontWeight: 600 }} paragraph>
          Assets
        </Typography>
        <Typography paragraph>View all tokens and NFTs the Safe holds.</Typography>
        {/* <Link href={{ pathname: AppRoutes.balances.index, query: { safe: `${safeAddress}` } }} key={`${safe}`} passHref> */}
        <Button
          variant="outlined"
          className={css.buttonstyled}
          onClick={() => toggleAssetsOpen(!assetsOpen)}
          size="small"
        >
          View Assets
        </Button>
        {/* </Link> */}
      </Box>
      <Divider />
      <Box sx={{ p: 3 }}>
        <Typography sx={{ fontWeight: 600 }} paragraph>
          Apps
        </Typography>
        <Typography paragraph>
          Explore the Safe Apps ecosystem &mdash; connect to your favourite web3 applications with your Safe wallet,
          securely and efficiently
        </Typography>
        {/* <Link href={{ pathname: AppRoutes.apps.index, query: { safe: `${safeAddress}` } }} key={`${safe}`} passHref> */}
        <Button variant="outlined" className={css.buttonstyled} size="small" onClick={() => toggleAppsOpen(!appsOpen)}>
          Explore Apps
        </Button>
        {/* </Link> */}
      </Box>
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          p: 2,
          pl: 3,
          pr: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          bgcolor: 'var(--color-background-papercolor)',
          borderTop: '1px solid var(--color-border-light)',
        }}
      >
        {/* <Link href={{ pathname: AppRoutes.balances.index, query: { safe: `${safeAddress}` } }} key={`${safe}`} passHref> */}
        <Button
          variant="outlined"
          className={css.buttonstyled}
          onClick={() => toggleTokenTransfer(!tokenTransfer)}
          startIcon={<SvgIcon component={AssetsIcon} inheritViewBox />}
          fullWidth
        >
          Send tokens
        </Button>
        {/* </Link> */}
        <Link href={{ pathname: AppRoutes.balances.nfts, query: { safe: `${safeAddress}` } }} key={`${safe}`} passHref>
          <Button
            variant="outlined"
            className={css.buttonstyled}
            startIcon={<SvgIcon component={NftIcon} inheritViewBox />}
            fullWidth
          >
            Send NFTs
          </Button>
        </Link>
      </Box>
    </>
  )
}
