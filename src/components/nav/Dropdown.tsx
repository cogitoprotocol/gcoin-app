"use client";

import useDarkMode from "@fisch0920/use-dark-mode";
import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MouseEventHandler, useState } from "react";
import { FaBook } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import defaultTheme from "tailwindcss/defaultTheme";
import useBreakpoint from "use-breakpoint";
import { EXTERNAL_LINKS, NAV_LINKS } from "./links";

const BREAKPOINTS = { sm: 0, md: parseInt(defaultTheme.screens.md) };

const MENU_ITEM_CLASSES =
  "p-3 flex w-full items-center bg-black bg-opacity-0 ui-active:bg-opacity-5 dark:bg-white dark:bg-opacity-0 dark:ui-active:bg-opacity-5 transition-opacity";

export default function Dropdown() {
  const darkMode = useDarkMode(undefined, {
    classNameDark: "dark",
    classNameLight: "light",
  });

  const handleToggleDarkMode: MouseEventHandler = (e) => {
    e.preventDefault();
    darkMode.toggle();
  };
  const { breakpoint } = useBreakpoint(BREAKPOINTS, "md");
  const [forceOpen, setForceOpen] = useState(false);
  const toggle = () => {
    // If mobile, override the menu's internal open state with forceOpen
    if (breakpoint === "sm") {
      setForceOpen(!forceOpen);
    }
  };

  const pathname = usePathname();

  return (
    <div className="dark:text-gray-100 -mt-14 md:mt-0">
      <Menu as="div" className="md:relative">
        {({ open }) => (
          <>
            <div className="text-right">
              <Menu.Button
                className="inline-flex justify-center items-center p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 text-xl hover:text-accent transition-colors"
                onClick={toggle}
              >
                <FiMenu />
              </Menu.Button>
            </div>
            <Transition
              show={breakpoint === "sm" ? forceOpen : open}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="md:absolute md:right-0 w-full md:w-64 mt-2 origin-top-right md:rounded-md dark:text-white border-y md:border border-black dark:border-white border-opacity-10 dark:border-opacity-10 bg-zinc-200 md:bg-white shadow-inner md:shadow-lg dark:bg-dark-section-dark dark:bg-opacity-50 backdrop-blur backdrop-filter">
                <div className="py-1">
                  <div className="md:hidden">
                    {NAV_LINKS.map(({ label, href, Logo }) => {
                      const isActive = pathname.startsWith(href);
                      return (
                        <Menu.Item key={href}>
                          <Link
                            className={classNames(MENU_ITEM_CLASSES, {
                              "bg-opacity-5 dark:bg-opacity-5": isActive,
                            })}
                            href={href}
                          >
                            <div className="w-10 mr-4 pl-2">
                              <Logo />
                            </div>
                            <span
                              className={classNames({
                                "font-bold": isActive,
                              })}
                            >
                              {label}
                            </span>
                          </Link>
                        </Menu.Item>
                      );
                    })}
                  </div>
                  <Menu.Item>
                    <Link
                      className={MENU_ITEM_CLASSES}
                      href="https://cogitoprotocol.github.io/docs/"
                      target="_blank"
                    >
                      <div className="w-10 mr-4 pl-2">
                        <FaBook />
                      </div>
                      <span>Docs</span>
                    </Link>
                  </Menu.Item>

                  <Menu.Item
                    as="button"
                    className={MENU_ITEM_CLASSES}
                    onClick={handleToggleDarkMode}
                  >
                    <div
                      className={classNames(
                        {
                          "bg-dark-section-light": darkMode.value,
                          "bg-gray-300": !darkMode.value,
                        },
                        "relative inline-flex h-6 w-10 mr-4 items-center rounded-full transition-colors"
                      )}
                    >
                      <span
                        className={classNames(
                          {
                            "translate-x-5 text-black": darkMode.value,
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

                  <Menu.Item
                    as="div"
                    className="border-t border-black border-opacity-10 dark:border-white dark:border-opacity-5 flex items-center justify-around py-1"
                  >
                    {EXTERNAL_LINKS.map(({ href, Logo }) => (
                      <a
                        key={href}
                        href={href}
                        target="_blank"
                        className="p-2 opacity-60 hover:opacity-100 transition-opacity"
                      >
                        <Logo />
                      </a>
                    ))}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
}
