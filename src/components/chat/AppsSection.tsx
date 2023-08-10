import css from '@/components/chat/styles.module.css'
import { useAppDispatch } from "@/store"
import { openModal } from "@/store/modalServiceSlice"
import { Box, Button, Typography } from "@mui/material"
import { modalTypes } from "./modals"

const AppsSection = () => {
	const dispatch = useAppDispatch()
	return (
		<Box sx={{ p: 3 }}>
			<Typography sx={{ fontWeight: 600 }} paragraph>
				Apps
			</Typography>
			<Typography paragraph whiteSpace="pre-line">
				Explore the Safe Apps ecosystem &mdash; connect to your favourite web3 applications with your Safe wallet,
				securely and efficiently
			</Typography>
			{/* <Link href={{ pathname: AppRoutes.apps.index, query: { safe: `${safeAddress}` } }} key={`${safe}`} passHref> */}
			<Button variant="outlined" className={css.buttonstyled} size="small" onClick={() => dispatch(openModal({ modalName: modalTypes.appsModal, modalProps: '' }))}>
				Explore Apps
			</Button>
			{/* </Link> */}
		</Box>
	)
}

export default AppsSection