"use client";

import { useGCoinRedemptionFee } from "lib/wagmiHooks";

export default function RedemptionFee() {
  const result = useGCoinRedemptionFee();
  return <>{`${(Number(result.data) / 100).toFixed(2)}%`}</>;
}
