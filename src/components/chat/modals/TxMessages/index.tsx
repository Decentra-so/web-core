import ModalDialog from "@/components/common/ModalDialog"
import { DialogContent } from "@mui/material"

export const ViewTxMessages: React.FC<{
	open: boolean
	onClose: () => void
}> = ({ open, onClose }) => {
	return (
		<ModalDialog open={open} dialogTitle="View Transaction Messages" onClose={onClose} maxWidth="lg">
			<DialogContent>
        Messages
			</DialogContent>
		</ModalDialog>
	)
}