import AssetsTable from '@/components/balances/AssetsTable'
import CurrencySelect from '@/components/balances/CurrencySelect'
import HiddenTokenButton from '@/components/balances/HiddenTokenButton'
import TokenListSelect from '@/components/balances/TokenListSelect'
import ModalDialog from '@/components/common/ModalDialog'
import PagePlaceholder from '@/components/common/PagePlaceholder'
import NftCollections from '@/components/nfts/NftCollections'
import useBalances from '@/hooks/useBalances'
import NoAssetsIcon from '@/public/images/balances/no-assets.svg'
import { Box, DialogContent, Stack, Tab, Tabs, Typography } from '@mui/material'
import React, { useState } from 'react'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1.5 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

const ViewAssetsModal: React.FC<{
  open: boolean
  nfts: boolean
  onClose: () => void
}> = ({ open, nfts, onClose }) => {
  const [tabIndex, setTabIndex] = useState<number>(nfts ? 1 : 0);
  const { error } = useBalances()
  const [showHiddenAssets, setShowHiddenAssets] = useState(false)
  const toggleShowHiddenAssets = () => setShowHiddenAssets((prev) => !prev)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue)
  }

  return (
    <ModalDialog open={open} dialogTitle="View Assets" onClose={onClose} maxWidth="md">
      <DialogContent>
        <Stack spacing={{ xs: 1, sm: 2 }} direction="row" justifyContent='space-between' alignItems='center'>
          <Tabs value={tabIndex} onChange={handleChange} aria-label="folder tabs">
            <Tab label="Tokens" />
            <Tab label="NFTs" />
          </Tabs>
          {tabIndex === 0 &&
            <Box display='flex' flexDirection='row' alignItems='center' gap={1} paddingTop={2}>
              <HiddenTokenButton showHiddenAssets={showHiddenAssets} toggleShowHiddenAssets={toggleShowHiddenAssets} />
              <TokenListSelect />
              <CurrencySelect />
            </Box>
          }
        </Stack>
        <TabPanel value={tabIndex} index={0}>
          <main>
            {error ? (
              <PagePlaceholder img={<NoAssetsIcon />} text="There was an error loading your assets" />
            ) : (
              <AssetsTable setShowHiddenAssets={setShowHiddenAssets} showHiddenAssets={showHiddenAssets} />
            )}
          </main>
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <NftCollections />
        </TabPanel>
      </DialogContent>
    </ModalDialog >
  )
}

export default ViewAssetsModal
