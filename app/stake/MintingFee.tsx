"use client";

import { useGCoinMintingFee } from "@/lib/wagmiHooks";

export default function MintingFee() {
  const mintingFeeResult = useGCoinMintingFee();
  return <>{`${Number(mintingFeeResult.data).toFixed(2)}%`}</>;
}
