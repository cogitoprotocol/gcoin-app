"use client";
import { Tab } from "@headlessui/react";
import classNames from "classnames";
import { ReactNode } from "react";

export default function SectionTab({ children }: { children: ReactNode }) {
  return (
    <Tab
      className={classNames([
        "flex-1 p-4 rounded-t-lg transition-all focus:outline-none text-lg",
        "ui-selected:font-medium ui-selected:bg-zinc-50",
        "ui-selected:dark:bg-dark-section-light",
        "ui-not-selected:text-gray-500 ui-not-selected:font-thin ui-not-selected:hover:drop-shadow ui-not-selected:hover:text-gray-800",
        "ui-not-selected:dark:text-gray-400 ui-not-selected:dark:hover:text-gray-100",
      ])}
    >
      {children}
    </Tab>
  );
}
