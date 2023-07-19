import CopyButton from '@/components/common/CopyButton'
import { useCurrentChain } from "@/hooks/useChains"
import CopyIcon from '@/public/images/common/copy.svg'
import LinkIcon from '@/public/images/common/link.svg'
import { getBlockExplorerLink } from "@/utils/chains"
import { IconButton, ListItem, ListItemAvatar, ListItemText, SvgIcon, Tooltip, useMediaQuery } from "@mui/material"
import { useState } from 'react'
import FormattedName from "../FormattedName/FormattedName"
import Identicon from "../Identicon"
import MemberContextMenu from './ContextMenu/memberContextMenu'
import css from './styles.module.css'

const Member: React.FC<{ member: any }> = ({ member }) => {
	const chain = useCurrentChain()
	const matches = useMediaQuery('(max-width: 600px)')
	const blockExplorerLink = chain ? getBlockExplorerLink(chain, member.value) : undefined
	const [activeMember, setActiveMember] = useState<string>()

	const handleMouseEnter = (member: string) => {
		setActiveMember(member)
	};
	const handleMouseLeave = () => {
		setActiveMember(undefined)
	};
	return (
		<ListItem key={member.value} onMouseOver={(e) => handleMouseEnter(member.value)} onMouseLeave={handleMouseLeave}>
			<ListItemAvatar sx={{ minWidth: 35, flexShrink: 1 }}>
				<Identicon address={member.value} size={24} />
			</ListItemAvatar>
			<ListItemText sx={{ minWidth: 5 }} primary={<FormattedName address={member.value} weight={500} showAddress />} />
			<div className={css.iconButtons}>
				<CopyButton text={member.value} className={css.iconButton}>
					<SvgIcon component={CopyIcon} inheritViewBox fontSize="small" />
				</CopyButton>
				<Tooltip title={blockExplorerLink?.title || ''} placement="top">
					<IconButton
						className={css.iconButton}
						target="_blank"
						rel="noreferrer"
						href={blockExplorerLink?.href || ''}
					>
						<SvgIcon component={LinkIcon} inheritViewBox fontSize="small" />
					</IconButton>
				</Tooltip>
				{((activeMember === member.value) || matches) && <MemberContextMenu member={member} />}
			</div>
		</ListItem>
	)
}

export default Member