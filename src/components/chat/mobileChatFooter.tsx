import { AppRoutes } from "@/config/routes";
import useSafeInfo from "@/hooks/useSafeInfo";
import ChatIcon from '@/public/images/chat/chat-bubble-svgrepo-com.svg'
import MenuBookIcon from '@/public/images/chat/book-svgrepo-com.svg'
import WalletIcon from '@/public/images/chat/wallet-svgrepo-com.svg'
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
				<Link href={{ pathname: path }} key={`${safe}`} passHref>
					<Button onClick={() => setSelectedButton(path)} startIcon={path === AppRoutes.wallet ? <WalletIcon /> : path === AppRoutes.safeList ? <ChatIcon /> : <MenuBookIcon />} className={router.pathname.startsWith(path) ? css.ButtonNavSelected : css.ButtonNav} size='small'>{path === AppRoutes.wallet ? 'Wallet' : path === AppRoutes.safeList ? 'Chat' : 'Address book'}</Button>
				</Link>
			)}
		</Box>
	)
}

export default MobileChatFooter
