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
import { Box, Select, InputLabel, MenuItem, FormControl, Button, DialogContent, Stack } from '@mui/material'

import type { SelectChangeEvent } from '@mui/material/Select';

import React, { useState } from 'react'

const ViewTransactionsModal: React.FC<{
  open: boolean
  onClose: () => void
}> = ({ open, onClose }) => {
  const [tabIndex, setTabIndex] = useState('');
  const [filter] = useTxFilter()
  const [showFilter, setShowFilter] = useState(false)
  const handleChange = (event: SelectChangeEvent) => {
    setTabIndex(event.target.value as string);
  }
  const toggleFilter = () => {
    setShowFilter((prev) => !prev)
  }

  const ExpandIcon = showFilter ? ExpandLessIcon : ExpandMoreIcon
  return (
    <ModalDialog open={open} dialogTitle="View Transactions" onClose={onClose} maxWidth="md">
      <DialogContent sx={{ maxHeight: '90vh', overflow: 'auto' }}>
        <Stack spacing={{ xs: 1, sm: 2 }} direction="row" justifyContent='space-between' alignItems='center' paddingTop={2}>
          
              <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={tabIndex}
          label="View"
          onChange={handleChange}
        >
          <MenuItem value={0}>Ten</MenuItem>
          <MenuItem value={1}>Twenty</MenuItem>
          <MenuItem value={2}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </Box>
          
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
                  {tabIndex === 0 &&
          <Queue showTabs={false} />
          }

                          {tabIndex === 1 &&
          <main>
            {showFilter && <TxFilterForm modal={true} toggleFilter={toggleFilter} />}

            <Box mb={4}>
              <PaginatedTxns useTxns={useTxHistory} />
            </Box>
          </main>          }

                          {tabIndex === 2 &&
          <Messages showTabs={false} />
          }
      </DialogContent>
    </ModalDialog>
  )
}

export default ViewTransactionsModal
