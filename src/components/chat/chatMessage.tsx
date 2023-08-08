import type { ConnectedWallet } from "@/services/onboard"
import { ListItem, ListItemAvatar, ListItemText, Typography, Box } from "@mui/material"
import React from 'react'
import { useEnsName } from "wagmi"
import FormattedName from "../common/FormattedName/FormattedName"
import Identicon from "../common/Identicon"
import { getDateFromTimestamp } from "@/utils/time"

const ChatMessage: React.FC<{ chat: any, wallet: ConnectedWallet | null }> = ({ chat, wallet }) => {
	const { data, isError, isLoading } = useEnsName({
		address: chat?.sender.uid,
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
		<ListItemAvatar sx={{ minWidth: 32, pr: '16px', borderRadius: '12px' }}>
			<Identicon address={chat?.sender.uid || data} size={32} />
		</ListItemAvatar>
		<Box sx={{ display: 'flex', filter: 'drop-shadow(0px 1px 1px #00000010)' }}>
		<Box sx={{ borderTop: '11px solid var(--color-background-papercolor)', borderLeft: '7px solid transparent', marginTop: '6px', borderRadius: '3px 0px 0px 0px' }} />	
		<ListItemText
			sx={{
			background: 'var(--color-background-papercolor)',
                        padding: '8px 12px',
                        borderRadius: '0 12px 12px 12px',
		        }}
			primary={
				<React.Fragment>
					<Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
					{chat?.sender?.name === wallet?.address ? <Typography sx={{ display: 'inline', fontWeight: 600, fontSize: '15px' }} component="span">You</Typography> : <FormattedName address={chat?.data?.sender?.uid} weight={600} size={'15px'} />}
					<Typography sx={{ display: 'inline', color: '#757575', ml: '10px', fontSize: '12px' }} component="span">
						{getDateFromTimestamp(chat.sentAt)}
					</Typography>
					</Box>	
				</React.Fragment>
			}
			secondary={
				<Typography sx={{ display: 'inline' }} component="span">
					{chat.text}
				</Typography>
			}
		/>
		</Box>	
	</ListItem>
}

export default ChatMessage
