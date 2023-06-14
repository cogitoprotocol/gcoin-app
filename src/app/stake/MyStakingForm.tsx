"use client";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { waitForTransaction, writeContract } from "@wagmi/core";
import classNames from "classnames";
import Alert from "components/common/Alert";
import { CGV_DECIMALS, GCOIN_DECIMALS } from "lib/constants";
import { getRevertError } from "lib/errors";
import { formatNumber } from "lib/numbers";
import { useCgvPrice, useGcoinPrice } from "lib/prices";
import {
  gCoinStakingABI,
  gCoinStakingAddress,
  useGCoinStakingAnnualRewardRate,
  useGCoinStakingGetUserStakingInfoList,
  useGCoinStakingPaused,
} from "lib/wagmiHooks";
import { DateTime } from "luxon";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { Address, useAccount, useBlockNumber, usePublicClient } from "wagmi";

export default function MyStakingForm() {
  const userAccount = useAccount();
  const [isLoadingWithdrawAll, setisLoadingWithdrawAll] = useState(false);
  const [loadingIndexes, setLoadingIndexes] = useState<{
    [key: number]: boolean;
  }>({});
  const toggleLoading = (index: number) =>
    setLoadingIndexes((l) => {
      l[index] = !l[index];
      return l;
    });

  // Latest block timestamp
  const publicClient = usePublicClient();
  const blockNumber = useBlockNumber();
  const [blockTimestamp, setBlockTimestamp] = useState(0);
  useEffect(() => {
    (async () => {
      const block = await publicClient.getBlock();
      setBlockTimestamp(Number(block.timestamp));
    })();
  }, [blockNumber.data]);
  // TODO: Use DateTime in prod
  // const now = DateTime.now();

  // User info
  const userStakingInfoListResult = useGCoinStakingGetUserStakingInfoList({
    args: [userAccount.address as Address],
    watch: !!userAccount.address,
    enabled: !!userAccount.address,
  });

  // Rates and prices
  const annualRewardRateResult = useGCoinStakingAnnualRewardRate();
  const gcoinPrice = useGcoinPrice();
  const cgvPrice = useCgvPrice();

  // Disable form if paused
  const isPausedResult = useGCoinStakingPaused();

  // Form submission
  const [error, setError] = useState("");
  const addRecentTransaction = useAddRecentTransaction();
  const handleWithdraw = async (index: number) => {
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
      setError("");
    } catch (error) {
      console.warn(`withdrawSpecific`, error);
      const reason = getRevertError(error);
      setError(reason);
    }
    toggleLoading(index);
  };
  const handleClaim = async (index: number) => {
    toggleLoading(index);

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
    toggleLoading(index);
  };
  const handleWithdrawAll = async () => {
    setisLoadingWithdrawAll(true);

    // tx: withdrawAll
    try {
      const { hash } = await writeContract({
        address: gCoinStakingAddress,
        abi: gCoinStakingABI,
        functionName: "withdrawAll",
      });
      addRecentTransaction({ hash, description: "Withdraw GCOIN" });

      console.log(`withdrawAll`, hash);
      const data = await waitForTransaction({
        hash,
      });
      console.log(`withdrawAll`, data);
      setError("");
    } catch (error) {
      console.warn(`withdrawAll`, error);
      const reason = getRevertError(error);
      setError(reason);
    }
    setisLoadingWithdrawAll(false);
  };

  if (!userAccount.address) {
    return (
      <div className="h-16 bg-black bg-opacity-5 flex items-center justify-center text-sm">
        Connect wallet to view your staked GCOIN.
      </div>
    );
  }

  if (!userStakingInfoListResult.data) {
    return null;
  }

  if (userStakingInfoListResult.data.length == 0) {
    return (
      <div className="h-16 bg-black bg-opacity-5 flex items-center justify-center text-sm">
        No GCOIN staked.
      </div>
    );
  }

  const canWithdraw = userStakingInfoListResult.data.some(
    ({ timestamp, duration }) => Number(timestamp + duration) < blockTimestamp
  );

  return (
    <>
      {canWithdraw && (
        <div className="pb-4">
          <button
            type="button"
            className={classNames(
              {
                "cursor-progress": isLoadingWithdrawAll,
                "cursor-pointer hover:bg-accent-active": !isLoadingWithdrawAll,
              },
              "rounded-md w-48 py-2 bg-accent focus:outline-none transition-colors"
            )}
            disabled={isLoadingWithdrawAll}
            onClick={handleWithdrawAll}
          >
            {isPausedResult.data === true ? (
              "Staking Unavailable"
            ) : isLoadingWithdrawAll ? (
              <span className="flex items-center gap-2 justify-center">
                <CgSpinner className="animate-spin" /> Submitting...
              </span>
            ) : (
              "Withdraw Unlocked"
            )}
          </button>
        </div>
      )}

      {!!error && <Alert title="Error">{error}</Alert>}

      {userStakingInfoListResult.data.map(
        (
          {
            amount,
            timestamp,
            duration,
            rewardMultiplier,
            claimedReward,
            unclaimedReward,
          },
          index
        ) => {
          const unlockDt = DateTime.fromSeconds(Number(timestamp)).plus({
            seconds: Number(duration),
          });
          const isLocked =
            unlockDt.diff(DateTime.fromSeconds(blockTimestamp)).toMillis() > 0;
          return (
            <div className="flex flex-col gap-4" key={index}>
              <div className="rounded-md bg-black bg-opacity-5 dark:bg-opacity-20 p-4 text-sm">
                <div className="flex text-2xl items-center mb-2 gap-2">
                  <Image
                    alt="GCOIN"
                    src="/img/gcoin.svg"
                    width={24}
                    height={24}
                  />
                  <label>
                    {formatNumber(amount, { decimals: GCOIN_DECIMALS })}
                  </label>
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
                        "cursor-progress": loadingIndexes[index],
                        "cursor-pointer hover:bg-accent-active":
                          !isLocked && !loadingIndexes[index],
                        "opacity-80 text-black text-opacity-50": isLocked,
                      },
                      "rounded-md w-32 py-2 bg-accent focus:outline-none transition-colors"
                    )}
                    disabled={isLocked || loadingIndexes[index]}
                    onClick={() => handleWithdraw(index)}
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

                  {!isLocked && (
                    <button
                      type="button"
                      className={classNames(
                        {
                          "cursor-progress": loadingIndexes[index],
                          "cursor-pointer hover:bg-accent-active":
                            !loadingIndexes[index],
                          "opacity-80 text-black text-opacity-50": isLocked,
                        },
                        "rounded-md w-32 py-2 bg-accent focus:outline-none transition-colors"
                      )}
                      disabled={loadingIndexes[index]}
                      onClick={() => handleClaim(index)}
                    >
                      {isPausedResult.data === true ? (
                        "Staking Unavailable"
                      ) : loadingIndexes[index] ? (
                        <span className="flex items-center gap-2 justify-center">
                          <CgSpinner className="animate-spin" /> Submitting...
                        </span>
                      ) : (
                        "Claim Rewards"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        }
      )}
    </>
  );
}
