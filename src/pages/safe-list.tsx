import MobileChatFooter from "@/components/chat/mobileChatFooter"
import { SafeList } from "@/components/chat/SafeList"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"

const SafePage: React.FC = () => {
	const router = useRouter()
	const [createSafe, setCreateSafe] = useState<boolean>(false)
	useEffect(() => {
		if (router.asPath.includes('chain')) {
			setCreateSafe(true)
		}
	}, [router.asPath])
	return (
		<>
			<SafeList createSafe={createSafe} setCreateSafe={setCreateSafe} />
			<MobileChatFooter />
		</>
	)
}

export default SafePage