import BalanceInputSkeleton from "components/skeleton/BalanceInputSkeleton";
import { SubmitButtonSkeleton } from "components/skeleton/SubmitButtonSkeleton";

export default function ClaimFormSkeleton() {
  return (
    <div className="w-full flex flex-col items-center gap-4">
      <BalanceInputSkeleton logo="/img/usdc.svg" symbol="USDTest" />

      <SubmitButtonSkeleton>Claim 1000 USDTest</SubmitButtonSkeleton>
    </div>
  );
}
