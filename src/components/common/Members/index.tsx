import { AddOwner } from '@/components/chat/AddOwner'
import { Box, List, Typography } from '@mui/material'
import React from 'react'
import Member from './member'

interface TypeMembers {
  members: any[]
}

const Members: React.FC<TypeMembers> = ({ members }) => {
  return (
    <>
      <Box sx={{ pt: 2, px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontWeight: 600 }}>Members</Typography>
        <AddOwner />
      </Box>
      <List sx={{ px: 1, pb: 2 }}>
        {members.map((member, index) => (
          <Member key={index} member={member} />
        ))}
      </List>
    </>
  )
}

export default Members
