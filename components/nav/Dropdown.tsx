"use client";

import useDarkMode from "@fisch0920/use-dark-mode";
import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import Link from "next/link";
import { Fragment, MouseEventHandler } from "react";
import { FiMenu } from "react-icons/fi";
import { NAV_LINKS } from "./links";

export default function Dropdown() {
  const darkMode = useDarkMode(undefined, {
    classNameDark: "dark",
    classNameLight: "light",
  });

  const handleToggleDarkMode: MouseEventHandler = (e) => {
    e.preventDefault();
    darkMode.toggle();
  };

  return (
    <div className="dark:text-gray-100 -mt-14 md:mt-0">
      <Menu as="div" className="md:relative">
        <div className="text-right">
          <Menu.Button className="inline-flex justify-center items-center p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 text-xl">
            <FiMenu />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className="md:absolute md:right-0 w-full md:w-64 mt-2 origin-top-right md:rounded-md dark:text-white border-y md:border border-black dark:border-white border-opacity-10 dark:border-opacity-10 bg-zinc-200 md:bg-white shadow-inner md:shadow-lg dark:bg-zinc-900 bg-opacity-70 backdrop-blur backdrop-filter
          "
          >
            <div className="py-1">
              <div className="md:hidden mb-2">
                {NAV_LINKS.map(({ label, href, Logo }) => (
                  <Menu.Item key={href}>
                    <Link
                      className="p-3 group flex w-full items-center bg-black bg-opacity-0 ui-active:bg-opacity-5 dark:bg-white dark:bg-opacity-0 dark:ui-active:bg-opacity-5 transition-opacity"
                      href={href}
                    >
                      <div className="w-10 mr-4 pl-2">
                        <Logo />
                      </div>
                      {label}
                    </Link>
                  </Menu.Item>
                ))}
              </div>
              <Menu.Item
                as="button"
                className="p-3 group flex w-full items-center bg-black bg-opacity-0 ui-active:bg-opacity-5 dark:bg-white dark:bg-opacity-0 dark:ui-active:bg-opacity-5 transition-opacity"
                onClick={handleToggleDarkMode}
              >
                <div
                  className={classNames(
                    {
                      "bg-purple-900": darkMode.value,
                      "bg-gray-300": !darkMode.value,
                    },
                    "relative inline-flex h-6 w-10 mr-4 items-center rounded-full transition-colors"
                  )}
                >
                  <span
                    className={classNames(
                      {
                        "translate-x-5 text-purple-500": darkMode.value,
                        "translate-x-1 text-yellow-500": !darkMode.value,
                      },
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform text-xs"
                    )}
                  >
                    {darkMode.value ? "☾" : "☀"}
                  </span>
                </div>
                <span>Dark Mode</span>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
