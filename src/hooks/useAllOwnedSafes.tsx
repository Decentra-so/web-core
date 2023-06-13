import SafeApiKit from '@safe-global/api-kit'
import { ethers } from 'ethers'
import { EthersAdapter } from '@safe-global/protocol-kit'
import { createWeb3 } from '@/hooks/wallets/web3'
import useWallet from './wallets/useWallet'
import { useEffect } from 'react'
import type { EthAdapter } from '@safe-global/safe-core-sdk-types'
import useLocalStorage from '@/services/local-storage/useLocalStorage'

const CACHE_KEY = 'allOwnedSafes'

type OwnedSafesCache = Map<number, string[]>


export const useAllOwnedSafes = (): any => {
  const wallet = useWallet()
  const [ownedSafesCache, setOwnedSafesCache] = useLocalStorage<OwnedSafesCache>(CACHE_KEY)

  useEffect(() => {
    let isCurrent = true
    const createService = async () => {
      let safeMap = new Map<number, string[]>();

      const provider = await createWeb3(wallet?.provider!)
      const safeOwner = provider.getSigner(0)

      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: safeOwner
      })

      const serviceArray = [
        {
          chainId: 10,
          service: new SafeApiKit({
            txServiceUrl: 'https://safe-transaction-optimism.safe.global/',
            //@ts-ignore
            ethAdapter: ethAdapter as unknown as EthAdapter
          })
        },
        {
          chainId: 137,
          service: new SafeApiKit({
            txServiceUrl: 'https://safe-transaction-polygon.safe.global/',
            //@ts-ignore
            ethAdapter
          })
        },
        {
          chainId: 1,
          service: new SafeApiKit({
            txServiceUrl: 'https://safe-transaction-mainnet.safe.global/',
            //@ts-ignore
            ethAdapter
          })
        },
        {
          chainId: 100,
          service: new SafeApiKit({
            txServiceUrl: 'https://safe-transaction-gnosis-chain.safe.global/',
            //@ts-ignore
            ethAdapter
          })
        },
        {
          chainId: 56,
          service:  new SafeApiKit({
            txServiceUrl: 'https://safe-transaction-bsc.safe.global/',
            //@ts-ignore
            ethAdapter
          })
        },
        {
          chainId: 42161,
          service: new SafeApiKit({
            txServiceUrl: 'https://safe-transaction-arbitrum.safe.global/',
            //@ts-ignore
            ethAdapter
          })
        },
      ]

      for (const item of serviceArray) {
        const safes = await item.service.getSafesByOwner(wallet?.address!);
        safeMap.set(item.chainId, safes.safes)
      }
      return safeMap
    }
    createService()
      .then((ownedSafes) => {
        isCurrent &&
        setOwnedSafesCache(ownedSafes)
      })
      
    return () => {
      isCurrent = false
    }
  }, [wallet?.address, setOwnedSafesCache])
  
  return ownedSafesCache
}
