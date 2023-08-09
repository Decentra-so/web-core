//import { moneriumPack } from "@/services/monerium";
import { getSafeSDK } from "./coreSDK/safeCoreSDK";

import { useState, useEffect } from "react";

export const useMonerium = () => {
  const safeSDK = getSafeSDK();
  const [monerium, setMonerium] = useState<any>(null);

  useEffect(() => {
    const initMonerium = async () => {
      if (!safeSDK) return;
      //@ts-ignore
      //const monerium = await moneriumPack.init({ safeSDK });
      setMonerium(monerium);
    }

    if (safeSDK) {
      initMonerium();
    }

  }, [safeSDK])

  console.log(monerium)

  return {
    monerium
  }
}