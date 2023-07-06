
import useChainId from '@/hooks/useChainId'
import { useAppSelector } from '@/store'
import { selectChainById } from '@/store/chainsSlice'
import { selectSettings } from '@/store/settingsSlice'
import { EthHashInfo } from '@safe-global/safe-react-components'
import { type ReactElement } from 'react'

import { getBlockExplorerLink } from '../../../utils/chains'

import type { EthHashInfoProps } from '@safe-global/safe-react-components'
import { useEnsName } from 'wagmi'
import useAddressBookByChain from '@/hooks/useAddressBookByChain'

const PrefixedEthHashInfo = ({
  showName = true,
  ...props
}: EthHashInfoProps & { showName?: boolean }): ReactElement => {
  const settings = useAppSelector(selectSettings)
  const currentChainId = useChainId()
  const chain = useAppSelector((state) => selectChainById(state, props.chainId || currentChainId))
  const addressBook = useAddressBookByChain()
  const { data: ens, isError, isLoading } = useEnsName({
    address: props.address as `0x${string}`,
  })
  const link = chain ? getBlockExplorerLink(chain, props.address) : undefined
  const name = showName ? props.name || addressBook[props.address] : undefined

  return (
    <EthHashInfo
      prefix={chain?.shortName}
      showPrefix={settings.shortName.show}
      copyPrefix={settings.shortName.copy}
      {...props}
      name={name}
      ExplorerButtonProps={{ title: link?.title || '', href: link?.href || '' }}
    >
      {props.children}
    </EthHashInfo>
  )
}

export default PrefixedEthHashInfo
