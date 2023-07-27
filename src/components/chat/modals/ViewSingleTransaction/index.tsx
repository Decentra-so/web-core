import ModalDialog from "@/components/common/ModalDialog"
import { DialogContent } from "@mui/material"
import SingleTransaction from "@/pages/transactions/tx";

export const ViewSingleTransactionModal: React.FC<{
	open: boolean
	onClose: () => void
}> = ({ open, onClose }) => {
	return (
		<ModalDialog open={open} dialogTitle="View Transaction" onClose={onClose} maxWidth="lg">
			<DialogContent>
				<SingleTransaction />
			</DialogContent>
		</ModalDialog>
	)
}