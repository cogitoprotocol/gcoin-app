import ClientOnly from "@/components/common/ClientOnly";
import TextSkeleton from "@/components/common/TextSkeleton";
import GCoinMarketCap from "./GCoinMarketCap";
import GCoinPrice from "./GCoinPrice";

const skeleton = <TextSkeleton className="w-20 h-4" />;

export default function TreasuryStatsTable() {
  return (
    <table className="w-full">
      <tbody>
        <tr>
          <td>Current Price</td>
          <td className="text-right">
            <ClientOnly fallback={skeleton}>
              <GCoinPrice />
            </ClientOnly>
          </td>
        </tr>
        <tr>
          <td>Market Cap</td>
          <td className="text-right">
            <ClientOnly fallback={skeleton}>
              <GCoinMarketCap />
            </ClientOnly>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
