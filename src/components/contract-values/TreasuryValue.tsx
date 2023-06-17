"use client";

import { USDC_DECIMALS } from "lib/constants";
import { formatNumberUSD } from "lib/numbers";
import {
  treasuryAddress,
  usdTestAddress,
  useErc20BalanceOf,
} from "lib/wagmiHooks";

export default function TreasuryValue() {
  const result = useErc20BalanceOf({
    address: usdTestAddress,
    args: [treasuryAddress],
    watch: true,
  });

  if (result.data == null) {
    return null;
  }

  return (
    <>{formatNumberUSD(result.data, { decimals: USDC_DECIMALS, digits: 0 })}</>
  );
}
