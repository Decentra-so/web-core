import type { ConnectedWallet } from "@/services/onboard"
import { ListItem, ListItemAvatar, ListItemText, Typography, Box } from "@mui/material"
import React from 'react'
import { useEnsName } from "wagmi"
import FormattedName from "../common/FormattedName/FormattedName"
import Identicon from "../common/Identicon"
import { getDateFromTimestamp } from "@/utils/time"

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
				<Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', mb: '5px'}}>
					<FormattedName address={chat?.data?.sender.uid} weight={600} size={'18px'} />
					<Typography sx={{ display: 'inline', color: 'gray', ml: '10px', mt: '4px' }} component="span" variant="body2">
						{getDateFromTimestamp(chat.data.sentAt)}
					</Typography>
				</Box>
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