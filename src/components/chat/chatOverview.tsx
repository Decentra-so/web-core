import css from '@/components/chat/styles.module.css'
import { ThresholdOverview } from '@/components/chat/threshold'
import useSafeInfo from '@/hooks/useSafeInfo'
import NftIcon from '@/public/images/common/nft.svg'
import AssetsIcon from '@/public/images/sidebar/assets.svg'
import { Box, Button, Divider, SvgIcon, Typography } from '@mui/material'
import React, { useState } from 'react'
import Members from '../common/Members'
import TransactionHistory from '../common/TransactionHistory'
import TransactionQueue from '../common/TransactionQueue'
import TokenTransferModal from '../tx/modals/TokenTransferModal'
import { modalTypes } from './modals'
import ViewAssetsModal from './modals/ViewAssetsModal'

import SafeTagsInfo from '@/components/chat/SafeTagsInfo'

import Identicon from '@/components/common/Identicon'
import CopyButton from '@/components/common/CopyButton'
import QrCodeButton from '@/components/sidebar/QrCodeButton'
import { useCurrentChain } from '@/hooks/useChains'
import AppsIcon from '@/public/images/apps/apps-icon.svg'
import CopyIcon from '@/public/images/common/copy.svg'
import LinkIcon from '@/public/images/common/link.svg'
import { useAppSelector } from '@/store'
import { selectSettings } from '@/store/settingsSlice'
import { getBlockExplorerLink } from '@/utils/chains'
import ellipsisAddress from '@/utils/ellipsisAddress'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useAppDispatch } from '@/store'
import { openModal } from '@/store/modalServiceSlice'

export const ChatOverview: React.FC<{
  owners: any[]
}> = ({ owners }) => {
  const { safe, safeAddress } = useSafeInfo()
  const ownerLength = safe?.owners?.length || 0
  const threshold = safe.threshold
  const [tokenTransfer, toggleTokenTransfer] = useState<boolean>(false)
  const [assetsOpen, toggleAssetsOpen] = useState<boolean>(false)
  const [nftsOpen, setNftsOpen] = useState<boolean>(false)
  const dispatch = useAppDispatch()
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
      {assetsOpen && <ViewAssetsModal open={assetsOpen} onClose={() => toggleAssetsOpen(!assetsOpen)} nfts={nftsOpen} />}
      <Box sx={{ p: 3, pt: 2, display: 'flex', flexFlow: 'column', gap: 3 }}>
        <Typography sx={{ fontWeight: 600 }}>
          Overview
        </Typography>
        <Box>
          <Box sx={{ display: 'flex', flexFlow: 'column', alignItems: 'center', gap: '14px' }}>
            <Identicon address={safeAddress} radius={12} size={64} />
            <Box sx={{ textAlign: 'center' }}>
            {/* Make this functional by showing address book name (if existing), and always an edit icon to change the address book name */}
            <Typography fontWeight={600}>
              Unlabeled
            </Typography>  
            <Typography noWrap>
              {ellipsisAddress(`${safeAddress}`)}
            </Typography>
            </Box>
            {/* <PrefixedEthHashInfo address={safeAddress} showAvatar={false} /> */}
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
        <SafeTagsInfo threshold={threshold} owners={ownerLength} />
      </Box>
      <Divider />
      <Members members={owners} />
      <Divider />
      <TransactionQueue key={safeAddress} />
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
          onClick={() => { toggleAssetsOpen(!assetsOpen); setNftsOpen(false) }}
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
        <Button variant="outlined" className={css.buttonstyled} size="small" onClick={() => dispatch(openModal({ modalName: modalTypes.appsModal, modalProps: '' }))}>
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
        <Button
          variant="outlined"
          className={css.buttonstyled}
          startIcon={<SvgIcon component={NftIcon} inheritViewBox />}
          onClick={() => { toggleAssetsOpen(!assetsOpen); setNftsOpen(true) }}
          fullWidth
        >
          Send NFTs
        </Button>
      </Box>
    </>
  )
}
