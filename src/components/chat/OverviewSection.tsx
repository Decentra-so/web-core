import css from '@/components/chat/styles.module.css'
import { ThresholdOverview } from '@/components/chat/threshold'
import CopyButton from '@/components/common/CopyButton'
import QrCodeButton from '@/components/sidebar/QrCodeButton'
import { useCurrentChain } from '@/hooks/useChains'
import useSafeInfo from '@/hooks/useSafeInfo'
import AppsIcon from '@/public/images/apps/apps-icon.svg'
import CopyIcon from '@/public/images/common/copy.svg'
import LinkIcon from '@/public/images/common/link.svg'
import { useAppSelector } from '@/store'
import { selectSettings } from '@/store/settingsSlice'
import { getBlockExplorerLink } from '@/utils/chains'
import ellipsisAddress from '@/utils/ellipsisAddress'
import { Box, SvgIcon, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

const OverviewSection = () => {
	const { safe, safeAddress } = useSafeInfo()
	const ownerLength = safe?.owners?.length || 0
	const threshold = safe.threshold
	const settings = useAppSelector(selectSettings)
	const chain = useCurrentChain()
	const addressCopyText = settings.shortName.copy && chain ? `${chain.shortName}:${safeAddress}` : safeAddress
	const blockExplorerLink = chain ? getBlockExplorerLink(chain, safeAddress) : undefined
	return (
		<Box sx={{ p: 3 }}>
			<Typography sx={{ fontWeight: 600, mb: 3 }}>
				Overview
			</Typography>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '40px' }}>
				<Typography sx={{ color: grey[600] }}>
					Address
				</Typography>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
					<Typography noWrap>
						{ellipsisAddress(`${safeAddress}`)}
					</Typography>
					{/* <PrefixedEthHashInfo address={safeAddress} showAvatar={false} /> */}
					<div className={css.iconButtons}>
						<QrCodeButton>
							<Tooltip title="Open QR code" placement="top">
								<IconButton className={css.iconButton} sx={({ palette }) => ({ color: palette.border.main })}>
									<SvgIcon component={AppsIcon} inheritViewBox fontSize="small" />
								</IconButton>
							</Tooltip>
						</QrCodeButton>

						<CopyButton text={addressCopyText} className={css.iconButton}>
							<SvgIcon component={CopyIcon} inheritViewBox fontSize="small" />
						</CopyButton>

						<Tooltip title={blockExplorerLink?.title || ''} placement="top">
							<IconButton
								className={css.iconButton}
								target="_blank"
								rel="noreferrer"
								href={blockExplorerLink?.href || ''}
								sx={({ palette }) => ({ color: palette.border.main })}
							>
								<SvgIcon component={LinkIcon} inheritViewBox fontSize="small" />
							</IconButton>
						</Tooltip>
					</div>
				</Box>
			</Box>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '40px', pt: '17px' }}>
				<Typography sx={{ color: grey[600] }}>Network</Typography>
				<Typography>
					{safe?.chainId === '137'
						? 'Polygon'
						: safe?.chainId === '1'
							? 'Ethereum'
							: safe?.chainId === '10'
								? 'Optimism'
								: safe?.chainId === '42161'
									? 'Arbitrum'
									: safe?.chainId === '56'
										? 'BNB Smart Chain'
										: safe?.chainId === '100'
											? 'Gnosis Chain'
											: ''}
				</Typography>
			</Box>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '40px', pt: '20px' }}>
				<Typography sx={{ color: grey[600] }}>
					Threshold
				</Typography>
				<ThresholdOverview threshold={threshold} owners={ownerLength} />
			</Box>
		</Box>
	)
}

export default OverviewSection