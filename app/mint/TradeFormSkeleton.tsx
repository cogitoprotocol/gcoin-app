import EmptyText from "@/components/common/EmptyText";
import Image from "next/image";
import { BsArrowDown } from "react-icons/bs";
import gcoinSvg from "../img/gcoin.svg";

export default function TradeFormSkeleton() {
  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="w-full rounded-md p-4 flex flex-col gap-2 animate-pulse bg-zinc-500 dark:bg-zinc-900 opacity-20">
        <div className="flex justify-between text-sm">
          <label className="text-gray-600 dark:text-gray-400">Balance</label>

          <EmptyText />
        </div>

        <div className="flex text-2xl">
          <input
            type="number"
            placeholder="0"
            className="bg-transparent w-full"
            disabled
          />
        </div>
      </div>

      <BsArrowDown />

      <div className="w-full rounded-md p-4 flex flex-col gap-2 animate-pulse bg-zinc-500 dark:bg-zinc-900 opacity-20">
        <div className="flex justify-between text-sm">
          <label className="text-gray-600 dark:text-gray-400">Balance</label>

          <EmptyText />
        </div>

        <div className="flex text-2xl items-center">
          <input
            type="number"
            placeholder="0"
            className="bg-transparent w-full focus:outline-none"
            disabled
          />

          <Image alt="GCOIN" src={gcoinSvg} width={24} height={24} />
          <label className="ml-2">GCOIN</label>
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 rounded-md w-full p-4 animate-pulse bg-zinc-500 dark:bg-zinc-900 opacity-20"
        disabled
      >
        Swap
      </button>
    </div>
  );
}
