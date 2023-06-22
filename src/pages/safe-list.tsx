import MobileChatFooter from "@/components/chat/mobileChatFooter"
import { SafeList } from "@/components/chat/SafeList"
import { getSession } from "next-auth/react"
import React from "react"

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
	return (
		<>
			<SafeList user={user} />
			<MobileChatFooter />
		</>
	)
}

export default SafePage