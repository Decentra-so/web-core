import useSafeAddress from "@/hooks/useSafeAddress";
import { getMessages, listenForMessage, sendMessage } from "@/services/chat";
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { Button, Divider, InputBase, Paper } from "@mui/material";
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from "react";
import AddNewTxIconButton from "./AddNewTxIconButton";

const CustomInput = styled(InputBase)(({ theme }) => ({
	'& .MuiInputBase-input': {
		borderRadius: 4,
		fontSize: 16,
		width: '100%',
		padding: '10px 12px',
	},
}));

const ChatTextField: React.FC<{ currentUser: any, messages: string[], setMessages: any }> = ({ currentUser, messages, setMessages }) => {
	const safeAddress = useSafeAddress()
	const [message, setMessage] = useState<string>('')

	//get and listen for message updates
	useEffect(() => {
		async function getM() {
			await getMessages(`pid_${safeAddress!}`)
				.then((msgs: any) => {
					setMessages(msgs)
				})
				.catch((error) => {
					setMessages([])
				})

			await listenForMessage(`pid_${safeAddress!}`)
				.then((msg: any) => {
					setMessages((prevState: any) => [...prevState, msg])
				})
				.catch((error) => console.log(error))
		}
		getM()
	}, [safeAddress, currentUser])

	const handleSubmit = async (e: any) => {
		e.preventDefault()
		if (!message) return
		await sendMessage(`pid_${safeAddress}`, message)
			.then(async (msg: any) => {
				setMessages(() => [...messages, msg])
				setMessage('')
			})
			.catch((error: any) => {
				console.log(error)
			})
	}

	return (
		<Paper
			component="form"
			sx={{
				p: '4px 8.5px 4px 4px', display: 'flex', alignItems: 'center', width: '100%', boxShadow: 'rgba(0, 0, 0, .05) 0px 0.5rem 1.5rem', borderRadius: '8px', background: 'var(--color-background-papercolor)'
			}}
			onSubmit={handleSubmit}
		>
			<AddNewTxIconButton />
			<Divider orientation="vertical" variant="middle" flexItem />
			<CustomInput
				sx={{ flex: 1 }}
				value={message}
				placeholder="Type something..."
				inputProps={{ 'aria-label': 'chat message' }}
				onChange={(e) => setMessage(e.target.value)}
			/>
			<Button variant="contained" type="submit" sx={{ p: '5px', minWidth: 0, borderRadius: '8px', backgroundColor: '#FE7E51', '&:hover': { backgroundColor: '#e57049' } }} aria-label="send">
				<SendOutlinedIcon />
			</Button>
		</Paper >
	)
}

export default ChatTextField
