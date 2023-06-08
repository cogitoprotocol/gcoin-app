"use client";

import { USDC_DECIMALS } from "@/lib/constants";
import { formatNumber } from "@/lib/numbers";
import { getContractAddresses } from "@/lib/wagmi";
import { usdTestABI, useErc20BalanceOf } from "@/lib/wagmiHooks";
import {
  useAddRecentTransaction,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import { waitForTransaction, writeContract } from "@wagmi/core";
import classNames from "classnames";
import Image from "next/image";
import { FormEventHandler, useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { useAccount } from "wagmi";
import usdcSvg from "../img/usdc.svg";

enum FormState {
  READY,
  LOADING,
  DISABLED,
}

export default function ClaimForm() {
  const userAccount = useAccount();

  const usdTestAddress = getContractAddresses().USDTest;
  const [formState, setFormState] = useState(FormState.READY);
  useEffect(() => {
    setFormState(
      userAccount.isDisconnected ? FormState.DISABLED : FormState.READY
    );
  }, [userAccount.isDisconnected]);

  // User balances
  const balanceResult = useErc20BalanceOf(
    !!userAccount.address
      ? {
          address: usdTestAddress,
          args: [userAccount.address],
          watch: true,
        }
      : undefined
  );

  // Form submission
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

    setFormState(FormState.LOADING);

    // tx: claim
    try {
      const { hash } = await writeContract({
        address: usdTestAddress,
        abi: usdTestABI,
        functionName: "claim",
      });
      addRecentTransaction({ hash, description: "Claim USDTest" });

      console.log(`claim`, hash);
      const data = await waitForTransaction({
        hash,
      });
      console.log(`claim`, data);
    } catch (error) {
      console.warn(`claim`, error);
    }
    setFormState(FormState.READY);
  };

  return (
    <form
      className="w-full flex flex-col items-center gap-4"
      onSubmit={onSubmit}
    >
      <div className="w-full rounded-md bg-black bg-opacity-50 p-4 flex flex-col gap-2 focus-within:outline-purple-400 focus-within:outline focus-within:outline-2">
        <div className="flex justify-between text-sm">
          <label className="text-gray-400">Balance</label>
        </div>

        <div className="flex text-2xl">
          <span className="w-full">
            {balanceResult.data
              ? formatNumber(balanceResult.data, { decimals: USDC_DECIMALS })
              : "0"}
          </span>

          <Image alt="USDC" src={usdcSvg} width={24} height={24} />
          <label className="ml-2 text-white">USDTest</label>
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
        {formState === FormState.LOADING ? (
          <span className="flex items-center gap-2 justify-center">
            <CgSpinner className="animate-spin" /> Submitting...
          </span>
        ) : userAccount.isConnected ? (
          "Claim 1000 USDTest"
        ) : (
          "Connect Wallet"
        )}
      </button>
    </form>
  );
}
