import ellipsisAddress from "@/utils/ellipsisAddress"
import { ListItem, ListItemAvatar, ListItemText } from "@mui/material"
import { useEnsName } from "wagmi"
import Identicon from "../Identicon"

const Member: React.FC<{ member: any }> = ({ member }) => {
	const { data, isError, isLoading } = useEnsName({
		address: member.value,
	})
	return (
		<ListItem key={member.value}>
			<ListItemAvatar sx={{ minWidth: 35 }}>
				<Identicon address={member.value} size={24} />
			</ListItemAvatar>
			<ListItemText primary={isLoading || isError || !data ? ellipsisAddress(`${member.value}`) : data} />
		</ListItem>
	)
}

export default Member