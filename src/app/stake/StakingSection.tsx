"use client";

import { Tab } from "@headlessui/react";
import classNames from "classnames";
import Section from "components/common/Section";
import DepositForm from "./DepositForm";
import MyStakingForm from "./MyStakingForm";

const TABS = ["Deposit GCOIN", "My Stake"];

export default function StakingSection() {
  return (
    <Section className="w-full max-w-md flex flex-col mb-8">
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

        <Tab.Panels className="p-4 sm:p-8">
          <Tab.Panel className="flex flex-col gap-4">
            <p className="text-sm">
              Stake your GCOIN for a fixed duration to earn CGV rewards. The
              longer you stake, the more rewards you receive. Deposits are
              locked until the specified date.
            </p>
            <DepositForm />
          </Tab.Panel>

          <Tab.Panel className="w-full flex flex-col gap-2">
            <MyStakingForm />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </Section>
  );
}
