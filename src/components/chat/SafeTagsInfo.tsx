import { type ReactElement, useMemo } from 'react'
import { Box, useMediaQuery } from '@mui/material'

import { ChangeThresholdDialogEditIcon } from '@/components/settings/owner/ChangeThresholdDialog'


import { formatCurrency } from '@/utils/formatNumber'
import useSafeInfo from '@/hooks/useSafeInfo'
import { useAppSelector } from '@/store'
import { selectCurrency } from '@/store/settingsSlice'

import { useVisibleBalances } from '@/hooks/useVisibleBalances'

export const SafeTagsInfo = ({ threshold, owners }: { threshold: number; owners: number }): ReactElement => {
  const matches = useMediaQuery('(min-width: 601px)')
  const currency = useAppSelector(selectCurrency)
  const { balances } = useVisibleBalances()
  const { safe } = useSafeInfo()
  
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
             <Box sx={{ display: 'flex', gap: '6px' }}>
            <Box>{threshold}/{owners} {matches && <a>Threshold</a>}</Box>
          {owners > 1 && <ChangeThresholdDialogEditIcon />}
             </Box>
          </Box>
      </Box>
  )
}

export default SafeTagsInfo
