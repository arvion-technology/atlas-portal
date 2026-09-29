import Link from "next/link";
import { ACCOUNT } from "@/lib/data.ts";
import { NavLinks } from "@/components/NavLinks";
import { initials } from "@/lib/format";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">A</span>
          <span className="brand-copy">
            <span className="brand-name">Atlas Portal</span>
            <span className="brand-sub">Customer workspace</span>
          </span>
        </Link>

        <NavLinks />

        <div className="account-chip" title={`${ACCOUNT.name}, ${ACCOUNT.plan} plan`}>
          <span className="account-avatar" aria-hidden="true">{initials(ACCOUNT.owner)}</span>
          <span className="account-copy">
            <span className="account-name">{ACCOUNT.name}</span>
            <span className="account-plan">{ACCOUNT.plan} plan</span>
          </span>
        </div>
      </div>
    </header>
  );
}
