import ellipsisAddress from "@/utils/ellipsisAddress"
import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material"
import { useEnsName } from "wagmi"

const Member: React.FC<{ member: any }> = ({ member }) => {
	const { data, isError, isLoading } = useEnsName({
		address: member.value,
	})
	return (
		<ListItem key={member.value}>
			<ListItemAvatar sx={{ minWidth: 35 }}>
				<Avatar sx={{ width: 24, height: 24 }} alt={member.value} />
			</ListItemAvatar>
			<ListItemText primary={isLoading || isError || !data ? ellipsisAddress(`${member.value}`) : data} />
		</ListItem>
	)
}

export default Member