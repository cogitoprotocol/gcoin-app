import EmptyText from "components/common/EmptyText";
import Image from "next/image";

export default function ClaimFormSkeleton() {
  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="w-full rounded-md p-4 flex flex-col gap-2 animate-pulse bg-zinc-500 dark:bg-zinc-900 opacity-30">
        <div className="flex justify-between text-sm">
          <label className="text-gray-600 dark:text-gray-400">Balance</label>
        </div>

        <div className="flex text-2xl">
          <span className="w-full">
            <EmptyText />
          </span>
          <Image alt="USDC" src="/img/usdc.svg" width={24} height={24} />
          <label className="ml-2">USDTest</label>
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 rounded-md w-full p-4 animate-pulse bg-zinc-500 dark:bg-zinc-900 opacity-30"
        disabled
      >
        Claim 1000 USDTest
      </button>
    </div>
  );
}
