import useSafeAddress from "@/hooks/useSafeAddress";
import { sendMessage } from "@/services/chat";
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { Button, Divider, InputBase, Paper, Box, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import React, { useState } from "react";
import AddNewTxLightningIconButton from "./AddNewTxLightningIconButton";
import SignInLink from "../auth-sign-in/auth-link";
import { publish } from "@/services/events";
import { getCookie } from "typescript-cookie";
import useWallet from "@/hooks/wallets/useWallet";

const CustomInput = styled(InputBase)(({ theme }) => ({
	'& .MuiInputBase-input': {
		fontSize: 16,
		width: '100%',
		padding: '10px 16px',
	},
}));

const ChatTextField: React.FC<{
	setMessages: any,
	authToken: string
	setAuth: any
}> = ({ setMessages, authToken, setAuth }) => {
	const safeAddress = useSafeAddress()
	const [message, setMessage] = useState<string>('')
	const wallet = useWallet()
  const authCookie = getCookie(wallet?.address || '')
	//get and listen for message updates

	const handleSubmit = async (e: any) => {
		e.preventDefault()
		publish('sendChatMessage', { message, safeAddress })
		if (!message) return
		await sendMessage(`pid_${safeAddress}`, message)
			.then(async (msg: any) => {
				setMessages(msg)
				setMessage('')
			})
			.catch((error: any) => {
				console.log(error)
			})
	}

	return (
		<Paper
			component="form"
			sx={{ p: '4px 8.5px 4px 4px', display: 'flex', alignItems: 'center', width: '100%', filter: 'drop-shadow(0 3px 6px #00000010)', borderRadius: '8px', background: authToken ? 'var(--color-background-papercolor)' : 'var(--color-background-lightcolor)', border: authToken ? 'none' : '1px solid var(--color-border-light)' }}
			onSubmit={handleSubmit}
		>
			<Box sx={{ margin: '0 6px' }}>
			  <AddNewTxLightningIconButton />
			</Box>
			<Divider orientation="vertical" variant="middle" flexItem />
			{
				authToken && authCookie ? (
					<>
						<CustomInput
							sx={{ flex: 1 }}
							value={message}
							placeholder="Type something..."
							inputProps={{ 'aria-label': 'chat message' }}
							onChange={(e) => setMessage(e.target.value)}
						/>
						<Button variant="contained" type="submit" sx={{ p: '5px', minWidth: 0, borderRadius: '8px', color: 'white', backgroundColor: '#FE7E51', '&:hover': { backgroundColor: '#e57049' } }} aria-label="send">
							<SendOutlinedIcon />
						</Button>
					</>
				) : (
					<Typography sx={{ textAlign: 'center', width: '100%', padding: '10px 16px' }}>
						To view and send messages you need to authenticate your account: <SignInLink setAuth={setAuth}/>
					</Typography>
				)
			}

		</Paper >
	)
}

export default ChatTextField
