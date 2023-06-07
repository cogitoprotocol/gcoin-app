"use client";

import { CGV_DECIMALS } from "@/lib/constants";
import { formatNumber } from "@/lib/numbers";
import { useGCoinStakingGetTotalOutstandingRewards } from "@/lib/wagmiHooks";

export default function PendingRewards() {
  const totalOutstandingRewards = useGCoinStakingGetTotalOutstandingRewards({
    watch: true,
  });

  if (totalOutstandingRewards.data == null) {
    return null;
  }

  return (
    <>{`${formatNumber(totalOutstandingRewards.data, {
      decimals: CGV_DECIMALS,
    })} CGV`}</>
  );
}
