import ModalDialog from "@/components/common/ModalDialog"
import { Button, DialogContent } from "@mui/material"
import SingleTransaction from "@/pages/transactions/tx";
import { useDispatch } from "react-redux";
import { openModal } from "@/store/modalServiceSlice";
import { modalTypes } from "@/components/chat/modals";

export const ViewSingleTransactionModal: React.FC<{
	open: boolean
	onClose: () => void
}> = ({ open, onClose }) => {
	const dispatch = useDispatch()

	return (
		<ModalDialog open={open} dialogTitle="View Transaction" onClose={onClose} maxWidth="lg">
			<DialogContent>
				<SingleTransaction />
				<Button onClick={() => dispatch(openModal({ modalName: modalTypes.transactionMessages, modalProps: '' }))}>
					Chat
				</Button>
			</DialogContent>
		</ModalDialog>
	)
}