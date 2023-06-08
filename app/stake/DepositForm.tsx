"use client";

import ClickableBalanceLabel from "@/components/common/ClickableBalanceLabel";
import ClientOnly from "@/components/common/ClientOnly";
import SubmitButton from "@/components/common/SubmitButton";
import {
  GCOIN_DECIMALS,
  GCOIN_MAX_STAKING_DURATION_DAYS,
  GCOIN_MIN_STAKING_DURATION_DAYS,
  SECONDS_IN_DAY,
} from "@/lib/constants";
import { getRevertError } from "@/lib/errors";
import { formatNumber, pluralize, withDecimals } from "@/lib/numbers";
import { useCgvPrice, useGcoinPrice } from "@/lib/prices";
import {
  gCoinAddress,
  gCoinStakingABI,
  gCoinStakingAddress,
  useGCoinBalanceOf,
  useGCoinStakingPaused,
} from "@/lib/wagmiHooks";
import {
  useAddRecentTransaction,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import { readContract, waitForTransaction, writeContract } from "@wagmi/core";
import { DateTime } from "luxon";
import Image from "next/image";
import { FormEventHandler, useEffect, useState } from "react";
import { Address, erc20ABI, useAccount } from "wagmi";
import gcoinSvg from "../img/gcoin.svg";
import DepositFormSkeleton from "./DepositFormSkeleton";

enum FormState {
  READY,
  LOADING,
  DISABLED,
}

const daysToSeconds = (d: number) => BigInt(d * SECONDS_IN_DAY);

export default function DepositForm() {
  const userAccount = useAccount();

  const [inputValue, setInputValue] = useState("");
  const [durationDays, setDurationDays] = useState(28);
  const [rewardsRate, setRewardsRate] = useState<number>();
  const gcoinPrice = useGcoinPrice();
  const cgvPrice = useCgvPrice();

  const [formState, setFormState] = useState(FormState.READY);
  useEffect(() => {
    if (userAccount.isConnected) {
      validateInput();
    }
  }, [userAccount.isConnected]);

  // User info
  const gcoinBalanceResult = useGCoinBalanceOf({
    args: [userAccount.address as Address],
    watch: !!userAccount.address,
    enabled: !!userAccount.address,
  });
  const setToMax = () =>
    setInputValue(
      gcoinBalanceResult.data == null
        ? ""
        : String(Number(gcoinBalanceResult.data) / Math.pow(10, GCOIN_DECIMALS))
    );

  // Allowance
  const [needsAllowance, setNeedsAllowance] = useState(false);
  const checkAllowance = async () => {
    const value = withDecimals(inputValue, GCOIN_DECIMALS);
    if (!!userAccount.address && !!value) {
      try {
        const allowance = await readContract({
          address: gCoinAddress,
          abi: erc20ABI,
          functionName: "allowance",
          args: [userAccount.address, gCoinStakingAddress],
        });
        setNeedsAllowance(allowance < value);
      } catch (err) {
        console.warn(`allowance`, err);
      }
    }
  };

  // Disable form if paused
  const isPausedResult = useGCoinStakingPaused();
  useEffect(() => {
    if (isPausedResult.data) {
      setFormState(FormState.DISABLED);
    }
  }, [isPausedResult.data]);

  // Validate form when input is changed
  const validateInput = () => {
    if (userAccount.isConnected && !inputValue) {
      setFormState(FormState.DISABLED);
      return;
    }

    const value = withDecimals(inputValue, GCOIN_DECIMALS);
    console.log(`value`, value);
    console.log(`gcoinBalanceResult.data`, gcoinBalanceResult.data);
    if (
      value <= 0 ||
      (gcoinBalanceResult.data != null && value > gcoinBalanceResult.data)
    ) {
      setFormState(FormState.DISABLED);
      return;
    }

    checkAllowance();
    setFormState(FormState.READY);
  };
  useEffect(validateInput, [inputValue]);
  useEffect(() => {
    (async () => {
      const rate = await readContract({
        address: gCoinStakingAddress,
        abi: gCoinStakingABI,
        functionName: "calculateRewardRate",
        args: [daysToSeconds(durationDays)],
      });
      setRewardsRate((Number(rate) / gcoinPrice) * cgvPrice);
    })();
  }, [durationDays, gcoinPrice, cgvPrice]);

  // Form submission
  const [error, setError] = useState("");
  const { openConnectModal } = useConnectModal();
  const addRecentTransaction = useAddRecentTransaction();
  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    // Connect if needed
    if (!userAccount.isConnected) {
      if (openConnectModal) {
        openConnectModal();
      }
      return;
    }

    if (!inputValue) return;

    const value = withDecimals(inputValue, GCOIN_DECIMALS);
    if (value < 0) return;

    setFormState(FormState.LOADING);

    if (needsAllowance) {
      // tx: approve
      try {
        const { hash } = await writeContract({
          address: gCoinAddress,
          abi: erc20ABI,
          functionName: "approve",
          args: [gCoinStakingAddress, value],
        });
        addRecentTransaction({
          hash,
          description: "Approve GCOIN for Staking",
        });

        console.log(`approve`, hash);
        const data = await waitForTransaction({
          hash,
        });
        console.log(`approve`, data);
      } catch (error) {
        console.warn(`approve`, error);
        setFormState(FormState.READY);
        return;
      }
    }

    // tx: stake
    try {
      const { hash } = await writeContract({
        address: gCoinStakingAddress,
        abi: gCoinStakingABI,
        functionName: "stake",
        args: [value, daysToSeconds(durationDays)],
      });
      addRecentTransaction({ hash, description: "Stake GCOIN" });

      console.log(`stake`, hash);
      const data = await waitForTransaction({
        hash,
      });
      console.log(`stake`, data);
    } catch (error) {
      console.warn(`stake`, error);
      const reason = getRevertError(error);
      setError(reason ? reason : "Error");
    }
    setFormState(FormState.READY);
  };

  const now = DateTime.now();

  return (
    <ClientOnly fallback={<DepositFormSkeleton />}>
      <form
        className="w-full flex flex-col items-center gap-4"
        onSubmit={onSubmit}
      >
        <div className="w-full rounded-md bg-black bg-opacity-10 dark:bg-opacity-50 p-4 flex flex-col gap-2 focus-within:outline-accent focus-within:outline focus-within:outline-2">
          <div className="flex justify-between text-sm">
            <label className="text-gray-600 dark:text-gray-400">Balance</label>

            <ClickableBalanceLabel
              onClick={setToMax}
              value={gcoinBalanceResult.data}
            />
          </div>

          <div className="flex text-2xl items-center">
            <input
              type="number"
              placeholder="0"
              className="bg-transparent w-full focus:outline-none"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              maxLength={40}
              autoComplete="off"
            />

            <Image alt="GCOIN" src={gcoinSvg} width={24} height={24} />
            <label className="ml-2">GCOIN</label>
          </div>
        </div>

        <div className="w-full flex flex-col">
          <div>
            <span className="font-light">Stake until </span>
            <span className="font-medium">
              {now
                .plus({ days: durationDays })
                .toLocaleString(DateTime.DATETIME_FULL)}
            </span>
          </div>
          <div className="">
            <span className="font-light">Expected APY: </span>
            <span className="font-medium">
              {rewardsRate != null
                ? `${formatNumber(rewardsRate, { digits: 2 })}%`
                : null}
            </span>
          </div>
          <input
            type="range"
            min={GCOIN_MIN_STAKING_DURATION_DAYS}
            max={GCOIN_MAX_STAKING_DURATION_DAYS}
            value={durationDays}
            onChange={(e) => setDurationDays(Number(e.target.value))}
            step={7}
            className="mt-4 w-full h-2 rounded-lg appearance-none cursor-pointer bg-black opacity-50"
          />
          <div className="mt-2 flex justify-between opacity-50 text-sm">
            <div
              className="cursor-pointer hover:underline"
              onClick={() => setDurationDays(GCOIN_MIN_STAKING_DURATION_DAYS)}
            >
              {GCOIN_MIN_STAKING_DURATION_DAYS}{" "}
              {pluralize("day", GCOIN_MIN_STAKING_DURATION_DAYS)}
            </div>
            <div
              className="cursor-pointer hover:underline"
              onClick={() => setDurationDays(GCOIN_MAX_STAKING_DURATION_DAYS)}
            >
              {GCOIN_MAX_STAKING_DURATION_DAYS / 365} years
            </div>
          </div>
        </div>

        <SubmitButton
          state={formState}
          value={needsAllowance ? "Approve GCOIN" : "Stake"}
          isConnected={userAccount.isConnected}
        />

        {error}
      </form>
    </ClientOnly>
  );
}
