"use client";

import { getWalletClient } from "@wagmi/core";
import ClientOnly from "components/common/ClientOnly";
import { BsWallet2 } from "react-icons/bs";
import { useAccount } from "wagmi";

export default function AddAssetButton({
  address,
  symbol,
  decimals,
}: {
  address: string;
  symbol: string;
  decimals: number;
}) {
  const userAccount = useAccount();
  if (!userAccount.isConnected) {
    return null;
  }

  // Add token to wallet
  const handleAddAsset = async () => {
    const walletClient = await getWalletClient();
    walletClient?.watchAsset({
      type: "ERC20",
      options: {
        address,
        symbol,
        decimals,
      },
    });
  };

  return (
    <ClientOnly>
      <div
        className="inline-flex items-center gap-2 cursor-pointer hover:underline"
        onClick={handleAddAsset}
      >
        <BsWallet2 />
        Add {symbol} to Wallet
      </div>
    </ClientOnly>
  );
}
