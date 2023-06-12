"use client";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chains, wagmiConfig } from "lib/wagmi";
import { WagmiConfig } from "wagmi";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} coolMode showRecentTransactions>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
