import { ListItem, ListItemAvatar, ListItemText } from "@mui/material"
import FormattedName from "../FormattedName/FormattedName"
import Identicon from "../Identicon"

const Member: React.FC<{ member: any }> = ({ member }) => {
	return (
		<ListItem key={member.value}>
			<ListItemAvatar sx={{ minWidth: 35 }}>
				<Identicon address={member.value} size={24} />
			</ListItemAvatar>
			<ListItemText primary={<FormattedName address={member.value} weight={500} />} />
		</ListItem>
	)
}

export default Member