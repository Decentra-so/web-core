import css from '@/components/chat/styles.module.css'
import NftIcon from '@/public/images/common/nft.svg'
import AssetsIcon from '@/public/images/sidebar/assets.svg'
import { Box, Button, SvgIcon } from '@mui/material'
import React, { useState } from 'react'
import TokenTransferModal from '../tx/modals/TokenTransferModal'
import ViewAssetsModal from './modals/ViewAssetsModal'

export const QuickActionButtonsChat = () => {
  const [tokenTransfer, toggleTokenTransfer] = useState<boolean>(false)
  const [assetsOpen, toggleAssetsOpen] = useState<boolean>(false)
  const [nftsOpen, setNftsOpen] = useState<boolean>(false)

  return (
    <>
            {tokenTransfer && (
        <TokenTransferModal
          onClose={() => toggleTokenTransfer(!tokenTransfer)}
          initialData={[{ disableSpendingLimit: false }]}
        />
      )}
      {assetsOpen && <ViewAssetsModal open={assetsOpen} onClose={() => toggleAssetsOpen(!assetsOpen)} nfts={nftsOpen} />}
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
