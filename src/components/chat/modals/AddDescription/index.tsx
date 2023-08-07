import ModalDialog from '@/components/common/ModalDialog'
import { Box, Button, DialogContent, TextField } from '@mui/material'
import React, { useState } from 'react'
import { insertDescription } from '@/services/supabase'
import { getCookie } from 'typescript-cookie'
import useWallet from '@/hooks/wallets/useWallet'

export const AddTxDescription: React.FC<{
  open: boolean
  onClose: () => void
  id: string
  owner: string
  updateDescription: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ open, onClose, id, owner, updateDescription }) => {
  const [description, setDescription] = useState<string>('')
  const wallet = useWallet()
  const auth = getCookie(wallet?.address || '')

  const addDescription = async () => {
    await insertDescription(id, description, owner, auth!).then(() => updateDescription(true))
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
