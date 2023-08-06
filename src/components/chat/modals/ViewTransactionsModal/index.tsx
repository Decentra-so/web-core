import ModalDialog from '@/components/common/ModalDialog'
import PaginatedTxns from '@/components/common/PaginatedTxns'
import BatchExecuteButton from '@/components/transactions/BatchExecuteButton'
import SignedMessagesHelpLink from '@/components/transactions/SignedMessagesHelpLink'
import TxFilterForm from '@/components/transactions/TxFilterForm'
import useTxHistory from '@/hooks/useTxHistory'
import Messages from '@/pages/transactions/messages'
import Queue from '@/pages/transactions/queue'
import { useTxFilter } from '@/utils/tx-history-filter'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Button, DialogContent, Stack, Tab, Tabs, Typography } from '@mui/material'
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


const ViewTransactionsModal: React.FC<{
  open: boolean
  onClose: () => void
}> = ({ open, onClose }) => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [filter] = useTxFilter()
  const [showFilter, setShowFilter] = useState(false)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue)
  }
  const toggleFilter = () => {
    setShowFilter((prev) => !prev)
  }

  const ExpandIcon = showFilter ? ExpandLessIcon : ExpandMoreIcon
  return (
    <ModalDialog open={open} dialogTitle="View Transactions" onClose={onClose} maxWidth="md">
      <DialogContent sx={{ maxHeight: '90vh', overflow: 'auto' }}>
        <Stack spacing={{ xs: 1, sm: 2 }} direction="row" justifyContent='space-between' alignItems='center' paddingTop={2}>
          <Tabs value={tabIndex} onChange={handleChange} aria-label="folder tabs">
            <Tab label="Queue" />
            <Tab label="History" />
            <Tab label="Messages" />
          </Tabs>
          {tabIndex === 0 &&
            <BatchExecuteButton />
          }
          {tabIndex === 1 &&
            <Button variant="outlined" onClick={toggleFilter} size="small" endIcon={<ExpandIcon />}>
              {filter?.type ?? 'Filter'}
            </Button>
          }
          {tabIndex === 2 &&
            <SignedMessagesHelpLink />
          }
        </Stack>
        <TabPanel value={tabIndex} index={0}>
          <Queue showTabs={false} />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <main>
            {showFilter && <TxFilterForm modal={true} toggleFilter={toggleFilter} />}

            <Box mb={4}>
              <PaginatedTxns useTxns={useTxHistory} />
            </Box>
          </main>
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          <Messages showTabs={false} />
        </TabPanel>
      </DialogContent>
    </ModalDialog>
  )
}

export default ViewTransactionsModal
