import ModalDialog from '@/components/common/ModalDialog'
import SafeAppList from '@/components/safe-apps/SafeAppList'
import { useSafeApps } from '@/hooks/safe-apps/useSafeApps'
import {
  Tab,
  Tabs,
  Box,
  Typography,
  DialogContent
} from '@mui/material'
import React, { useState } from 'react'
import BookmarkedSafeApps from '@/pages/apps/bookmarked'
import CustomSafeApps from '@/pages/apps/custom'
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

const ViewAppsModal: React.FC<{
  open: boolean
  onClose: () => void
}> = ({ open, onClose }) => {
  const [tab, setTab] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  const {
    remoteSafeApps,
    remoteSafeAppsLoading,
    pinnedSafeAppIds: bookmarkedSafeAppsId,
    togglePin: onBookmarkSafeApp,
  } = useSafeApps()
  return (
    <ModalDialog open={open} dialogTitle="View Apps" onClose={onClose} maxWidth="md">
      <DialogContent sx={{ maxHeight: '90vh', overflow: 'auto' }}>
        <Tabs value={tab} onChange={handleChange} aria-label="folder tabs" variant="scrollable" scrollButtons="auto">
          <Tab label="All Apps" />
          <Tab label="Bookmarked Apps" />
          <Tab label="My Custom Apps" />
        </Tabs>
        <TabPanel value={tab} index={0}>
          <SafeAppList
            modal={true}
            safeAppsList={remoteSafeApps}
            safeAppsListLoading={remoteSafeAppsLoading}
            bookmarkedSafeAppsId={bookmarkedSafeAppsId}
            onBookmarkSafeApp={onBookmarkSafeApp}
            showFilters
          />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <BookmarkedSafeApps />
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <CustomSafeApps />
        </TabPanel>
      </DialogContent>
    </ModalDialog>
  )
}

export default ViewAppsModal
