"use client";

import { GCOIN_DECIMALS } from "lib/constants";
import { formatNumberUSD } from "lib/numbers";
import { useGCoinGetGCoinValue } from "lib/wagmiHooks";

export default function GCoinPrice() {
  const result = useGCoinGetGCoinValue({
    watch: true,
  });

  if (result.data == null) {
    return null;
  }

  return (
    <>{formatNumberUSD(result.data, { digits: 4, decimals: GCOIN_DECIMALS })}</>
  );
}
