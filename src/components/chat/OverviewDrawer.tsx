import css from '@/components/chat/styles.module.css';
import AppsIcon from '@/public/images/apps/apps-icon.svg';
import NftIcon from '@/public/images/common/nft.svg';
import AssetsIcon from '@/public/images/sidebar/assets.svg';
import { useAppDispatch } from '@/store';
import { openModal } from '@/store/modalServiceSlice';
import MoreAppsIcon from '@mui/icons-material/Apps';
import HistoryIcon from '@mui/icons-material/History';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import ListIcon from '@mui/icons-material/List';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PeopleIcon from '@mui/icons-material/People';
import { Box, Button, Divider, List, ListItem, ListItemButton, ListItemIcon, Stack, SvgIcon } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import type { CSSObject, Theme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { modalTypes } from './modals';
import OverviewDisplay from './OverviewDisplay';

const drawerWidth = 450;

export enum Pages {
	Overview = 'Overview',
	Members = 'Members',
	TransactionQueue = 'TransactionQueue',
	TransactionHistory = 'TransactionHistory',
	Assets = 'Assets',
	Apps = 'Apps'
}

const pages = [
	{
		name: Pages.Overview,
		icon: AppsIcon
	},
	{
		name: Pages.Members,
		icon: PeopleIcon
	},
	{
		name: Pages.TransactionQueue,
		icon: ListIcon
	},
	{
		name: Pages.TransactionHistory,
		icon: HistoryIcon
	},
	{
		name: Pages.Assets,
		icon: MonetizationOnIcon
	},
	{
		name: Pages.Apps,
		icon: MoreAppsIcon
	}
]

const openedMixin = (theme: Theme): CSSObject => ({
	width: drawerWidth,
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: 'hidden',
	overflowY: 'hidden',
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up('sm')]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
})

const DrawerFooter = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
	({ theme, open }) => ({
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: 'nowrap',
		boxSizing: 'border-box',
		...(open && {
			...openedMixin(theme),
			'& .MuiDrawer-paper': openedMixin(theme),
		}),
		...(!open && {
			...closedMixin(theme),
			'& .MuiDrawer-paper': closedMixin(theme),
		}),
	}),
)

const OverviewDrawer: React.FC<{
	owners: any[]
}> = ({ owners }) => {
	const [open, setOpen] = React.useState(false)
	const [selectedPage, setSelectedPage] = React.useState(Pages.Overview)
	const dispatch = useAppDispatch()
	const handleDrawerOpen = () => {
		setOpen(true)
	};

	const handleSelectedPage = (name: Pages) => {
		handleDrawerOpen()
		setSelectedPage(name)
	}

	const handleDrawerClose = () => {
		setOpen(false)
	};

	return (
		<Drawer
			variant="permanent"
			open={open}
			anchor='right'
			sx={{
				'& .MuiDrawer-paper': {
					bgcolor: 'var(--color-background-papercolor)',
					boxSizing: 'border-box',
					height: 'calc(100vh - var(--header-height) - 24px)',
					top: 'var(--header-height)',
					margin: '12px 0',
					filter: 'drop-shadow(0 3px 6px #00000010)',
					borderRadius: '10px 0 0 10px',
					border: '0px',
				},
			}}
		>
			<Stack
				direction="row"
				divider={<Divider orientation="vertical" flexItem sx={{ marginRight: 2 }} />}
			>
				<Box>
					<List>
						{pages.map((page, index) => (
							<ListItem key={page.name} disablePadding sx={{ display: 'block', padding: 1.5 }}>
								<ListItemButton
									selected={selectedPage === page.name}
									onClick={() => handleSelectedPage(page.name)}
									sx={{
										minHeight: 48,
										justifyContent: open ? 'initial' : 'center',
										px: 2,
										borderRadius: 1.2
									}}
								>
									<ListItemIcon
										sx={{
											minWidth: 0,
											justifyContent: 'center',
										}}
									>
										<SvgIcon component={page.icon} inheritViewBox />
									</ListItemIcon>
								</ListItemButton>
							</ListItem>
						))}
					</List>
					<DrawerFooter>
						<IconButton onClick={!open ? handleDrawerOpen : handleDrawerClose}>
							{open ? <KeyboardDoubleArrowRightIcon /> : <KeyboardDoubleArrowLeftIcon />}
						</IconButton>
					</DrawerFooter>
				</Box>
				<Box height='calc(100vh - var(--header-height) - 24px)' width='100%' display='flex' flexDirection='column' justifyContent='space-between'>
					<OverviewDisplay page={selectedPage} owners={owners} />
					<Box
						sx={{
							position: 'sticky',
							bottom: 0,
							p: 2,
							pl: 3,
							pr: 3,
							display: 'flex',
							flexDirection: 'column',
							gap: 2,
							bgcolor: 'var(--color-background-papercolor)',
							borderTop: '1px solid var(--color-border-light)',
						}}
					>
						{/* <Link href={{ pathname: AppRoutes.balances.index, query: { safe: `${safeAddress}` } }} key={`${safe}`} passHref> */}
						<Button
							variant="outlined"
							className={css.buttonstyled}
							onClick={() => dispatch(openModal({ modalName: modalTypes.tokenTransferModal, modalProps: '' }))}
							startIcon={<SvgIcon component={AssetsIcon} inheritViewBox />}
							fullWidth
						>
							Send tokens
						</Button>
						{/* </Link> */}
						<Button
							variant="outlined"
							className={css.buttonstyled}
							startIcon={<SvgIcon component={NftIcon} inheritViewBox />}
							onClick={() => dispatch(openModal({ modalName: modalTypes.assetsModals, modalProps: { nfts: true } }))}
							fullWidth
						>
							Send NFTs
						</Button>
					</Box>
				</Box>
			</Stack>
		</Drawer>
	);
}

export default OverviewDrawer