import useLocalStorage from '@/services/local-storage/useLocalStorage'
import { useEffect } from 'react'
import useWallet from './wallets/useWallet'
import useSafeInfo from './useSafeInfo'

const CACHE_KEY = 'allTXHistory'

type HistoryCache = Map<number, string[]>

const apiRoutes = new Map<string, string>();
apiRoutes.set('137', 'https://safe-transaction-polygon.safe.global')
apiRoutes.set('10', 'https://safe-transaction-optimism.safe.global')
apiRoutes.set('1', 'https://safe-transaction-mainnet.safe.global')
apiRoutes.set('100', 'https://safe-transaction-gnosis-chain.safe.global')
apiRoutes.set('42161', 'https://safe-transaction-arbitrum.safe.global')
apiRoutes.set('56', 'https://safe-transaction-bsc.safe.global')


export const useAllTXHistory = (): any => {
  const wallet = useWallet()
  const { safeAddress, safe } = useSafeInfo()
  const [historyCache, setHistoryCache] = useLocalStorage<HistoryCache>(CACHE_KEY)

  useEffect(() => {
    if (!wallet?.provider) return
    const route = apiRoutes.get(safe.chainId)
    let isCurrent = true
    async function fetchData(): Promise<any> {
      const apiUrl = `${route}/api/v1/safes/${safeAddress}/all-transactions/?limit=1000&offset=0&executed=false&queued=true&trusted=true`;
    
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
    }

    fetchData().then((res) => {
      if (isCurrent) {
        setHistoryCache(res.results)
      }
    })    

    return () => {
      isCurrent = false
    }
  }, [wallet?.address, wallet?.provider, setHistoryCache])

  return historyCache
}
