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
		<ListItemAvatar sx={{ minWidth: 32, pr: '16px', borderRadius: '12px' }}>
			<Identicon address={chat?.data?.sender.uid || data} size={32} />
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
					{chat.data.sender.name === wallet?.address ? <Typography sx={{ display: 'inline', pr: '12px', fontWeight: 600, fontSize: '15px' }} component="span">You</Typography> : <FormattedName address={chat?.data?.sender.uid} weight={600} size={'15px'} />}
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
		</Box>	
	</ListItem>
}

export default ChatMessage
