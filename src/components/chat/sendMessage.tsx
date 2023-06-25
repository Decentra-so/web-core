import React from 'react'
import { Button } from '@mui/material'
import { Box, TextField } from '@mui/material'
import { sendMessage } from '@/services/chat'

const SendMessage: React.FC<{
  safeAddress: string
  setMessages: any
  prevState: any
}> = ({ safeAddress, setMessages, prevState }) => {
  const [message, setMessage] = React.useState<string>()
  
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!message) return
    await sendMessage(`pid_${safeAddress}`, message)
      .then(async (msg: any) => {
        setMessages(() => [...prevState, msg])
        setMessage('')
      })
      .catch((error: any) => {
        console.log(error)
      })
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', gap: '16px' }}>
      <TextField
        sx={{ flexGrow: 1 }}
        label="Type Something"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button variant="contained" onClick={handleSubmit}>
        Send message
      </Button>
    </Box>
  )
}

export default SendMessage
