"use client";

import { formatNumber } from "lib/numbers";
import { useCgvPrice, useGcoinPrice } from "lib/prices";
import { useGCoinStakingAnnualRewardRate } from "lib/wagmiHooks";

export default function BaseRewardRate() {
  const annualRewardRateResult = useGCoinStakingAnnualRewardRate();
  const gcoinPrice = useGcoinPrice();
  const cgvPrice = useCgvPrice();

  if (annualRewardRateResult.data == null) {
    return null;
  }

  return (
    <>{`${formatNumber(
      (Number(annualRewardRateResult.data) / gcoinPrice) * cgvPrice,
      { digits: 2 }
    )}%`}</>
  );
}
