import { type ReactElement, useMemo } from 'react'
import { Box } from '@mui/material'

import { ThresholdOverview } from '@/components/chat/threshold'

import { formatCurrency } from '@/utils/formatNumber'
import useSafeInfo from '@/hooks/useSafeInfo'
import { useAppSelector } from '@/store'
import { selectCurrency } from '@/store/settingsSlice'

import { useVisibleBalances } from '@/hooks/useVisibleBalances'

const SafeTagsInfo = (): ReactElement => {
  const currency = useAppSelector(selectCurrency)
  const { balances } = useVisibleBalances()
  const { safe } = useSafeInfo()
  const { threshold, owners } = safe

  const fiatTotal = useMemo(
    () => (balances.fiatTotal ? formatCurrency(balances.fiatTotal, currency) : ''),
    [currency, balances.fiatTotal],
  )

  return (
     <Box sx={{ display: 'flex', gap: '4px' }}>
          <Box sx={{ width: 'auto', height: '20px', borderRadius: '4px', fontSize: '12px', padding: '6px', alignItems: 'center', display: 'flex', textTransform: 'uppercase', fontWeight: '600', color: '#517ac6', background: '#dce5f5' }}>
            {safe?.chainId === '137'
              ? 'Polygon'
              : safe?.chainId === '1'
                ? 'Ethereum'
                : safe?.chainId === '10'
                  ? 'Optimism'
                  : safe?.chainId === '42161'
                    ? 'Arbitrum'
                    : safe?.chainId === '56'
                      ? 'BNB Smart Chain'
                      : safe?.chainId === '100'
                        ? 'Gnosis Chain'
                        : ''}
          </Box>
          <Box sx={{ width: 'auto', height: '20px', borderRadius: '4px', fontSize: '12px', padding: '6px', alignItems: 'center', display: 'flex', textTransform: 'uppercase', fontWeight: '600', color: '#7b5aa9', background: '#e4e0ed' }}>
            {fiatTotal}
          </Box>
          <Box sx={{ width: 'auto', height: '20px', borderRadius: '4px', fontSize: '12px', padding: '6px', alignItems: 'center', display: 'flex', textTransform: 'uppercase', fontWeight: '600', color: '#2a8053', background: '#d8e9e1' }}>
           <ThresholdOverview threshold={threshold} owners={ownerLength} />
          </Box>
      </Box>
  )
}

export default SafeTagsInfo
