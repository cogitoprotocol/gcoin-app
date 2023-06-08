import ClientOnly from "@/components/common/ClientOnly";
import Section from "@/components/common/Section";
import TextSkeleton from "@/components/common/TextSkeleton";
import AddAssetButton from "./AddAssetButton";
import GCoinPriceRate from "./GCoinPriceRate";
import MintingFee from "./MintingFee";
import TradeForm from "./TradeForm";
import TradeFormSkeleton from "./TradeFormSkeleton";

export default function TradeSection() {
  return (
    <Section className="w-full max-w-md mb-8">
      <h1 className="text-3xl">Mint GCOIN</h1>

      <ClientOnly fallback={<TradeFormSkeleton />}>
        <TradeForm />
      </ClientOnly>

      <div className="text-gray-600 dark:text-gray-300 text-sm">
        <div className="flex justify-between">
          <div>Rate</div>
          <div>
            <ClientOnly fallback={<TextSkeleton className="w-28 h-3" />}>
              <GCoinPriceRate />
            </ClientOnly>
          </div>
        </div>
        <div className="flex justify-between">
          <div>Minting Fee</div>
          <div>
            <ClientOnly fallback={<TextSkeleton className="w-28 h-3" />}>
              <MintingFee />
            </ClientOnly>
          </div>
        </div>
        <AddAssetButton />
      </div>
    </Section>
  );
}
