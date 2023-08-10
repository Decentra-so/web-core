import { MoneriumPack } from '@safe-global/onramp-kit'

export const moneriumPack = new MoneriumPack({
  clientId: '3af9423d-36a6-11ee-aa67-8ac0dd3eab06', // Get your client id from Monerium
  environment: 'sandbox' // Use the proper Monerium environment ('sandbox' | 'production')})
})
