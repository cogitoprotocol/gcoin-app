"use client";

import { Tab } from "@headlessui/react";
import AddAssetButton from "components/common/AddAssetButton";
import ClientOnly from "components/common/ClientOnly";
import Section from "components/common/Section";
import SectionTab from "components/common/SectionTab";
import TextSkeleton from "components/common/TextSkeleton";
import MintingFee from "components/contract-values/MintingFee";
import RedemptionFee from "components/contract-values/RedemptionFee";
import { GCOIN_DECIMALS } from "lib/constants";
import { gCoinAddress } from "lib/wagmiHooks";
import GCoinPriceRate from "./GCoinPriceRate";
import RedeemForm from "./RedeemForm";
import TradeForm from "./TradeForm";
import TradeFormSkeleton from "./TradeFormSkeleton";

const TABS = ["Mint GCOIN", "Redeem"];

export default function TradeSection() {
  return (
    <Section className="w-full max-w-md mb-8 flex flex-col gap-4">
      <Tab.Group>
        <Tab.List className="w-full bg-black bg-opacity-10 dark:bg-opacity-30 rounded-t-lg flex">
          {TABS.map((tab) => (
            <SectionTab key={tab}>{tab}</SectionTab>
          ))}
        </Tab.List>

        <Tab.Panels className="p-8 pt-4">
          <Tab.Panel className="flex flex-col gap-4">
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
              <div className="text-right">
                <AddAssetButton
                  address={gCoinAddress}
                  symbol="GCOIN"
                  decimals={GCOIN_DECIMALS}
                />
              </div>
            </div>
          </Tab.Panel>

          <Tab.Panel className="flex flex-col gap-4">
            <RedeemForm />

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
                <div>Redemption Fee</div>
                <div>
                  <ClientOnly fallback={<TextSkeleton className="w-28 h-3" />}>
                    <RedemptionFee />
                  </ClientOnly>
                </div>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </Section>
  );
}
