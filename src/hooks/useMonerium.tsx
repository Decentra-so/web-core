import { moneriumPack } from "@/services/monerium";
import { ethers } from "ethers";
import Safe, { EthersAdapter } from '@safe-global/protocol-kit'
import { useState, useEffect } from "react";
import useWallet from "./wallets/useWallet";
import useSafeAddress from "./useSafeAddress";

export const useMonerium = () => {
  const [monerium, setMonerium] = useState<any>(null);
  const wallet = useWallet()
 
  const safeAddress = useSafeAddress()

  useEffect(() => {
    if (!wallet?.address || !wallet?.provider) return
    const provider = new ethers.providers.Web3Provider(wallet?.provider)
    const safeOwner = provider.getSigner()
    const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: safeOwner })

    const initMonerium = async () => {
      const safeSdk = await Safe.create({
        ethAdapter: ethAdapter,
        safeAddress: safeAddress,
      })

      if (!safeSdk) return;
      const monerium = await moneriumPack.init({ safeSdk });
      return monerium
    }

    const mon = initMonerium();
    mon.then(setMonerium)

  }, [wallet?.address, wallet?.provider, safeAddress])



  return {
    monerium
  }
}