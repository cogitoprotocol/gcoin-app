import Image from "next/image";
import Link from "next/link";
import ActiveLink from "../common/ActiveLink";
import ConnectButton from "./ConnectButton";
import Dropdown from "./Dropdown";
import { NAV_LINKS } from "./links";

const logo = (
  <Link href="/">
    <Image
      src="/img/logo-light.svg"
      alt="Cogito Protocol"
      className="dark:hidden cursor-pointer"
      width={150}
      height={80}
      priority
    />
    <Image
      src="/img/logo-dark.svg"
      alt="Cogito Protocol"
      className="hidden dark:block cursor-pointer"
      width={150}
      height={80}
      priority
    />
  </Link>
);

export default function Nav() {
  return (
    <nav className="pt-2 md:p-4 md:flex md:flex-row md:justify-between md:gap-8">
      <div className="hidden md:flex flex-col md:flex-row md:justify-between">
        <div className="flex-none px-2">{logo}</div>
      </div>

      <ul className="hidden md:flex items-center dark:bg-zinc-900 md:dark:bg-transparent p-4 gap-8 dark:text-gray-50">
        {NAV_LINKS.map(({ label, href }) => (
          <li key={href}>
            <ActiveLink href={href}>{label}</ActiveLink>
          </li>
        ))}
      </ul>

      <div className="md:flex md:gap-4 md:items-center">
        <div className="flex justify-between items-center pl-4 pr-16 md:p-0">
          <div className="md:hidden">{logo}</div>

          <ConnectButton />
        </div>

        <Dropdown />
      </div>
    </nav>
  );
}
