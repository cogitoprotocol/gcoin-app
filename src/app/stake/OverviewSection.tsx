import ClientOnly from "components/common/ClientOnly";
import Section from "components/common/Section";
import BaseRewardRate from "components/contract-values/BaseRewardRate";
import TotalPendingRewards from "components/contract-values/TotalPendingRewards";
import TotalStaked from "components/contract-values/TotalStaked";
import TextSkeleton from "components/skeleton/TextSkeleton";
import UserStake from "./UserStake";

export default function OverviewSection() {
  return (
    <Section className="p-8 w-full max-w-md mb-8 flex flex-col gap-4">
      <h1 className="w-full text-3xl">GCOIN Staking</h1>

      <div className="w-full text-sm">
        <div className="flex justify-between">
          <div>Total GCOIN Staked</div>
          <div>
            <ClientOnly fallback={<TextSkeleton className="w-28 h-3" />}>
              <TotalStaked />
            </ClientOnly>
          </div>
        </div>
        <div className="flex justify-between">
          <div>Total Pending CGV Rewards</div>
          <div>
            <ClientOnly fallback={<TextSkeleton className="w-28 h-3" />}>
              <TotalPendingRewards />
            </ClientOnly>
          </div>
        </div>
        <div className="flex justify-between">
          <div>Base APY</div>
          <div>
            <ClientOnly fallback={<TextSkeleton className="w-28 h-3" />}>
              <BaseRewardRate />
            </ClientOnly>
          </div>
        </div>
      </div>

      <UserStake />
    </Section>
  );
}
