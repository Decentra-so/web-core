import MobileChatFooter from "@/components/chat/mobileChatFooter"
import { SafeList } from "@/components/chat/SafeList"
import React from "react"

const SafePage: React.FC = () => {
	return (
		<>
			<SafeList />
			<MobileChatFooter />
		</>
	)
}

export default SafePage