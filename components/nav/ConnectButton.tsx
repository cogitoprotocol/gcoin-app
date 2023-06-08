"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import classNames from "classnames";
import { CgSpinner } from "react-icons/cg";

export default function MyConnectButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            className={classNames(
              {
                "opacity-0 pointer-events-none select-none": !ready,
              },
              "inline-block ml-4 md:ml-0 md:flex-1"
            )}
            {...(!ready && {
              "aria-hidden": true,
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="bg-gradient-to-bl from-violet-600 to-purple-900 px-4 py-3 rounded-md"
                  >
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="bg-zinc-300 dark:bg-zinc-800 dark:text-white px-4 py-3 rounded-md"
                  >
                    Switch network
                  </button>
                );
              }
              return (
                <div className="flex items-center outline outline-zinc-200 dark:outline-zinc-900 shadow-md dark:shadow-none dark:text-white rounded-md">
                  {account.hasPendingTransactions && (
                    <CgSpinner className="animate-spin text-zinc-500" />
                  )}
                  <button
                    type="button"
                    onClick={openChainModal}
                    className="hidden md:flex items-center px-4 py-3 bg-black bg-opacity-0 hover:bg-opacity-5 dark:bg-white dark:bg-opacity-0 dark:hover:bg-opacity-5 transition-opacity"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    <span className="">{chain.name}</span>
                  </button>
                  <button
                    type="button"
                    onClick={openAccountModal}
                    className="px-4 py-3 bg-black bg-opacity-0 hover:bg-opacity-5 dark:bg-white dark:bg-opacity-0 dark:hover:bg-opacity-5 transition-opacity"
                  >
                    {account.displayName}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
