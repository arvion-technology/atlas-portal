"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Overview" },
  { href: "/invoices/", label: "Invoices" },
  { href: "/tickets/", label: "Support" },
  { href: "/settings/", label: "Settings" },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="main-nav" aria-label="Portal sections">
      {LINKS.map((link) => {
        const active = link.href === "/"
          ? pathname === "/" || pathname === ""
          : pathname.startsWith(link.href.replace(/\/$/, ""));
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link${active ? " active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
