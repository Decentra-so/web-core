
import useAddressBookByChain from "@/hooks/useAddressBookByChain";
import ellipsisAddress from "@/utils/ellipsisAddress";
import { Typography } from "@mui/material";
import { useEnsName } from "wagmi";

const FormattedName: React.FC<{ address: string, weight: string | number, showAddress?: boolean }> = ({ address, weight, showAddress = false }) => {
	const addressBook = useAddressBookByChain()
	const { data: ens, isError, isLoading } = useEnsName({
		address: address?.startsWith('0x') ? address as `0x${string}` : address?.slice(address.lastIndexOf(':') + 1) as `0x${string}`,
	})
	if (!address) return null
	const name = addressBook[!address?.startsWith('0x') ? address?.slice(address.lastIndexOf(':') + 1) : address] || ens || ellipsisAddress(`${address}`)
	return (
		<>
			{showAddress ? <>
				<Typography sx={{ fontWeight: weight }}>{addressBook[address?.slice(address.lastIndexOf(':') + 1)] || ens}</Typography>
				<Typography sx={{ fontWeight: weight }}>{ellipsisAddress(`${address?.slice(address.lastIndexOf(':') + 1)}`)}</Typography>
			</> : <Typography sx={{ fontWeight: weight }}>{name}</Typography>}
		</>
	)

}

export default FormattedName;