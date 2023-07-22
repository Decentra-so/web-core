import { AppRoutes } from "@/config/routes"
import useSafeInfo from "@/hooks/useSafeInfo"
import { useAppSelector } from "@/store"
import { selectSafe, setSelectedSafe } from "@/store/chatServiceSlice"
import type { Folder } from "@/types/folder"
import styled from "@emotion/styled"
import { ListItem, ListItemAvatar, ListItemButton, ListItemText, useMediaQuery } from "@mui/material"
import Link from "next/link"
import { useState } from "react"
import { useDispatch } from "react-redux"
import BadgeAvatar from "../badge-avatar"
import FormattedName from "../common/FormattedName/FormattedName"
import FolderListContextMenu from "./folderItemContextItem"


const CustomListItem = styled(ListItem)(({ theme }) => ({
	height: '70px',
	borderBottom: '1px solid var(--color-border-light)',

	'&&.Mui-selected': {
		backgroundColor: 'var(--color-background-papercolor)',
		borderLeft: '4px solid #FE7E51',
		paddingLeft: '12px'
	},
	'&&:hover': {
		backgroundColor: 'var(--color-background-papercolor)'
	},
}))

const SafeDisplay: React.FC<{ safe: Folder, index: number }> = ({ safe, index }) => {
	const dispatch = useDispatch()
	const { safeAddress, } = useSafeInfo()
	const matches = useMediaQuery('(max-width: 600px)')
	const [activeSafe, setActiveSafe] = useState<string>();
	const selectedSafe = useAppSelector((state) => selectSafe(state))

	const matchSafe = (address: string) => {
		return address?.slice(address?.lastIndexOf(':') + 1) === safeAddress
	}
	const handleMouseEnter = (safe: string) => {
		setActiveSafe(safe)
	};
	const handleMouseLeave = () => {
		setActiveSafe(undefined)
	};
	const handleClick = (safe: string) => {
		dispatch(setSelectedSafe({ selectedSafe: safe }))
	}
	return (
		<CustomListItem selected={matchSafe(safe.address)} onMouseOver={(e) => handleMouseEnter(safe.address)} onMouseLeave={handleMouseLeave}>
			<Link href={{ pathname: AppRoutes.chat, query: { safe: `${safe.address}` } }} key={`${safe.address}-${index}`} passHref>
				<ListItemButton
					key={`safe-${index}`}
					onClick={(e) => handleClick(safe.address)}
					sx={{
						padding: '2px 8px', height: '70px',
						"&:hover": {
							backgroundColor: "transparent"
						}
					}}
					disableRipple
				>
					<ListItemAvatar>
						<BadgeAvatar safe={safe.address} chainId={safe.chainId} />
					</ListItemAvatar>
					<ListItemText
						sx={{ overflow: 'auto', whiteSpace: 'nowrap' }}
						primary={
							<FormattedName address={safe.address} weight={500} />
						}
					/>
				</ListItemButton>
			</Link>
			{(activeSafe === safe.address || selectedSafe === safe.address || matches) && <FolderListContextMenu safeInfo={safe} />}
		</CustomListItem>
	)
}

export default SafeDisplay
