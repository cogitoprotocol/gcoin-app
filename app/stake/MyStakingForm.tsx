"use client";
import { GCOIN_DECIMALS } from "@/lib/constants";
import { getRevertError } from "@/lib/errors";
import { formatNumber } from "@/lib/numbers";
import { useCgvPrice, useGcoinPrice } from "@/lib/prices";
import {
  gCoinStakingABI,
  gCoinStakingAddress,
  useGCoinStakingAnnualRewardRate,
  useGCoinStakingGetUserStakingInfoList,
  useGCoinStakingPaused,
} from "@/lib/wagmiHooks";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { waitForTransaction, writeContract } from "@wagmi/core";
import classNames from "classnames";
import { DateTime } from "luxon";
import Image from "next/image";
import { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { Address, useAccount } from "wagmi";
import gcoinSvg from "../img/gcoin.svg";

export default function MyStakingForm() {
  const userAccount = useAccount();
  const [loadingIndexes, setLoadingIndexes] = useState<{
    [key: number]: boolean;
  }>({});
  const toggleLoading = (index: number) =>
    setLoadingIndexes((l) => {
      l[index] = !l[index];
      return l;
    });

  // User info
  const userStakingInfoListResult = useGCoinStakingGetUserStakingInfoList({
    args: [userAccount.address as Address],
    watch: !!userAccount.address,
    enabled: !!userAccount.address,
  });

  // Rates and prices
  const now = DateTime.now();
  const annualRewardRateResult = useGCoinStakingAnnualRewardRate();
  const gcoinPrice = useGcoinPrice();
  const cgvPrice = useCgvPrice();

  // Disable form if paused
  const isPausedResult = useGCoinStakingPaused();

  // Form submission
  const [error, setError] = useState("");
  const addRecentTransaction = useAddRecentTransaction();
  const onWithdraw = async (index: number) => {
    toggleLoading(index);

    // tx: withdrawSpecific
    try {
      const { hash } = await writeContract({
        address: gCoinStakingAddress,
        abi: gCoinStakingABI,
        functionName: "withdrawSpecific",
        args: [BigInt(index)],
      });
      addRecentTransaction({ hash, description: "Withdraw GCOIN" });

      console.log(`withdrawSpecific`, hash);
      const data = await waitForTransaction({
        hash,
      });
      console.log(`withdrawSpecific`, data);
    } catch (error) {
      console.warn(`withdrawSpecific`, error);
      const reason = getRevertError(error);
      setError(reason ? reason : "Error");
    }
    toggleLoading(index);
  };

  if (!userStakingInfoListResult.data) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-2">
      {userStakingInfoListResult.data.stakes.map(
        ({ amount, timestamp, duration, rewardMultiplier }, index) => {
          const unlockDt = DateTime.fromSeconds(Number(timestamp)).plus({
            seconds: Number(duration),
          });
          const isLocked = unlockDt.diffNow().toMillis() > 0;
          return (
            <div className="flex flex-col gap-4" key={index}>
              <div className="rounded-md bg-black bg-opacity-20 p-4 flex flex-col gap-2 focus-within:outline-purple-400 focus-within:outline focus-within:outline-2">
                <div className="flex text-2xl items-center">
                  <Image alt="GCOIN" src={gcoinSvg} width={24} height={24} />
                  <label className="ml-2">
                    {formatNumber(amount, { decimals: GCOIN_DECIMALS })}
                  </label>
                </div>

                <div className="text-sm">
                  <div>
                    {formatNumber(
                      (((Number(rewardMultiplier) / 100) *
                        Number(annualRewardRateResult.data)) /
                        gcoinPrice) *
                        cgvPrice,
                      { digits: 2 }
                    )}
                    % APY
                  </div>
                  <div className="text-gray-400">
                    Locked until{" "}
                    {unlockDt.toLocaleString(DateTime.DATETIME_FULL)}
                  </div>

                  <button
                    type="button"
                    className={classNames(
                      {
                        "cursor-progress": loadingIndexes[index],
                        "cursor-pointer text-white hover:bg-purple-600":
                          !isLocked && !loadingIndexes[index],
                      },
                      "mt-4 rounded-md px-4 py-2 bg-purple-500 bg-opacity-50 focus:outline-none transition-colors"
                    )}
                    disabled={isLocked || loadingIndexes[index]}
                    onClick={() => onWithdraw(index)}
                  >
                    {isPausedResult.data === true ? (
                      "Staking Unavailable"
                    ) : loadingIndexes[index] ? (
                      <span className="flex items-center gap-2 justify-center">
                        <CgSpinner className="animate-spin" /> Submitting...
                      </span>
                    ) : isLocked ? (
                      "Locked"
                    ) : (
                      "Withdraw"
                    )}
                  </button>
                </div>
              </div>

              {error}
            </div>
          );
        }
      )}
    </div>
  );
}
