import EmptyText from "components/common/EmptyText";
import Image from "next/image";

export default function BalanceInputSkeleton({
  logo,
  symbol = "",
}: {
  logo?: string;
  symbol?: string;
}) {
  return (
    <div className="w-full rounded-md p-4 flex flex-col gap-2 animate-pulse bg-zinc-500 dark:bg-zinc-900 opacity-30">
      <div className="text-sm">&nbsp;</div>

      <div className="flex text-2xl">
        <span className="w-full">
          <EmptyText />
        </span>
        {!!logo && <Image alt={symbol} src={logo} width={24} height={24} />}
        <label className="ml-2">{symbol}</label>
      </div>
    </div>
  );
}
