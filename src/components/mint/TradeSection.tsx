"use client";

import { Tab } from "@headlessui/react";
import classNames from "classnames";
import ClientOnly from "components/common/ClientOnly";
import Section from "components/common/Section";
import TextSkeleton from "components/common/TextSkeleton";
import { GCOIN_DECIMALS } from "lib/constants";
import { gCoinAddress } from "lib/wagmiHooks";
import AddAssetButton from "../common/AddAssetButton";
import MintingFee from "../contract-values/MintingFee";
import RedemptionFee from "../contract-values/RedemptionFee";
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
          {TABS.map((tab, i) => (
            <Tab
              key={tab}
              className={classNames([
                "flex-1 p-4 rounded-t-lg transition-all focus:outline-none text-lg",
                "ui-selected:font-medium ui-selected:bg-zinc-50",
                "ui-selected:dark:bg-dark-section-light",
                "ui-not-selected:hover:bg-opacity-20 ui-not-selected:text-gray-500 ui-not-selected:font-thin ui-not-selected:hover:drop-shadow-lg",
                "ui-not-selected:dark:text-gray-400",
              ])}
            >
              {tab}
            </Tab>
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
