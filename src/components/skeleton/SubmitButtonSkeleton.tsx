import { ReactNode } from "react";

export function SubmitButtonSkeleton({ children }: { children?: ReactNode }) {
  return (
    <button
      type="submit"
      className="mt-4 rounded-md w-full p-4 animate-pulse bg-zinc-500 dark:bg-zinc-900 opacity-20"
      disabled
    >
      {children}
    </button>
  );
}
