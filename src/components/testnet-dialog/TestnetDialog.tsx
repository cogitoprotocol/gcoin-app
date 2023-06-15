"use client";

import { Dialog, Transition } from "@headlessui/react";
import ClientOnly from "components/common/ClientOnly";
import Link from "next/link";
import { Fragment, useState } from "react";
import { VscClose } from "react-icons/vsc";
import { useLocalStorage } from "usehooks-ts";

export default function TestnetDialog() {
  const [hasShown, setHasShown] = useLocalStorage(
    "testnet-dialog-shown",
    false
  );
  const [isOpen, setIsOpen] = useState(!hasShown);

  const close = () => {
    setIsOpen(false);
    setHasShown(true);
  };

  return (
    <ClientOnly>
      <Transition
        show={isOpen}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        as={Fragment}
      >
        <Dialog onClose={close} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          <div className="fixed inset-x-0 top-24 flex items-center justify-center">
            <Dialog.Panel className="w-full max-w-sm rounded-lg shadow-md bg-zinc-50 dark:bg-gradient-to-bl dark:from-dark-section-light dark:to-dark-section-dark dark:text-white p-8">
              <Dialog.Title className="font-medium text-xl flex justify-between items-center">
                <span>GCOIN Beta Testing</span>
                <VscClose className="cursor-pointer" onClick={close} />
              </Dialog.Title>

              <Dialog.Description className="mt-4">
                Give your feedback and get rewards!
              </Dialog.Description>

              <p className="mt-4">
                Go through our{" "}
                <Link
                  href="https://docs.google.com/document/d/1Sf-Cz6-tLD38noNYsZX-hEUEumWTyaf5gca2cZ4EjZ4/edit?usp=sharing"
                  target="_blank"
                  className="text-accent transition-all cursor-pointer hover:underline"
                >
                  guide
                </Link>
                , fill in the feedback form and help us improve your GCOIN
                experience.
              </p>
              <p className="mt-4">Reward pool: $1000 worth of CGV tokens.</p>

              <Link
                target="_blank"
                href="https://forms.gle/5rYJYbErGnX97y219"
                className="block text-center mt-4 rounded-md w-full p-4 bg-accent focus:outline-none transition-all cursor-pointer hover:bg-accent-active"
              >
                Participate
              </Link>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </ClientOnly>
  );
}
