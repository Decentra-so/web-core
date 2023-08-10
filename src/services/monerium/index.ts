import { MoneriumPack } from '@safe-global/onramp-kit'

export const moneriumPack = new MoneriumPack({
  clientId: 'e7d328a1-3773-11ee-94a6-369e770da2e3', // Get your client id from Monerium
  environment: 'sandbox' // Use the proper Monerium environment ('sandbox' | 'production')})
})
