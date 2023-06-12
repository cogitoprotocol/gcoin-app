"use client";

import { GCOIN_DECIMALS } from "lib/constants";
import { formatNumber } from "lib/numbers";
import { useGCoinStakingGetTotalLockedValue } from "lib/wagmiHooks";

export default function TotalStaked() {
  const tvl = useGCoinStakingGetTotalLockedValue({
    watch: true,
  });

  if (tvl.data == null) {
    return null;
  }

  return (
    <>{`${formatNumber(tvl.data, {
      decimals: GCOIN_DECIMALS,
    })} GCOIN`}</>
  );
}
