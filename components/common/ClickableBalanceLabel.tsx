import EmptyText from "@/components/common/EmptyText";
import { GCOIN_DECIMALS } from "@/lib/constants";
import { formatNumber } from "@/lib/numbers";
import classNames from "classnames";

export default function ClickableBalanceLabel({
  value,
  decimals = GCOIN_DECIMALS,
  onClick,
}: {
  value?: BigInt;
  decimals?: number;
  onClick?: () => void;
}) {
  const handleClick = () => {
    if (onClick != null) onClick();
  };

  return value != null ? (
    <span className="inline-flex gap-2">
      <a
        className={classNames(
          { "cursor-pointer": onClick != null },
          "text-purple-300"
        )}
        onClick={handleClick}
      >
        {formatNumber(value, { decimals })}
      </a>
      {onClick != undefined && (
        <a
          className="cursor-pointer hover:underline text-amber-300"
          onClick={handleClick}
        >
          Max
        </a>
      )}
    </span>
  ) : (
    <EmptyText />
  );
}
