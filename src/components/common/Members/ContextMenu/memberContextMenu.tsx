import ContextMenu from '@/components/common/ContextMenu'
import { EditOwnerDialog } from '@/components/settings/owner/EditOwnerDialog'
import { RemoveOwnerDialog } from '@/components/settings/owner/RemoveOwnerDialog'
import { ReplaceOwnerDialog } from '@/components/settings/owner/ReplaceOwnerDialog'
import useAddressBookByChain from '@/hooks/useAddressBookByChain'
import useSafeInfo from '@/hooks/useSafeInfo'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import IconButton from '@mui/material/IconButton'
import type { MouseEvent } from 'react'
import { useState, type ReactElement } from 'react'

const MemberContextMenu = ({
  member,
}: {
  member: any
}): ReactElement => {
  const addressBook = useAddressBookByChain()
  const { safe } = useSafeInfo()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>()
  const name = addressBook[member.value]

  const handleOpenContextMenu = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    setAnchorEl(e.currentTarget)
  }

  const handleCloseContextMenu = () => {
    setAnchorEl(undefined)
  }


  return (
    <>
      <IconButton edge="end" size="small" onClick={handleOpenContextMenu}>
        <MoreHorizIcon sx={({ palette }) => ({ color: palette.border.main })} />
      </IconButton>
      <ContextMenu anchorEl={anchorEl} open={!!anchorEl} onClose={handleCloseContextMenu}>
        <ReplaceOwnerDialog address={member.value} />
        <EditOwnerDialog address={member.value} name={name} chainId={safe.chainId} />
        <RemoveOwnerDialog owner={{ address: member.value, name }} />
      </ContextMenu>
    </>
  )
}

export default MemberContextMenu
