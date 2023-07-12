import ContextMenu from '@/components/common/ContextMenu'
import AddIcon from '@/public/images/common/add.svg'
import AddChatIcon from '@/public/images/chat/add-chat-icon.svg'
import { SvgIcon } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import type { MouseEvent } from 'react'
import { useState } from 'react'
import { AddFolderModal } from './modals/AddFolderModal'

enum ModalType {
	ADDFOLDER = 'Add Folder',
	ADDSAFE = 'Add Safe',
}

const ModalListContextMenu: React.FC<{ createSafe: boolean, setCreateSafe: any }> = ({ createSafe, setCreateSafe }) => {
	const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>()
	const [addFolder, setAddFolder] = useState<boolean>(false)

	const handleOpenContextMenu = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
		setAnchorEl(e.currentTarget)
	}

	const handleCloseContextMenu = () => {
		setAnchorEl(undefined)
	}

	return (
		<>
			{addFolder && <AddFolderModal open={addFolder} onClose={() => setAddFolder(!addFolder)} />}
			<IconButton
				sx={{ border: '1px solid var(--color-border-light)', borderRadius: '6px', padding: '7px', width: '32px', height: '32px' }}
				aria-label="open context menu"
				onClick={handleOpenContextMenu}
			>
				<SvgIcon component={AddChatIcon} inheritViewBox fontSize="small" color="inherit" />
			</IconButton>
			<ContextMenu anchorEl={anchorEl} open={!!anchorEl} onClose={handleCloseContextMenu}>
				<MenuItem
					onClick={() => setAddFolder(!addFolder)}
				>
					<ListItemIcon>
						<SvgIcon component={AddIcon} inheritViewBox fontSize="small" color="primary" />
					</ListItemIcon>
					<ListItemText>{ModalType.ADDFOLDER}</ListItemText>
				</MenuItem>
				<MenuItem
					onClick={() => setCreateSafe(!createSafe)}
				>
					<ListItemIcon>
						<SvgIcon component={AddIcon} inheritViewBox fontSize="small" color="primary" />
					</ListItemIcon>
					<ListItemText>{ModalType.ADDSAFE}</ListItemText>
				</MenuItem>
			</ContextMenu>
		</>
	)
}

export default ModalListContextMenu
