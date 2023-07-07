import { AppRoutes } from "@/config/routes"
import useSafeInfo from "@/hooks/useSafeInfo"
import { useAppSelector } from "@/store"
import { selectAllAddressBooks } from "@/store/addressBookSlice"
import { selectSafe, setSelectedSafe } from "@/store/chatServiceSlice"
import styled from "@emotion/styled"
import { ListItem, ListItemAvatar, ListItemButton, ListItemText, useMediaQuery } from "@mui/material"
import Link from "next/link"
import { useState } from "react"
import { useDispatch } from "react-redux"
import FormattedName from "../common/FormattedName/FormattedName"
import Identicon from "../common/Identicon"
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

const SafeDisplay: React.FC<{ safe: string, index: number, chainId: string }> = ({ safe, index, chainId }) => {
	const dispatch = useDispatch()
	const { safeAddress } = useSafeInfo()
	const allAddressBooks = useAppSelector(selectAllAddressBooks)
	const name = allAddressBooks[chainId]?.[safe]
	const matches = useMediaQuery('(max-width: 600px)')
	const [activeSafe, setActiveSafe] = useState<string>();
	const selectedSafe = useAppSelector((state) => selectSafe(state))

	const matchSafe = (safe: string) => {
		return safe.slice(safe.lastIndexOf(':') + 1) === safeAddress
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
		<CustomListItem selected={matchSafe(safe)} onMouseOver={(e) => handleMouseEnter(safe)} onMouseLeave={handleMouseLeave}>
			<Link href={{ pathname: AppRoutes.chat, query: { safe: `${safe}` } }} key={`${safe}-${index}`} passHref>
				<ListItemButton
					key={`safe-${index}`}
					onClick={(e) => handleClick(safe)}
					sx={{
						padding: '2px 8px', height: '70px',
						"&:hover": {
							backgroundColor: "transparent"
						}
					}}
					disableRipple
				>
					<ListItemAvatar>
						<Identicon address={safe.slice(safe.lastIndexOf(':') + 1)} radius={6} size={32} />
					</ListItemAvatar>
					<ListItemText
						primary={
							<FormattedName address={safe} weight={500} />
						}
					/>
				</ListItemButton>
			</Link>
			{(activeSafe === safe || selectedSafe === safe || matches) && <FolderListContextMenu address={safe} name={name} chainId={chainId} />}
		</CustomListItem>
	)
}

export default SafeDisplay