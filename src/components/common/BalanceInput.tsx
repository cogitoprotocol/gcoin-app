"use client";

import Image from "next/image";
import ClickableBalanceLabel from "./ClickableBalanceLabel";

export default function BalanceInput({
  onClickBalance,
  balance,
  decimals,
  value,
  onChange,
  logo,
  symbol = "",
}: {
  onClickBalance?: () => void;
  balance?: bigint;
  decimals?: number;
  value: string;
  onChange?: (s: string) => void;
  logo?: string;
  symbol?: string;
}) {
  return (
    <div className="rounded-md bg-black bg-opacity-10 dark:bg-opacity-50 p-4 flex flex-col gap-2 focus-within:outline-accent focus-within:outline focus-within:outline-2">
      <div className="text-right text-sm">
        <ClickableBalanceLabel
          onClick={onClickBalance}
          value={balance}
          decimals={decimals}
        />
      </div>

      <div className="flex text-2xl">
        <input
          type="number"
          placeholder="0"
          className="bg-transparent w-full focus:outline-none"
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          maxLength={40}
          autoComplete="off"
          readOnly={onChange == null}
          disabled={onChange == null}
        />

        {!!logo && <Image alt={symbol} src={logo} width={24} height={24} />}
        <label className="ml-2">{symbol}</label>
      </div>
    </div>
  );
}
