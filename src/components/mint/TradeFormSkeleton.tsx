import BalanceInputSkeleton from "components/skeleton/BalanceInputSkeleton";
import { BsArrowDown } from "react-icons/bs";
import { SubmitButtonSkeleton } from "../skeleton/SubmitButtonSkeleton";

export default function TradeFormSkeleton() {
  return (
    <div className="w-full flex flex-col items-center gap-4">
      <BalanceInputSkeleton logo="/img/usdc.svg" symbol="USDTest" />

      <BsArrowDown />

      <BalanceInputSkeleton logo="/img/gcoin.svg" symbol="GCOIN" />

      <SubmitButtonSkeleton>Swap</SubmitButtonSkeleton>
    </div>
  );
}
