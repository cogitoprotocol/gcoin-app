import ClientOnly from "@/components/common/ClientOnly";
import Section from "@/components/common/Section";
import TextSkeleton from "@/components/common/TextSkeleton";
import GCoinMarketCap from "@/components/data/GCoinMarketCap";
import GCoinPrice from "@/components/data/GCoinPrice";
import TreasuryValue from "@/components/data/TreasuryValue";

const skeleton = <TextSkeleton className="w-20 h-4" />;

export default function OverviewStatsSection() {
  return (
    <Section className="w-full max-w-lg divide-black divide-opacity-5 divide-y-2 sm:divide-y-0 sm:flex-row sm:divide-x-2 gap-0 mb-8">
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
        <span className="text-sm">GCoin Price</span>
      </div>
    </Section>
  );
}
