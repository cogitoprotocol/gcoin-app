"use client";

import { Tab } from "@headlessui/react";
import classNames from "classnames";
import Section from "components/common/Section";
import { Fragment } from "react";
import DepositForm from "./DepositForm";
import MyStakingForm from "./MyStakingForm";

const TABS = ["Deposit GCOIN", "My Stake"];

export default function StakingSection() {
  return (
    <Section className="w-full max-w-md flex flex-col gap-4 mb-8">
      <Tab.Group>
        <Tab.List className="w-full flex gap-2">
          {TABS.map((tab) => (
            <Tab
              key={tab}
              className={classNames([
                "flex-1 rounded-lg p-3 bg-black transition-all focus:outline-none",
                "ui-selected:bg-opacity-20",
                "ui-selected:dark:bg-opacity-60",
                "ui-not-selected:bg-opacity-10 ui-not-selected:hover:bg-opacity-20 ui-not-selected:text-gray-500",
                "ui-not-selected:dark:bg-opacity-20 ui-not-selected:dark:hover:bg-opacity-20 ui-not-selected:dark:text-gray-200",
              ])}
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels as={Fragment}>
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
