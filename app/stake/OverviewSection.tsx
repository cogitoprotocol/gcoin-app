import ClientOnly from "@/components/common/ClientOnly";
import Section from "@/components/common/Section";
import TextSkeleton from "@/components/common/TextSkeleton";
import BaseRewardRate from "./BaseRewardRate";
import CgvAvailable from "./CgvAvailable";
import TotalPendingRewards from "./TotalPendingRewards";
import TotalStaked from "./TotalStaked";
import UserStake from "./UserStake";

export default function OverviewSection() {
  return (
    <Section className="w-full max-w-md mb-8">
      <h1 className="w-full text-3xl">GCOIN Staking</h1>

      <div className="w-full text-zinc-300 text-sm">
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
        <div className="flex justify-between">
          <div>Total Allocated CGV Rewards</div>
          <div>
            <ClientOnly fallback={<TextSkeleton className="w-28 h-3" />}>
              <CgvAvailable />
            </ClientOnly>
          </div>
        </div>
      </div>

      <UserStake />
    </Section>
  );
}
