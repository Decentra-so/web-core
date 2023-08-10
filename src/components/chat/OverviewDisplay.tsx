import useSafeInfo from "@/hooks/useSafeInfo";
import { Box } from "@mui/material";
import Members from "../common/Members";
import TransactionHistory from "../common/TransactionHistory";
import TransactionQueue from "../common/TransactionQueue";
import AppsSection from "./AppsSection";
import AssetsSection from "./AssetsSection";
import type { Pages } from "./OverviewDrawer";
import OverviewSection from "./OverviewSection";

const OverviewDisplay = ({ page, owners }: { page: Pages, owners: any[] }) => {
	const { safe, safeAddress } = useSafeInfo()
	const currentView = {
		Overview: <OverviewSection />,
		Members: <Members members={owners} />,
		TransactionQueue: <TransactionQueue key={safeAddress} />,
		TransactionHistory: <TransactionHistory />,
		Assets: <AssetsSection />,
		Apps: <AppsSection />
	}[page]

	return <Box>{currentView}</Box>
}

export default OverviewDisplay