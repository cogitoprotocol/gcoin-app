"use client";

import { GCOIN_DECIMALS } from "lib/constants";
import {
  usdTestAddress,
  useErc20Symbol,
  useGCoinGetGCoinValue,
} from "lib/wagmiHooks";

export default function GCoinPriceRate() {
  const gcoinValueResult = useGCoinGetGCoinValue({
    watch: true,
  });
  const inputSymbolResult = useErc20Symbol({
    address: usdTestAddress,
  });

  return (
    <>{`1 GCOIN = ${
      Number(gcoinValueResult.data) / Math.pow(10, GCOIN_DECIMALS)
    } ${inputSymbolResult.data}`}</>
  );
}
