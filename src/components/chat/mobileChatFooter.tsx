import { AppRoutes } from "@/config/routes";
import useSafeInfo from "@/hooks/useSafeInfo";
import ChatIcon from '@mui/icons-material/Chat';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import WalletIcon from '@mui/icons-material/Wallet';
import { Box, Button } from "@mui/material";
import classnames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import css from './styles.module.css';

const buttonPages = [
	AppRoutes.wallet,
	AppRoutes.safeList,
	AppRoutes.addressBook
];

const MobileChatFooter = () => {
	const [selectedButton, setSelectedButton] = useState(AppRoutes.chat)
	const { safe, safeAddress } = useSafeInfo()
	const router = useRouter()

	return (
		<Box display='flex' alignItems='center' justifyContent='space-between' className={classnames(css.mobileBtnGroup, css.hideDesktop)}>
			{buttonPages.map(path =>
				<Link href={{ pathname: path }} passHref>
					<Button onClick={() => setSelectedButton(path)} startIcon={path === AppRoutes.wallet ? <WalletIcon /> : path === AppRoutes.safeList ? <ChatIcon /> : <MenuBookIcon />} className={router.pathname.startsWith(path) ? css.ButtonNavSelected : css.ButtonNav} size='small'>{path === AppRoutes.wallet ? 'Wallet' : path === AppRoutes.safeList ? 'Chat' : 'Address book'}</Button>
				</Link>
			)}
		</Box>
	)
}

export default MobileChatFooter
