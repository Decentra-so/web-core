import ModalDialog from '@/components/common/ModalDialog'
import { Box, Button, DialogContent, TextField } from '@mui/material'
import React, { useState } from 'react'
import { insertDescription } from '@/services/supabase'
import { getCookie } from 'typescript-cookie'

export const AddTxDescription: React.FC<{
  open: boolean
  onClose: () => void
  id: string
  owner: string
}> = ({ open, onClose, id, owner }) => {
  const [description, setDescription] = useState<string>('')
  const auth = getCookie('me')
  const addDescription = async () => {
    console.log(id, owner, description, 'description')
    const tx = await insertDescription(id, description, owner, auth!)
    console.log(tx)
    setDescription('')
    onClose()
  }

  return (
    <ModalDialog open={open} dialogTitle="Add Transaction Description" maxWidth="md" onClose={onClose}>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={5} pt={4} m="auto">
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: '16px' }}>
            <TextField
              sx={{ flex: 1, width: '100%' }}
              size="small"
              variant="outlined"
              placeholder={'Input transaction description...'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button variant="contained" onClick={addDescription}>
              Add Description
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </ModalDialog>
  )
}
