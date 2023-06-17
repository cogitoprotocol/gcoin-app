"use client";

import {
  useAddRecentTransaction,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import {
  erc20ABI,
  readContract,
  waitForTransaction,
  writeContract,
} from "@wagmi/core";
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

export default function TradeForm() {
  const userAccount = useAccount();

  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");

  const inputAddress = usdTestAddress;
  const outputAddress = gCoinAddress;
  const inputSymbolResult = useErc20Symbol({
    address: inputAddress,
  });
  const inputDecimalsResult = useErc20Decimals({
    address: inputAddress,
  });
  const inputDecimals = inputDecimalsResult.data ?? USDC_DECIMALS;

  const [formState, setFormState] = useState(FormState.READY);
  useEffect(() => {
    if (userAccount.isConnected) {
      validateInput();
    }
  }, [userAccount.isConnected]);

  // User balances
  const inputBalanceResult = useErc20BalanceOf(
    !!userAccount.address
      ? {
          address: inputAddress,
          args: [userAccount.address],
          watch: true,
        }
      : undefined
  );
  const setToMax = () =>
    setInputValue(
      toBigWithDecimals(inputBalanceResult.data ?? 0, -inputDecimals).toString()
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

  const [needsAllowance, setNeedsAllowance] = useState(false);

  const checkAllowance = async () => {
    const value = toBigIntWithDecimals(inputValue, inputDecimals);
    if (!!userAccount.address && !!value) {
      try {
        const allowance = await readContract({
          address: inputAddress,
          abi: erc20ABI,
          functionName: "allowance",
          args: [userAccount.address, gCoinAddress],
        });
        setNeedsAllowance(allowance < value);
      } catch (err) {
        console.warn(`allowance`, err);
      }
    }
  };

  const getExpectedOutput = async (value: bigint) => {
    try {
      const output = await readContract({
        address: gCoinAddress,
        abi: gCoinABI,
        functionName: "getGCoinOutputFromStable",
        args: [inputAddress, value],
      });
      setOutputValue(toBigWithDecimals(output, -GCOIN_DECIMALS).toString());
      if (inputBalanceResult.data != null && value <= inputBalanceResult.data) {
        setFormState(FormState.READY);
      }
    } catch (err) {
      console.warn(`getGCoinOutputFromStable`, err);
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

    const value = toBigIntWithDecimals(inputValue, inputDecimals);
    if (value <= 0) {
      setFormState(FormState.DISABLED);
      return;
    }

    getExpectedOutput(value);

    if (inputBalanceResult.data != null && value > inputBalanceResult.data) {
      setFormState(FormState.DISABLED);
      return;
    }

    checkAllowance();
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

    const value = toBigIntWithDecimals(inputValue, inputDecimals);
    if (value < 0) return;

    setFormState(FormState.LOADING);

    if (needsAllowance) {
      // tx: approve
      try {
        const { hash } = await writeContract({
          address: inputAddress,
          abi: gCoinABI,
          functionName: "approve",
          args: [gCoinAddress, value],
        });
        addRecentTransaction({
          hash,
          description: `Approve ${inputSymbolResult?.data}`,
        });

        console.log(`approve`, hash);
        const data = await waitForTransaction({
          hash,
        });
        console.log(`approve`, data);
      } catch (error) {
        console.warn(`approve`, error);
        setFormState(FormState.READY);
        setError(getRevertError(error));
        return;
      }
    }

    // tx: depositStableCoin
    try {
      const { hash } = await writeContract({
        address: gCoinAddress,
        abi: gCoinABI,
        functionName: "depositStableCoin",
        args: [inputAddress, value],
      });
      addRecentTransaction({ hash, description: "Mint GCOIN" });

      console.log(`depositStableCoin`, hash);
      const data = await waitForTransaction({
        hash,
      });
      console.log(`depositStableCoin`, data);
    } catch (error) {
      console.warn(`depositStableCoin`, error);
      setError(getRevertError(error));
    }
    checkAllowance();
    setFormState(FormState.READY);
  };

  return (
    <form className="flex flex-col items-center gap-4" onSubmit={onSubmit}>
      <BalanceInput
        onClickBalance={setToMax}
        balance={inputBalanceResult.data}
        decimals={inputDecimalsResult.data}
        value={inputValue}
        onChange={setInputValue}
        logo="/img/usdc.svg"
        symbol={inputSymbolResult?.data}
      />

      <BsArrowDown />

      <BalanceInput
        balance={outputBalanceResult.data}
        decimals={GCOIN_DECIMALS}
        value={outputValue}
        logo="/img/gcoin.svg"
        symbol="GCOIN"
      />

      <SubmitButton
        state={formState}
        value={
          gcoinPausedResult.data
            ? "Minting Paused"
            : needsAllowance
            ? `Approve ${inputSymbolResult?.data}`
            : "Swap"
        }
        isConnected={userAccount.isConnected}
      />

      {!!error && <Alert title="Error">{error}</Alert>}
    </form>
  );
}
