import React from 'react'
import { Paper, Typography } from "@mui/material";
import SignInLink from '../auth-sign-in/auth-link';

export const AuthField: React.FC<{ setAuth: any, authToken: string }> = ({ setAuth, authToken }) => {
  return (
    <Paper
      component="form"
      sx={{ p: '4px 8.5px 4px 4px', display: 'flex', alignItems: 'center', width: '100%', filter: 'drop-shadow(0 3px 6px #00000010)', borderRadius: '8px', background: authToken ? 'var(--color-background-papercolor)' : 'var(--color-background-lightcolor)', border: authToken ? 'none' : '1px solid var(--color-border-light)' }}
    >
      <Typography sx={{ textAlign: 'center', width: '100%', padding: '10px 16px' }}>
        To view and add descriptions you need to authenticate your account: <SignInLink setAuth={setAuth} />
      </Typography>
    </Paper >
  )
}
