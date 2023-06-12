"use client";

import classnames from "classnames";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ActiveLink({
  children,
  href,
  className = "",
  activeClassName = "font-bold cursor-default",
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  activeClassName?: string;
}) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link
      className={classnames(className, {
        [activeClassName]: isActive,
      })}
      href={href}
    >
      {children}
    </Link>
  );
}
