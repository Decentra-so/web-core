import SignIn from "@/components/auth-sign-in/auth"
import ModalDialog from "@/components/common/ModalDialog"
import { DialogContent } from "@mui/material"

export const AuthModal: React.FC<{
	open: boolean
	onClose: () => void
	setAuthToken: any
}> = ({ open, onClose, setAuthToken }) => {
	return (
		<ModalDialog open={open} dialogTitle="Sign in with Ethereum" onClose={onClose}>
			<DialogContent>
				<SignIn onClose={onClose} setAuthToken={setAuthToken} />
			</DialogContent>
		</ModalDialog>
	)
}