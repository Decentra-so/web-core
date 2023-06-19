import type { ConnectedWallet } from "@/services/onboard"
import { Avatar, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material"
import React from 'react'
import { useEnsName } from "wagmi"

const ChatMessage: React.FC<{ chat: any, wallet: ConnectedWallet | null }> = ({ chat, wallet }) => {
	const { data, isError, isLoading } = useEnsName({
		address: chat?.data?.sender.uid,
	})
	return <ListItem
		sx={{
			display: 'flex',
			alignItems: 'start',
			p: 0,
			width: 'fit-content',
			margin: '8px 0',
		}}
		alignItems="flex-start"
	>
		<ListItemAvatar sx={{ minWidth: 32, pr: '16px' }}>
			<Avatar sx={{ width: 32, height: 32 }} alt={chat?.data?.sender.uid || data} />
		</ListItemAvatar>
		<ListItemText
			primary={
				<React.Fragment>
					<Typography sx={{ display: 'inline', pr: '12px', fontWeight: 600 }} component="span">
						{chat.data.sender.name === wallet?.address ? 'You' : isLoading || isError || !data ? chat?.data?.sender.uid : data}
					</Typography>
					<Typography sx={{ display: 'inline' }} component="span" variant="body2">
						{chat.timeStamp}
					</Typography>
				</React.Fragment>
			}
			secondary={
				<Typography sx={{ display: 'inline' }} component="span">
					{chat.data.text}
				</Typography>
			}
		/>
	</ListItem>
}

export default ChatMessage