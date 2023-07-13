
import useAddressBookByChain from "@/hooks/useAddressBookByChain";
import ellipsisAddress from "@/utils/ellipsisAddress";
import { Typography } from "@mui/material";
import { useEnsName } from "wagmi";
import { selectAllAddressBooks } from "@/store/addressBookSlice"
import { useAppSelector } from "@/store";
import { getChainId } from "@/utils/networkRegistry";

const FormattedName: React.FC<{ address: string, weight: string | number, size?: string }> = ({ address, weight, size }) => {
	//get all address books && get address book for current chain
	const allAddressBooks = useAppSelector(selectAllAddressBooks)
	const addressBook = useAddressBookByChain()

	//get chainid from address if it contains chain prefix. Otherwise, get chainId from current chain
	const chainId: number = getChainId(!address?.startsWith('0x') && address.split(':')[0] as any) || 0
	const { data: ens, isError, isLoading } = useEnsName({
		address: address?.startsWith('0x') ? address as `0x${string}` : address?.slice(address.lastIndexOf(':') + 1) as `0x${string}`,
	})
	if (!address) return null

	//get name from address book based on chainId or if no chainId from chain's default address book
	const name = chainId !== 0 ?
		allAddressBooks[chainId][!address?.startsWith('0x') ? address?.slice(address.lastIndexOf(':') + 1) : address] || ens || ellipsisAddress(`${address}`)
		: addressBook[!address?.startsWith('0x') ? address?.slice(address.lastIndexOf(':') + 1) : address] || ens || ellipsisAddress(`${address}`)

return <>
		{address?.startsWith('0x') ? <Typography sx={{ fontWeight: weight, fontSize: size }}>{name}</Typography> : <>
			<Typography sx={{ fontWeight: weight, fontSize: size }}>
				{
					chainId !== 0 ? allAddressBooks[chainId][!address?.startsWith('0x') ? address?.slice(address.lastIndexOf(':') + 1) : address] || ens || ellipsisAddress(`${address}`)
					:
					addressBook[address?.slice(address.lastIndexOf(':') + 1)] || ens
				}
			</Typography>
			<Typography sx={{ fontWeight: weight, fontSize: size }}>{ellipsisAddress(`${address}`)}</Typography>
		</>}
	</>
}

export default FormattedName;