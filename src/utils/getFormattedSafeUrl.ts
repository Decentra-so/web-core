export const getFormattedSafeUrl = (safeAddress: string, chainId: string): string => {
  if (!safeAddress) return '/'
  if (chainId === '1') {
    return `eth:${safeAddress}`
  }
  if (chainId === '56') {
    return `bnb:${safeAddress}`
  }
  if (chainId === '137') {
    return `matic:${safeAddress}`
  }
  if (chainId === '100') {
    return `gno:${safeAddress}`
  }
  if (chainId === '10') {
    return `oeth:${safeAddress}`
  }
  if (chainId === '42161') {
    return `arb1:${safeAddress}`
  }
  else {
    return safeAddress
  }
}