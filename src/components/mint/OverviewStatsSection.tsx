import ClientOnly from "components/common/ClientOnly";
import Section from "components/common/Section";
import GCoinMarketCap from "components/contract-values/GCoinMarketCap";
import GCoinPrice from "components/contract-values/GCoinPrice";
import TreasuryValue from "components/contract-values/TreasuryValue";
import TextSkeleton from "components/skeleton/TextSkeleton";

const skeleton = <TextSkeleton className="w-20 h-4" />;

export default function OverviewStatsSection() {
  return (
    <Section className="p-4 w-full max-w-lg flex flex-col divide-black/10 divide-y-2 sm:divide-y-0 sm:flex-row sm:divide-x-2 mb-8">
      <div className="sm:flex-1 h-16 flex flex-col items-center justify-center">
        <h2 className="text-xl font-medium">
          <ClientOnly fallback={skeleton}>
            <TreasuryValue />
          </ClientOnly>
        </h2>
        <span className="text-sm">Total Treasury Value</span>
      </div>

      <div className="sm:flex-1 h-16 flex flex-col items-center justify-center">
        <h2 className="text-xl font-medium">
          <ClientOnly fallback={skeleton}>
            <GCoinMarketCap />
          </ClientOnly>
        </h2>
        <span className="text-sm">GCOIN Market Cap</span>
      </div>

      <div className="sm:flex-1 h-16 flex flex-col items-center justify-center">
        <h2 className="text-xl font-medium">
          <ClientOnly fallback={skeleton}>
            <GCoinPrice />
          </ClientOnly>
        </h2>
        <span className="text-sm">GCOIN Price</span>
      </div>
    </Section>
  );
}
