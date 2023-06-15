import OverviewStatsSection from "components/mint/OverviewStatsSection";
import TradeSection from "components/mint/TradeSection";
import TestnetDialog from "components/testnet-dialog/TestnetDialog";

export default function HomePage() {
  return (
    <>
      <OverviewStatsSection />

      <TradeSection />

      {process.env.NEXT_PUBLIC_NETWORK === "sepolia" && <TestnetDialog />}
    </>
  );
}
