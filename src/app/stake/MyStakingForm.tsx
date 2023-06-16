"use client";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { waitForTransaction, writeContract } from "@wagmi/core";
import classNames from "classnames";
import Alert from "components/common/Alert";
import { FormState } from "components/common/SubmitButton";
import { getRevertError } from "lib/errors";
import {
  gCoinStakingABI,
  gCoinStakingAddress,
  useGCoinStakingGetUserStakingInfoList,
  useGCoinStakingPaused,
} from "lib/wagmiHooks";
import { DateTime } from "luxon";
import { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { Address, useAccount } from "wagmi";
import { SingleStake } from "./SingleStake";

export default function MyStakingForm() {
  const userAccount = useAccount();

  // Form state
  const [withdrawAllFormState, setWithdrawAllFormState] = useState(
    FormState.READY
  );

  // Block timestamp can be used to override the current time
  // const blockTimestamp = useBlockTimestamp();
  const blockTimestamp = null;
  const now =
    blockTimestamp != null
      ? DateTime.fromSeconds(blockTimestamp)
      : DateTime.now();

  // User info
  const userStakingInfoListResult = useGCoinStakingGetUserStakingInfoList({
    args: [userAccount.address as Address],
    watch: !!userAccount.address,
    enabled: !!userAccount.address,
  });

  // Disable form if paused
  const isPausedResult = useGCoinStakingPaused();
  const isPaused = isPausedResult.data === true;

  // Form submission
  const [error, setError] = useState("");
  const addRecentTransaction = useAddRecentTransaction();
  const handleWithdrawAll = async () => {
    setWithdrawAllFormState(FormState.LOADING);

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
    setWithdrawAllFormState(FormState.READY);
  };

  if (!userAccount.address) {
    return (
      <div className="h-16 bg-black/5 flex items-center justify-center text-sm">
        Connect wallet to view your staked GCOIN.
      </div>
    );
  }

  if (!userStakingInfoListResult.data) {
    return <div className="h-24 rounded-md bg-black/10 animate-pulse" />;
  }

  if (userStakingInfoListResult.data.length == 0) {
    return (
      <div className="h-16 bg-black/5 flex items-center justify-center text-sm">
        No GCOIN staked.
      </div>
    );
  }

  const canWithdraw = userStakingInfoListResult.data.some(
    ({ timestamp, duration }) => Number(timestamp + duration) < now.toSeconds()
  );

  return (
    <>
      {canWithdraw && (
        <div className="pb-4">
          <button
            type="button"
            className={classNames(
              {
                "cursor-progress": withdrawAllFormState === FormState.LOADING,
                "cursor-not-allowed opacity-60": isPaused,
                "text-black text-opacity-30":
                  isPaused || withdrawAllFormState !== FormState.READY,
                "cursor-pointer hover:bg-accent-active":
                  withdrawAllFormState === FormState.READY,
              },
              "rounded-md w-48 py-2 bg-accent focus:outline-none transition-colors"
            )}
            disabled={isPaused || withdrawAllFormState !== FormState.READY}
            onClick={handleWithdrawAll}
          >
            {isPaused ? (
              "Staking Unavailable"
            ) : withdrawAllFormState === FormState.LOADING ? (
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

      {userStakingInfoListResult.data.map((stake, index) => (
        <SingleStake
          key={index}
          now={now}
          index={index}
          isPaused={isPaused}
          stake={stake}
        />
      ))}
    </>
  );
}
