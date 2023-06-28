import MobileChatFooter from "@/components/chat/mobileChatFooter"
import { SafeList } from "@/components/chat/SafeList"
import useWallet from "@/hooks/wallets/useWallet"
import { getSession, signOut } from "next-auth/react"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"

export async function getServerSideProps(context: any) {
	const session = await getSession(context)
	const path = context.req.url.split('?')
	// redirect if not authenticated
	if (!session) {
		return {
			redirect: {
				destination: path[1] ? `/welcome?${path[1]}` : '/welcome',
				permanent: false,
			},
		}
	}

	return {
		props: { user: session.user },
	}
}

const SafePage: React.FC<{ user: any }> = ({ user }) => {
	const router = useRouter()
	const wallet = useWallet()
	const [createSafe, setCreateSafe] = useState<boolean>(false)
	useEffect(() => {
		if (user.address !== wallet?.address) {
			signOut({ redirect: true })
		}
		if (router.asPath.includes('chain')) {
			setCreateSafe(true)
		}
	}, [])
	return (
		<>
			<SafeList createSafe={createSafe} setCreateSafe={setCreateSafe} />
			<MobileChatFooter />
		</>
	)
}

export default SafePage