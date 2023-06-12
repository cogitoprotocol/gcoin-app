import classNames from "classnames";
import { CgSpinner } from "react-icons/cg";

export enum FormState {
  READY,
  LOADING,
  DISABLED,
}

export default function SubmitButton({
  state,
  isConnected,
  value,
}: {
  state: FormState;
  isConnected: boolean;
  value: string;
}) {
  return (
    <button
      type="submit"
      className={classNames(
        {
          "cursor-progress": state === FormState.LOADING,
          "cursor-not-allowed opacity-60": state === FormState.DISABLED,
          "text-black text-opacity-30": state !== FormState.READY,
          "cursor-pointer hover:bg-accent-active": state === FormState.READY,
        },
        "mt-4 rounded-md w-full p-4 bg-accent focus:outline-none transition-all"
      )}
      disabled={state !== FormState.READY}
    >
      {state === FormState.LOADING ? (
        <span className="flex items-center gap-2 justify-center">
          <CgSpinner className="animate-spin" /> Submitting...
        </span>
      ) : isConnected ? (
        value
      ) : (
        "Connect Wallet"
      )}
    </button>
  );
}
