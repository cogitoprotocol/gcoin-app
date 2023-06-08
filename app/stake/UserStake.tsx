"use client";

import ClientOnly from "@/components/common/ClientOnly";
import { CGV_DECIMALS, GCOIN_DECIMALS } from "@/lib/constants";
import { formatNumber } from "@/lib/numbers";
import { useGCoinStakingGetUserStakingInfo } from "@/lib/wagmiHooks";
import { Address, useAccount } from "wagmi";
import UserCgvBalance from "./UserCgvBalance";

export default function UserStake() {
  const userAccount = useAccount();
  const userStakingInfoResult = useGCoinStakingGetUserStakingInfo({
    args: [userAccount.address as Address],
    watch: !!userAccount.address,
    enabled: !!userAccount.address,
  });

  if (userStakingInfoResult.data == null) {
    return null;
  }

  return (
    <ClientOnly>
      <div className="w-full text-sm">
        <div className="flex justify-between">
          <div>Your GCOIN Staked</div>
          <div>
            {`${formatNumber(userStakingInfoResult.data[0], {
              decimals: GCOIN_DECIMALS,
            })} GCOIN`}
          </div>
        </div>
        <div className="flex justify-between">
          <div>Pending CGV Rewards</div>
          <div>
            {`${formatNumber(userStakingInfoResult.data[1], {
              decimals: CGV_DECIMALS,
            })} CGV`}
          </div>
        </div>
        <div className="flex justify-between">
          <div>Your CGV Balance</div>
          <div>
            <UserCgvBalance />
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
