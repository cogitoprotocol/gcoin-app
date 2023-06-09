"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import classNames from "classnames";
import { CgSpinner } from "react-icons/cg";

export default function MyConnectButton() {
  const buttonClasses =
    "px-4 py-3 whitespace-pre hover:text-accent bg-light hover:bg-opacity-50 dark:bg-dark-section-dark dark:hover:bg-opacity-80 transition-all";

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
                    className={classNames("rounded-md", buttonClasses)}
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
                    className={classNames("rounded-md", buttonClasses)}
                  >
                    Switch network
                  </button>
                );
              }
              return (
                <div className="relative">
                  {account.hasPendingTransactions && (
                    <CgSpinner className="h-full -ml-8 absolute animate-spin opacity-50" />
                  )}
                  <div className="flex items-center outline outline-zinc-200 dark:outline-zinc-900 shadow-md dark:shadow-none dark:text-white rounded-md">
                    <button
                      type="button"
                      onClick={openChainModal}
                      className={classNames(
                        "hidden lg:flex items-center",
                        buttonClasses
                      )}
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
                      className={buttonClasses}
                    >
                      {account.displayName}
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
