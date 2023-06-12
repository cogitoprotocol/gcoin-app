"use client";

import { GCOIN_DECIMALS } from "lib/constants";
import { formatNumberUSD } from "lib/numbers";
import { useGCoinGetGCoinValue, useGCoinTotalSupply } from "lib/wagmiHooks";

export default function GCoinMarketCap() {
  const gcoinValue = useGCoinGetGCoinValue({ watch: true });
  const gcoinSupply = useGCoinTotalSupply({ watch: true });
  const gcoinDenominator = Math.pow(10, GCOIN_DECIMALS);
  const gcoinUsd = Number(gcoinValue?.data ?? 0) / gcoinDenominator;
  const gcoinMarketCap =
    (Number(gcoinSupply?.data ?? BigInt(0)) / gcoinDenominator) * gcoinUsd;
  return <>{formatNumberUSD(gcoinMarketCap, { digits: 0 })}</>;
}
