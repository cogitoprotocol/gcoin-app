import classNames from "classnames";
import EmptyText from "components/common/EmptyText";
import { GCOIN_DECIMALS } from "lib/constants";
import { formatNumber } from "lib/numbers";

export default function ClickableBalanceLabel({
  value,
  decimals = GCOIN_DECIMALS,
  onClick,
}: {
  value?: bigint;
  decimals?: number;
  onClick?: () => void;
}) {
  const handleClick = () => {
    if (onClick != null) onClick();
  };

  return value != null ? (
    <span className="inline-flex gap-2">
      <span className="text-gray-600 dark:text-gray-400">Balance</span>
      <a
        className={classNames({
          "cursor-pointer hover:underline": onClick != null,
        })}
        onClick={handleClick}
      >
        {formatNumber(value, { decimals })}
      </a>
      {onClick != undefined && (
        <a
          className="cursor-pointer hover:underline text-accent"
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
