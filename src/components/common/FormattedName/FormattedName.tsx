
import useAddressBookByChain from "@/hooks/useAddressBookByChain";
import ellipsisAddress from "@/utils/ellipsisAddress";
import { Typography } from "@mui/material";
import { useEnsName } from "wagmi";

const FormattedName: React.FC<{ address: string, weight: string | number, size?: string }> = ({ address, weight, size }) => {
	const addressBook = useAddressBookByChain()
	const { data: ens, isError, isLoading } = useEnsName({
		address: address?.startsWith('0x') ? address as `0x${string}` : address?.slice(address.lastIndexOf(':') + 1) as `0x${string}`,
	})
	if (!address) return null
	const name = addressBook[!address?.startsWith('0x') ? address?.slice(address.lastIndexOf(':') + 1) : address] || ens || ellipsisAddress(`${address}`)
	return <>
		{address?.startsWith('0x') ? <Typography sx={{ fontWeight: weight, fontSize: size }}>{name}</Typography> : <>
			<Typography sx={{ fontWeight: weight, fontSize: size }}>{addressBook[address?.slice(address.lastIndexOf(':') + 1)] || ens}</Typography>
	    <Typography sx={{ fontWeight: weight, fontSize: size }}>{ellipsisAddress(`${address?.slice(address.lastIndexOf(':') + 1)}`)}</Typography>
		</>}
	</>
}

export default FormattedName;