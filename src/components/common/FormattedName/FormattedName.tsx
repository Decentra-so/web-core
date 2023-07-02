import useAddressBook from "@/hooks/useAddressBook";
import ellipsisAddress from "@/utils/ellipsisAddress";
import { Typography } from "@mui/material";
import { useEnsName } from "wagmi";

const FormattedName: React.FC<{ address: string, weight: string | number }> = ({ address, weight }) => {
	const addressBook = useAddressBook()
	const { data: ens, isError, isLoading } = useEnsName({
		address: address?.startsWith('0x') ? address as `0x${string}` : address?.slice(address.lastIndexOf(':') + 1) as `0x${string}`,
	})
	if (!address) return null
	const name = addressBook[!address?.startsWith('0x') ? address?.slice(address.lastIndexOf(':') + 1) : address] || ens || ellipsisAddress(`${address}`)
	return <>
		{address?.startsWith('0x') ? <Typography sx={{ fontWeight: weight }}>{name}</Typography> : <>
			<Typography sx={{ fontWeight: weight }}>{addressBook[address?.slice(address.lastIndexOf(':') + 1)] || ens}</Typography>
			<Typography sx={{ fontWeight: weight }}>{ellipsisAddress(`${address}`)}</Typography>
		</>}
	</>
}

export default FormattedName;