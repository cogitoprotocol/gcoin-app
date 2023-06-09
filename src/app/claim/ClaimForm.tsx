"use client";

import {
  useAddRecentTransaction,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import { waitForTransaction, writeContract } from "@wagmi/core";
import Alert from "components/common/Alert";
import ClientOnly from "components/common/ClientOnly";
import SubmitButton, { FormState } from "components/common/SubmitButton";
import { USDC_DECIMALS } from "lib/constants";
import { getRevertError } from "lib/errors";
import { formatNumber } from "lib/numbers";
import { usdTestABI, usdTestAddress, useErc20BalanceOf } from "lib/wagmiHooks";
import Image from "next/image";
import { FormEventHandler, useState } from "react";
import { useAccount } from "wagmi";
import ClaimFormSkeleton from "./ClaimFormSkeleton";

export default function ClaimForm() {
  const userAccount = useAccount();

  const [formState, setFormState] = useState(FormState.READY);
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
      setError(getRevertError(error));
    }
    setFormState(FormState.READY);
  };

  return (
    <ClientOnly fallback={<ClaimFormSkeleton />}>
      <form
        className="w-full flex flex-col items-center gap-4"
        onSubmit={onSubmit}
      >
        <div className="w-full rounded-md bg-black bg-opacity-5 dark:bg-opacity-30 p-4 flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <label className="text-gray-600 dark:text-gray-400">Balance</label>
          </div>

          <div className="flex text-2xl">
            <span className="w-full">
              {balanceResult.data
                ? formatNumber(balanceResult.data, { decimals: USDC_DECIMALS })
                : "0"}
            </span>

            <Image alt="USDC" src="/img/usdc.svg" width={24} height={24} />
            <label className="ml-2">USDTest</label>
          </div>
        </div>

        <SubmitButton
          state={formState}
          value="Claim 1000 USDTest"
          isConnected={userAccount.isConnected}
        />

        {!!error && <Alert title="Error">{error}</Alert>}
      </form>
    </ClientOnly>
  );
}
