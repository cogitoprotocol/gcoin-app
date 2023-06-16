"use client";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import {
  ReadContractResult,
  waitForTransaction,
  writeContract,
} from "@wagmi/core";
import classNames from "classnames";
import Alert from "components/common/Alert";
import { FormState } from "components/common/SubmitButton";
import { CGV_DECIMALS, GCOIN_DECIMALS } from "lib/constants";
import { getRevertError } from "lib/errors";
import { useCgvPrice, useGcoinPrice } from "lib/hooks/prices";
import { formatNumber } from "lib/numbers";
import {
  gCoinStakingABI,
  gCoinStakingAddress,
  useGCoinStakingAnnualRewardRate,
} from "lib/wagmiHooks";
import { DateTime } from "luxon";
import Image from "next/image";
import { useState } from "react";
import { CgSpinner } from "react-icons/cg";

export function SingleStake({
  now,
  index,
  isPaused,
  stake: {
    amount,
    timestamp,
    duration,
    rewardMultiplier,
    claimedReward,
    unclaimedReward,
  },
}: {
  now: DateTime;
  index: number;
  isPaused: boolean;
  stake: ReadContractResult<
    typeof gCoinStakingABI,
    "getUserStakingInfoList"
  >[number];
}) {
  // Rates and prices
  const annualRewardRateResult = useGCoinStakingAnnualRewardRate();
  const gcoinPrice = useGcoinPrice();
  const cgvPrice = useCgvPrice();

  // Form states
  const [error, setError] = useState("");
  const [withdrawFormState, setWithdrawFormState] = useState(FormState.READY);
  const [claimFormState, setClaimFormState] = useState(FormState.READY);

  const addRecentTransaction = useAddRecentTransaction();
  const handleWithdraw = async (index: number) => {
    setWithdrawFormState(FormState.LOADING);

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
      setError("");
    } catch (error) {
      console.warn(`withdrawSpecific`, error);
      const reason = getRevertError(error);
      setError(reason);
    }
    setWithdrawFormState(FormState.READY);
  };
  const handleClaim = async (index: number) => {
    setClaimFormState(FormState.LOADING);

    // tx: withdrawRewardSpecific
    try {
      const { hash } = await writeContract({
        address: gCoinStakingAddress,
        abi: gCoinStakingABI,
        functionName: "withdrawRewardSpecific",
        args: [BigInt(index)],
      });
      addRecentTransaction({ hash, description: "Claim Rewards" });

      console.log(`withdrawRewardSpecific`, hash);
      const data = await waitForTransaction({
        hash,
      });
      console.log(`withdrawRewardSpecific`, data);
      setError("");
    } catch (error) {
      console.warn(`withdrawRewardSpecific`, error);
      const reason = getRevertError(error);
      setError(reason);
    }
    setClaimFormState(FormState.READY);
  };

  const unlockDt = DateTime.fromSeconds(Number(timestamp)).plus({
    seconds: Number(duration),
  });
  const isLocked = unlockDt.diff(now).toMillis() > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md bg-black bg-opacity-5 dark:bg-opacity-20 p-4 text-sm">
        <div className="flex text-2xl items-center mb-2 gap-2">
          <Image alt="GCOIN" src="/img/gcoin.svg" width={24} height={24} />
          <label>{formatNumber(amount, { decimals: GCOIN_DECIMALS })}</label>
        </div>

        <div className="flex justify-between">
          <div>APY</div>
          <div>
            {formatNumber(
              (((Number(rewardMultiplier) / 100) *
                Number(annualRewardRateResult.data)) /
                gcoinPrice) *
                cgvPrice,
              { digits: 2 }
            )}
            %
          </div>
        </div>
        <div className="flex justify-between">
          <div>Pending Rewards</div>
          <div className="flex items-center gap-2">
            <Image
              alt="CGV"
              className="hidden dark:block"
              src="/icon.svg"
              width={16}
              height={16}
            />
            <Image
              alt="CGV"
              className="dark:hidden block"
              src="/img/icon-light.svg"
              width={16}
              height={16}
            />
            {formatNumber(unclaimedReward, {
              decimals: CGV_DECIMALS,
            })}
          </div>
        </div>
        <div className="text-gray-600 dark:text-gray-400">
          {`${
            isLocked ? "Locked until" : "Unlocked at"
          } ${unlockDt.toLocaleString(DateTime.DATETIME_FULL)}`}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className={classNames(
              {
                "cursor-progress": withdrawFormState === FormState.LOADING,
                "cursor-pointer hover:bg-accent-active":
                  !isLocked && withdrawFormState === FormState.READY,
                "opacity-80 text-black/50": isLocked,
                "text-black/30": withdrawFormState !== FormState.READY,
              },
              "rounded-md w-32 py-2 bg-accent focus:outline-none transition-all"
            )}
            disabled={
              isPaused || isLocked || withdrawFormState !== FormState.READY
            }
            onClick={() => handleWithdraw(index)}
          >
            {isPaused ? (
              "Staking Unavailable"
            ) : withdrawFormState === FormState.LOADING ? (
              <span className="flex items-center gap-2 justify-center">
                <CgSpinner className="animate-spin" /> Submitting...
              </span>
            ) : isLocked ? (
              "Locked"
            ) : (
              "Withdraw"
            )}
          </button>

          {!isLocked && (
            <button
              type="button"
              className={classNames(
                {
                  "cursor-progress": claimFormState === FormState.LOADING,
                  "cursor-pointer hover:bg-accent-active":
                    claimFormState === FormState.READY,
                  "opacity-80 text-black/50": isLocked,
                  "text-black/30": claimFormState !== FormState.READY,
                },
                "rounded-md w-32 py-2 bg-accent focus:outline-none transition-all"
              )}
              disabled={isPaused || claimFormState !== FormState.READY}
              onClick={() => handleClaim(index)}
            >
              {isPaused ? (
                "Staking Unavailable"
              ) : claimFormState === FormState.LOADING ? (
                <span className="flex items-center gap-2 justify-center">
                  <CgSpinner className="animate-spin" /> Submitting...
                </span>
              ) : (
                "Claim Rewards"
              )}
            </button>
          )}
        </div>

        {!!error && <Alert title="Error">{error}</Alert>}
      </div>
    </div>
  );
}
