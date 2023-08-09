import { MoneriumPack } from '@safe-global/onramp-kit'

export const moneriumPack = new MoneriumPack({
  clientId: process.env.NEXT_PUBLIC_MONERIUM_CLIENT_CREDENTIALS || '', // Get your client id from Monerium
  environment: 'sandbox' // Use the proper Monerium environment ('sandbox' | 'production')})
})
