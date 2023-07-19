import type { ConnectedWallet } from "@/services/onboard"
import { ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material"
import React from 'react'
import { useEnsName } from "wagmi"
import FormattedName from "../common/FormattedName/FormattedName"
import Identicon from "../common/Identicon"

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
			<Identicon address={chat?.data?.sender.uid || data} size={32} />
		</ListItemAvatar>
		<ListItemText
			primary={
				<React.Fragment>
					{chat.data.sender.name === wallet?.address ? <Typography sx={{ display: 'inline', pr: '12px', fontWeight: 600 }} component="span">You</Typography> : <FormattedName address={chat?.data?.sender.uid} weight={600}  />}
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