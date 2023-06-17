"use client";

import {
  useAddRecentTransaction,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import { readContract, waitForTransaction, writeContract } from "@wagmi/core";
import Alert from "components/common/Alert";
import BalanceInput from "components/common/BalanceInput";
import SubmitButton, { FormState } from "components/common/SubmitButton";
import { GCOIN_DECIMALS, USDC_DECIMALS } from "lib/constants";
import { getRevertError } from "lib/errors";
import { toBigIntWithDecimals, toBigWithDecimals } from "lib/numbers";
import {
  gCoinABI,
  gCoinAddress,
  usdTestAddress,
  useErc20BalanceOf,
  useErc20Decimals,
  useErc20Symbol,
  useGCoinPaused,
} from "lib/wagmiHooks";
import { FormEventHandler, useEffect, useState } from "react";
import { BsArrowDown } from "react-icons/bs";
import { useAccount } from "wagmi";

export default function RedeemForm() {
  const userAccount = useAccount();

  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");

  const outputAddress = usdTestAddress;
  const outputSymbolResult = useErc20Symbol({
    address: outputAddress,
  });
  const outputDecimalsResult = useErc20Decimals({
    address: outputAddress,
  });
  const outputDecimals = outputDecimalsResult.data ?? USDC_DECIMALS;

  const [formState, setFormState] = useState(FormState.READY);
  useEffect(() => {
    if (userAccount.isConnected) {
      validateInput();
    }
  }, [userAccount.isConnected]);

  // User balances
  const gcoinBalanceResult = useErc20BalanceOf(
    !!userAccount.address
      ? {
          address: gCoinAddress,
          args: [userAccount.address],
          watch: true,
        }
      : undefined
  );
  const setToMax = () =>
    setInputValue(
      toBigWithDecimals(
        gcoinBalanceResult.data ?? 0,
        -GCOIN_DECIMALS
      ).toString()
    );

  const outputBalanceResult = useErc20BalanceOf(
    !!userAccount.address
      ? {
          address: outputAddress,
          args: [userAccount.address],
          watch: true,
        }
      : undefined
  );

  const getExpectedOutput = async (value: bigint) => {
    try {
      const output = await readContract({
        address: gCoinAddress,
        abi: gCoinABI,
        functionName: "getStableOutputFromGcoin",
        args: [outputAddress, value],
      });
      setOutputValue(toBigWithDecimals(output, -outputDecimals).toString());
      if (gcoinBalanceResult.data != null && value <= gcoinBalanceResult.data) {
        setFormState(FormState.READY);
      }
    } catch (err) {
      console.warn(`getStableOutputFromGcoin`, err);
    }
  };

  // Disable form if paused
  const gcoinPausedResult = useGCoinPaused();
  useEffect(() => {
    if (gcoinPausedResult.data) {
      setFormState(FormState.DISABLED);
    }
  }, [gcoinPausedResult.data]);

  // Validate form when input is changed
  const validateInput = () => {
    if (!userAccount.isConnected) {
      return;
    }
    if (userAccount.isConnected && !inputValue) {
      setFormState(FormState.DISABLED);
      setOutputValue("");
      return;
    }

    const value = toBigIntWithDecimals(inputValue, GCOIN_DECIMALS);
    if (value <= 0) {
      setFormState(FormState.DISABLED);
      return;
    }

    getExpectedOutput(value);

    if (gcoinBalanceResult.data != null && value > gcoinBalanceResult.data) {
      setFormState(FormState.DISABLED);
      return;
    }
  };
  useEffect(validateInput, [inputValue]);

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

    if (!inputValue) {
      return;
    }

    const value = toBigIntWithDecimals(inputValue, GCOIN_DECIMALS);
    if (value < 0) return;

    setFormState(FormState.LOADING);

    // tx: withdrawStableCoin
    try {
      const { hash } = await writeContract({
        address: gCoinAddress,
        abi: gCoinABI,
        functionName: "withdrawStableCoin",
        args: [outputAddress, value],
      });
      addRecentTransaction({ hash, description: "Redeem GCOIN" });

      console.log(`withdrawStableCoin`, hash);
      const data = await waitForTransaction({
        hash,
      });
      console.log(`withdrawStableCoin`, data);
    } catch (error) {
      console.warn(`withdrawStableCoin`, error);
      setError(getRevertError(error));
    }
    setFormState(FormState.READY);
  };

  return (
    <form className="flex flex-col items-center gap-4" onSubmit={onSubmit}>
      <BalanceInput
        onClickBalance={setToMax}
        balance={gcoinBalanceResult.data}
        decimals={GCOIN_DECIMALS}
        value={inputValue}
        onChange={setInputValue}
        logo="/img/gcoin.svg"
        symbol="GCOIN"
      />

      <BsArrowDown />

      <BalanceInput
        balance={outputBalanceResult.data}
        value={outputValue}
        logo="/img/usdc.svg"
        symbol={outputSymbolResult.data}
      />

      <SubmitButton
        state={formState}
        value={
          gcoinPausedResult.data
            ? "Redemptions Paused"
            : `Redeem GCOIN for ${outputSymbolResult.data}`
        }
        isConnected={userAccount.isConnected}
      />

      {!!error && <Alert title="Error">{error}</Alert>}
    </form>
  );
}
