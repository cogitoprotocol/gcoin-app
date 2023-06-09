"use client";

import { CGV_DECIMALS } from "lib/constants";
import { formatNumber } from "lib/numbers";
import { cgvAddress, treasuryAddress, useErc20BalanceOf } from "lib/wagmiHooks";

export default function TotalAllocatedRewards() {
  const balance = useErc20BalanceOf({
    address: cgvAddress,
    args: [treasuryAddress],
  });

  if (balance.data == null) {
    return null;
  }

  return <>{`${formatNumber(balance.data, { decimals: CGV_DECIMALS })} CGV`}</>;
}
