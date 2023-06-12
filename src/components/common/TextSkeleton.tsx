import classNames from "classnames";

export default function TextSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={classNames(
        "rounded-md inline-block animate-pulse bg-zinc-500 dark:bg-zinc-900 opacity-10",
        className
      )}
    />
  );
}
