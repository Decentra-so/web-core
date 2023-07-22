import { useAllOwnedSafes } from "@/hooks/useAllOwnedSafes"
import useSafeAddress from "@/hooks/useSafeAddress"
import useWallet from "@/hooks/wallets/useWallet"
import { Box, Button, Tab, Tabs, Toolbar, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import useConnectWallet from "../common/ConnectWallet/useConnectWallet"
import FormattedName from "../common/FormattedName/FormattedName"
import FolderList from "../folder-list"
import FolderGroup from "../folder-list/folderGroups"
import ModalListContextMenu from "./ModalListContextMenu"
import css from './styles.module.css'

interface TabPanelProps {
	children?: React.ReactNode
	index: number
	value: number
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	)
}

//wtf is this lol
function a11yProps(index: number) {
	return {
		id: `safe-tab-${index}`,
		'aria-controls': `safe-tabpanel-${index}`,
	}
}

export const SafeList: React.FC<{ createSafe: boolean, setCreateSafe: any }> = ({ createSafe, setCreateSafe }) => {
	//user and safe
	const wallet = useWallet()
	const safeAddress = useSafeAddress()
	const [value, setValue] = useState(0)
	const handleConnect = useConnectWallet()
	const allOwnedSafes = useAllOwnedSafes()
	const [folders, setFolders] = useState([])
	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue)
		localStorage.setItem('tabIndex', newValue.toString())
	}

	function areAllValuesEmptyArrays(map: Map<number, any[]>): boolean {
		if (map?.size) {
			for (const value of map.values()) {
				if (!Array.isArray(value) || value.length !== 0) {
					return false;
				}
			}
		}
		return true;
	}

	useEffect(() => {
 		setValue(+localStorage?.getItem('tabIndex')!)
 	}, [value])
	
	useEffect(() => {
		const activeFolders = async () => {
			const items = JSON.parse(localStorage.getItem('folders')!)
			if (items) {
				setFolders(items)
			}
		}
		activeFolders()
		window.addEventListener('storage', activeFolders)
		return () => {
			window.removeEventListener('storage', activeFolders)
		}
	}, [])

	return (
		<>
			<Toolbar sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px 24px' }}>
				<Box>
					<Typography sx={{ color: '#757575', fontSize: 12, fontWeight: 600 }}>VIEW AS:</Typography>
					{wallet?.address ? <FormattedName address={wallet?.address} weight={600} /> : <Typography fontWeight={600}>Not connected</Typography>}
				</Box>
				<ModalListContextMenu createSafe={createSafe} setCreateSafe={setCreateSafe} />
			</Toolbar>
			<Box sx={{ width: '100%', height: '100%' }}>
				<Tabs
					variant="scrollable"
					scrollButtons='auto'
					allowScrollButtonsMobile
					TabScrollButtonProps={{ sx: { margin: 0, padding: 0, width: '20px' } }}
					sx={{ padding: 0, borderBottom: '1px solid var(--color-border-light)' }}
					value={value}
					onChange={handleChange}
					aria-label="folder tabs">
					<Tab className={css.tab} label="All" {...a11yProps(0)} />
					{folders.map((folder, i) => {
						return <Tab className={css.tab} label={folder} key={`${folder}-${i}`} />
					})}
				</Tabs>
				<TabPanel value={value} index={0}>
					{wallet?.address && <FolderList />}
				</TabPanel>
				{
					folders?.map((folder, i) => {
						return (
							<TabPanel value={value} index={i + 1} key={`tab-${folder}-${i}`}>
								<FolderGroup group={folder} currentSafe={safeAddress} />
							</TabPanel>
						)
					})
				}
				{
					wallet?.address && !areAllValuesEmptyArrays(allOwnedSafes) ?
						<></>
						: wallet?.address && areAllValuesEmptyArrays(allOwnedSafes) ?
							<Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
								<Button onClick={() => setCreateSafe(!createSafe)} variant="contained" disableElevation>
									Create Safe
								</Button>
							</Box> :
							<Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
								<Button onClick={handleConnect} variant="contained" disableElevation>
									Connect wallet
								</Button>
							</Box>
				}
			</Box >
		</>
	)
}
