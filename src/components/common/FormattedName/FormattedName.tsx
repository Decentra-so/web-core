
import useAddressBookByChain from "@/hooks/useAddressBookByChain";
import ellipsisAddress from "@/utils/ellipsisAddress";
import { Typography } from "@mui/material";
import { useEnsName } from "wagmi";
import { selectAllAddressBooks } from "@/store/addressBookSlice"
import { useAppSelector } from "@/store";
import { getChainId } from "@/utils/networkRegistry";
import { formatAddress, reverseAddressFormatter } from "@/utils/formatters";

const FormattedName: React.FC<{ address: string, weight: string | number, size?: string }> = ({ address, weight, size }) => {
	//get all address books && get address book for current chain
	const allAddressBooks = useAppSelector(selectAllAddressBooks)
	const addressBook = useAddressBookByChain()

	//get chainid from address if it contains chain prefix. Otherwise, get chainId from current chain
	const chainId: number = getChainId(!address?.startsWith('0x') && address.split(':')[0] as any) || 0
	const { data: ens, isError, isLoading } = useEnsName({
		address: formatAddress(address) as `0x${string}`
	})
	if (!address) return null

	//get name from address book based on chainId or if no chainId from chain's default address book
	const name = chainId !== 0 && allAddressBooks[chainId] ?
		allAddressBooks[chainId][reverseAddressFormatter(address) as `0x${string}`] || ens || ellipsisAddress(`${address}`)
		: addressBook[reverseAddressFormatter(address) as `0x${string}`] || ens || ellipsisAddress(`${address}`)

return <>
		{address?.startsWith('0x') ? <Typography sx={{ fontWeight: weight, fontSize: size }}>{name}</Typography> : <>
			<Typography sx={{ fontWeight: weight, fontSize: size }}>
				{
					chainId !== 0 && allAddressBooks[chainId] ? allAddressBooks[chainId][reverseAddressFormatter(address) as `0x${string}`] || ens || ''
					:
					addressBook[address?.slice(address.lastIndexOf(':') + 1)] || ens
				}
			</Typography>
			<Typography sx={{ fontWeight: weight, fontSize: size }}>{ellipsisAddress(`${formatAddress(address)}`)}</Typography>
		</>}
	</>
}

export default FormattedName;