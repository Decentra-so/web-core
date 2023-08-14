
import useAddressBookByChain from "@/hooks/useAddressBookByChain";
import { useAppSelector } from "@/store";
import { selectAllAddressBooks } from "@/store/addressBookSlice";
import ellipsisAddress from "@/utils/ellipsisAddress";
import { formatAddress, reverseAddressFormatter } from "@/utils/formatters";
import { getChainId } from "@/utils/networkRegistry";
import { Typography } from "@mui/material";
import { useEnsName } from "wagmi";

const FormattedName: React.FC<{ address: string, weight: string | number, size?: string, showAddress?: boolean }> = ({ address, weight, size, showAddress = false }) => {
	//get all address books && get address book for current chain
	const allAddressBooks = useAppSelector(selectAllAddressBooks)
	const addressBook = useAddressBookByChain()

	//get chainid from address if it contains chain prefix. Otherwise, get chainId from current chain
	const chainId: number = address && getChainId(!address?.startsWith('0x') && address.split(':')[0] as any) || 0
	const { data: ens, isError, isLoading } = useEnsName({
		address: formatAddress(address) as `0x${string}`
	})
	if (!address) return null

	const name = ens || ellipsisAddress(`${address}`)


	return <>
		{showAddress ? <>
			<Typography sx={{ fontWeight: weight, fontSize: size }}>
				{
					chainId !== 0 && allAddressBooks[chainId] ? allAddressBooks[chainId][reverseAddressFormatter(address) as `0x${string}`] || ens || ''
						:
						addressBook[address?.slice(address.lastIndexOf(':') + 1)] || ens
				}
			</Typography>
			<Typography sx={{ fontWeight: weight, fontSize: size }}>{ellipsisAddress(`${formatAddress(address)}`)}</Typography>
		</> : <Typography sx={{ fontWeight: weight, fontSize: size }}>{name}</Typography >}
	</>
}

export default FormattedName
