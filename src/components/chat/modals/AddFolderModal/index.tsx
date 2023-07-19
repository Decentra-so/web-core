import ModalDialog from '@/components/common/ModalDialog'
import DeleteIcon from '@/public/images/common/delete.svg'
import { Box, Button, DialogContent, IconButton, List, ListItem, ListItemText, SvgIcon, TextField, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'

export const AddFolderModal: React.FC<{
  open: boolean
  onClose: () => void
}> = ({ open, onClose }) => {
  const [folderName, setFolderName] = useState<string>('')
  const [folders, setFolders] = useState<string[]>(JSON.parse(localStorage.getItem('folders')!))

  const createFolder = async () => {
    localStorage.setItem('folders', JSON.stringify(folders ? [...folders, `${folderName!}`] : [folderName!]))
    setFolders(JSON.parse(localStorage.getItem('folders')!))
    setFolderName('')
    window.dispatchEvent(new Event('storage'))
  }

  const deleteFolder = async (name: string) => {
    localStorage.setItem('folders', JSON.stringify(folders ? folders.filter((folder: string) => folder !== name) : []))
    setFolders(JSON.parse(localStorage.getItem('folders')!))
    window.dispatchEvent(new Event('storage'))
  }

  return (
    <ModalDialog open={open} dialogTitle="Create Folder" onClose={onClose}>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={5} pt={4} m="auto">
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: '16px' }}>
            <TextField
              sx={{ flex: 1 }}
              size="small"
              variant="outlined"
              placeholder={'Input new folder name...'}
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
            <Button variant="contained" onClick={createFolder}>
              Create Folder
            </Button>
          </Box>
          <List sx={{ width: '100%' }}>
            {!!folders && folders.length > 0 && folders.map((folder, index) =>
              <ListItem key={`${folder}-${index}`} alignItems="flex-start">
                <ListItemText
                  primary={
                    <React.Fragment>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '16px' }}>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                        >
                          {folder}
                        </Typography>
                        <Tooltip title="Delete folder" placement="top">
                          <IconButton onClick={e => deleteFolder(folder)} size="small">
                            <SvgIcon component={DeleteIcon} inheritViewBox color="error" fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </React.Fragment>
                  }
                />
              </ListItem>
            )}
          </List>
        </Box>
      </DialogContent>
    </ModalDialog>
  )
}
