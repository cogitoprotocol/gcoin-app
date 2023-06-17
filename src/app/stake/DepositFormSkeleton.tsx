import BalanceInputSkeleton from "components/skeleton/BalanceInputSkeleton";
import { SubmitButtonSkeleton } from "components/skeleton/SubmitButtonSkeleton";
import TextSkeleton from "components/skeleton/TextSkeleton";
import {
  GCOIN_MAX_STAKING_DURATION_DAYS,
  GCOIN_MIN_STAKING_DURATION_DAYS,
} from "lib/constants";
import { pluralize } from "lib/numbers";

export default function DepositFormSkeleton() {
  return (
    <div className="w-full flex flex-col items-center gap-4">
      <BalanceInputSkeleton logo="/img/gcoin.svg" symbol="GCOIN" />

      <div className="w-full flex flex-col">
        <div>
          <span className="font-light">Stake until </span>
          <TextSkeleton className="w-32 h-3" />
        </div>
        <div className="">
          <span className="font-light">Expected APY: </span>
          <TextSkeleton className="w-24 h-3" />
        </div>
        <input
          type="range"
          min={GCOIN_MIN_STAKING_DURATION_DAYS}
          max={GCOIN_MAX_STAKING_DURATION_DAYS}
          defaultValue={GCOIN_MIN_STAKING_DURATION_DAYS}
          step={7}
          className="mt-4 w-full h-2 rounded-lg appearance-none cursor-pointer bg-black opacity-50"
        />
        <div className="mt-2 flex justify-between opacity-50 text-sm">
          <div className="cursor-pointer hover:underline">
            {GCOIN_MIN_STAKING_DURATION_DAYS}{" "}
            {pluralize("day", GCOIN_MIN_STAKING_DURATION_DAYS)}
          </div>
          <div className="cursor-pointer hover:underline">
            {GCOIN_MAX_STAKING_DURATION_DAYS / 365} years
          </div>
        </div>
      </div>

      <SubmitButtonSkeleton>Stake</SubmitButtonSkeleton>
    </div>
  );
}
