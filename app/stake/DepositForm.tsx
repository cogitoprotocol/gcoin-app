"use client";

import ClickableBalanceLabel from "@/components/common/ClickableBalanceLabel";
import ClientOnly from "@/components/common/ClientOnly";
import { GCOIN_DECIMALS } from "@/lib/constants";
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
import classNames from "classnames";
import Image from "next/image";
import { FormEventHandler, useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { Address, erc20ABI, useAccount } from "wagmi";
import gcoinSvg from "../img/gcoin.svg";
import DepositFormSkeleton from "./DepositFormSkeleton";

enum FormState {
  READY,
  LOADING,
  DISABLED,
}

const MIN_DURATION = 7; // 7 days
const MAX_DURATION = 4 * 365; // 4 years
const SECONDS_IN_DAY = 86400;
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
  }, [durationDays]);

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

  return (
    <ClientOnly fallback={<DepositFormSkeleton />}>
      <form
        className="w-full flex flex-col items-center gap-4"
        onSubmit={onSubmit}
      >
        <div className="w-full rounded-md bg-black bg-opacity-50 p-4 flex flex-col gap-2 focus-within:outline-purple-400 focus-within:outline focus-within:outline-2">
          <div className="flex justify-between text-sm">
            <label className="text-gray-400">Balance</label>

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
            <label className="ml-2 text-white">GCOIN</label>
          </div>
        </div>

        <div className="w-full flex flex-col gap-4">
          <div className="flex justify-between text-xl">
            <label htmlFor="steps-range" className=" text-white">
              Stake for {durationDays} {pluralize("day", durationDays)}
            </label>
            <label className="">
              {rewardsRate != null
                ? `${formatNumber(rewardsRate, { digits: 2 })}%`
                : null}{" "}
              APY
            </label>
          </div>
          <input
            type="range"
            min={MIN_DURATION}
            max={MAX_DURATION}
            value={durationDays}
            onChange={(e) => setDurationDays(Number(e.target.value))}
            step={7}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-black opacity-50"
          />
          <div className="-mt-2 flex justify-between opacity-50 text-sm">
            <div
              className="cursor-pointer hover:underline"
              onClick={() => setDurationDays(MIN_DURATION)}
            >
              {MIN_DURATION} {pluralize("day", MIN_DURATION)}
            </div>
            <div
              className="cursor-pointer hover:underline"
              onClick={() => setDurationDays(MAX_DURATION)}
            >
              {MAX_DURATION / 365} years
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={classNames(
            {
              "cursor-progress": formState === FormState.LOADING,
              "cursor-not-allowed": formState === FormState.DISABLED,
              "text-gray-400": formState !== FormState.READY,
              "cursor-pointer text-white hover:bg-purple-600":
                formState === FormState.READY,
            },
            "mt-4 rounded-md w-full p-4 bg-purple-500 bg-opacity-50 focus:outline-none transition-colors"
          )}
          disabled={formState !== FormState.READY}
        >
          {isPausedResult.data === true ? (
            "Staking Unavailable"
          ) : formState === FormState.LOADING ? (
            <span className="flex items-center gap-2 justify-center">
              <CgSpinner className="animate-spin" /> Submitting...
            </span>
          ) : userAccount.isConnected ? (
            needsAllowance ? (
              "Approve GCOIN"
            ) : (
              "Stake"
            )
          ) : (
            "Connect Wallet"
          )}
        </button>

        {error}
      </form>
    </ClientOnly>
  );
}
