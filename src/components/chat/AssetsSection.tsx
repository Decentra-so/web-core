import css from '@/components/chat/styles.module.css';
import { useAppDispatch } from '@/store';
import { openModal } from '@/store/modalServiceSlice';
import { Box, Button, Typography } from "@mui/material";
import { modalTypes } from './modals';

const AssetsSection = () => {
	const dispatch = useAppDispatch()
	return (
		<Box sx={{ p: 3 }}>
			<Typography sx={{ fontWeight: 600 }} paragraph>
				Assets
			</Typography>
			<Typography paragraph>View all tokens and NFTs the Safe holds.</Typography>
			{/* <Link href={{ pathname: AppRoutes.balances.index, query: { safe: `${safeAddress}` } }} key={`${safe}`} passHref> */}
			<Button
				variant="outlined"
				className={css.buttonstyled}
				onClick={() => dispatch(openModal({ modalName: modalTypes.assetsModals, modalProps: { nfts: false } }))}
				size="small"
			>
				View Assets
			</Button>
			{/* </Link> */}
		</Box>
	)
}

export default AssetsSection