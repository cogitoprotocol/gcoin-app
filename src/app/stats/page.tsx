import ClientOnly from "components/common/ClientOnly";
import Section from "components/common/Section";
import OverviewStatsSection from "../../components/mint/OverviewStatsSection";
import TreasuryReservesChart from "./TreasuryReservesChart";
import TreasuryReservesTable from "./TreasuryReservesTable";

export default function StatsPage() {
  return (
    <div className="w-full grid grid-cols-5 gap-8">
      <OverviewStatsSection />

      <Section className="col-span-5 lg:col-span-2">
        <h1 className="w-full text-3xl">Treasury</h1>

        <ClientOnly>
          <TreasuryReservesChart />
        </ClientOnly>
      </Section>

      <Section className="col-span-5 lg:col-span-3">
        <h1 className="w-full text-3xl">Liquid Reserves</h1>

        <ClientOnly>
          <TreasuryReservesTable />
        </ClientOnly>
      </Section>
    </div>
  );
}
