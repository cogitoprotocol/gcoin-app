import EmptyText from "@/components/common/EmptyText";

export default function DepositFormSkeleton() {
  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="w-full rounded-md p-4 flex flex-col gap-2 animate-pulse bg-zinc-900 opacity-30">
        <div className="flex justify-between text-sm">
          <label className="text-gray-400">Balance</label>

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

      <button
        type="submit"
        className="mt-4 rounded-md w-full p-4 animate-pulse bg-zinc-900 opacity-30"
        disabled
      >
        Stake
      </button>
    </div>
  );
}
