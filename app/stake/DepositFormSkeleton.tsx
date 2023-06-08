import EmptyText from "@/components/common/EmptyText";
import TextSkeleton from "@/components/common/TextSkeleton";
import {
  GCOIN_MAX_STAKING_DURATION_DAYS,
  GCOIN_MIN_STAKING_DURATION_DAYS,
} from "@/lib/constants";
import { pluralize } from "@/lib/numbers";

export default function DepositFormSkeleton() {
  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="w-full rounded-md p-4 flex flex-col gap-2 animate-pulse bg-zinc-500 dark:bg-zinc-900 opacity-30">
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

      <div className="w-full flex flex-col gap-4">
        <div className="flex justify-between text-xl">
          <label>Stake for</label>
          <TextSkeleton className="w-24" />
        </div>
        <input
          type="range"
          min={GCOIN_MIN_STAKING_DURATION_DAYS}
          max={GCOIN_MAX_STAKING_DURATION_DAYS}
          defaultValue={GCOIN_MIN_STAKING_DURATION_DAYS}
          step={7}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-black opacity-50"
        />
        <div className="-mt-2 flex justify-between opacity-50 text-sm">
          <div className="cursor-pointer hover:underline">
            {GCOIN_MIN_STAKING_DURATION_DAYS}{" "}
            {pluralize("day", GCOIN_MIN_STAKING_DURATION_DAYS)}
          </div>
          <div className="cursor-pointer hover:underline">
            {GCOIN_MAX_STAKING_DURATION_DAYS / 365} years
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 rounded-md w-full p-4 animate-pulse bg-zinc-500 dark:bg-zinc-900 opacity-30"
        disabled
      >
        Stake
      </button>
    </div>
  );
}
