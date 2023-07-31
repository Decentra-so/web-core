export type User = {
  name: string | null
  value: string
  logoUri: string | null
}

export type ExectutionInfo = {
  confirmationsRequired: number
  confirmationsSubmitted: number
  missingSigners: string[]
  nonce: number
  type: string
}

export type TransferInfo = {
  decimals: number
  value: string
  type: string
  tokenName: string
  logoUri: string
  tokenAddress: string
  tokenSymbol: string
}

export type TxItemMultisigTransfer = {
  id: string
  safeAppInfo: null
  timestamp: number
  txStatus: string
  txInfo: {
    direction: string
    type: string
    recipient: User,
    sender: User,
    transferInfo: TransferInfo,
  },
  executionInfo: ExectutionInfo,
  type: string
}

export const txItemMultisigTransfer: TxItemMultisigTransfer = {
  id: "multisig_0xd2e07BE6C9a7866Bc874Ed5a03a5798F62A6dE34_0x4196d1e7ccff2a52b426f8f6b422816d464312e30e989bd74e5e48d365ff031b",
  safeAppInfo: null,
  timestamp: 1634176800,
  txStatus: "SUCCESS",
  txInfo: {
    direction: "INCOMING",
    type: "transfer",
    recipient: {
      value: "0x4196d1e7ccff2a52b426f8f6b422816d464312e3",
      name: null,
      logoUri: null,
    },
    sender: {
      value: "0x4196d1e7ccff2a52b426f8f6b422816d464312e3",
      name: null,
      logoUri: null,
    },
    transferInfo: {
      decimals: 6,
      value: "100000000",
      type: "ERC20",
      tokenName: "USD Coin",
      logoUri: "https://gnosis-safe-token-logos.s3.amazonaws.com/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
      tokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      tokenSymbol: "USDC",
    }
  },
  executionInfo: {
    confirmationsRequired: 1,
    confirmationsSubmitted: 1,
    missingSigners: [],
    nonce: 0,
    type: "MULTISIG",
  },
  type: "TRANSACTION",
}