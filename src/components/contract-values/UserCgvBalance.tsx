"use client";

import { CGV_DECIMALS } from "lib/constants";
import { formatNumber } from "lib/numbers";
import { cgvAddress, useErc20BalanceOf } from "lib/wagmiHooks";
import { Address, useAccount } from "wagmi";

export default function UserCgvBalance() {
  const userAccount = useAccount();
  const balance = useErc20BalanceOf({
    address: cgvAddress,
    args: [userAccount.address as Address],
    watch: !!userAccount.address,
    enabled: !!userAccount.address,
  });

  if (balance.data == null) {
    return null;
  }

  return <>{`${formatNumber(balance.data, { decimals: CGV_DECIMALS })} CGV`}</>;
}
