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
          justifyContent: 'center',
          bottom: 0,
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
        }}
      >
        {/* <Link href={{ pathname: AppRoutes.balances.index, query: { safe: `${safeAddress}` } }} key={`${safe}`} passHref> */}
        <Button
          className={css.quickactionstyled}
          onClick={() => toggleTokenTransfer(!tokenTransfer)}
        >
          <SvgIcon component={AssetsIcon} inheritViewBox sx={{ borderRadius: '100px', background: '#ff5050', margin: '0', width: '72px', height: '52px', justifyContent: 'center', alignItems: 'center', padding: '6px', color: 'white' }} />
          Send tokens
        </Button>
        {/* </Link> */}
        <Button
          variant="outlined"
          className={css.quickactionstyled}
          onClick={() => { toggleAssetsOpen(!assetsOpen); setNftsOpen(true) }}
          fullWidth
        >
          <SvgIcon component={NftIcon} inheritViewBox sx={{ borderRadius: '100px', background: '#ff5076', margin: '0', width: '72px', height: '52px', justifyContent: 'center', alignItems: 'center', padding: '6px', color: 'white' }} />
          Send NFTs
        </Button>
      </Box>
    </>
  )
}
