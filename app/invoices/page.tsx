import Link from "next/link";

import { INVOICES, PORTAL_TODAY } from "@/lib/data.ts";
import { formatMoney } from "@/lib/format.ts";
import { summarizeInvoices } from "@/lib/selectors.ts";
import { InvoiceExplorer } from "@/components/InvoiceExplorer";
import { Metric } from "@/components/ui.tsx";

export const metadata = { title: "Invoices | Atlas Portal" };

export default function InvoicesPage() {
  const summary = summarizeInvoices(INVOICES, PORTAL_TODAY);
  return (
    <div className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">Billing</p>
          <h1>Invoices</h1>
          <p className="lede">
            Every invoice for this workspace, from draft to settled. Balances are calculated from
            the invoice lines and recorded payments, not stored as a separate field.
          </p>
        </div>
        <div className="page-actions">
          <Link className="button ghost" href="/settings/">Billing settings</Link>
        </div>
      </section>

      <div className="metric-grid three">
        <Metric label="Outstanding" value={formatMoney(summary.dueMinor)} detail={`${summary.openCount} invoices still open`} tone="accent" />
        <Metric label="Overdue" value={formatMoney(summary.overdueMinor)} detail={`${summary.overdueCount} past the due date`} />
        <Metric label="Paid" value={formatMoney(summary.paidMinor)} detail={`${summary.paidCount} invoices settled`} />
      </div>

      <InvoiceExplorer invoices={INVOICES} today={PORTAL_TODAY} />
    </div>
  );
}
