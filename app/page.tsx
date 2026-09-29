import Link from "next/link";
import { Suspense } from "react";

import { ACCOUNT, INVOICES, PORTAL_TODAY, TEAM, TICKETS, USAGE } from "@/lib/data.ts";
import { formatDateKey, formatMoney, formatMoneyCompact, initials } from "@/lib/format.ts";
import {
  averageFirstResponseMinutes, deriveInvoiceStatus, filterTickets, invoiceDueMinor,
  invoiceStatusLabel, invoiceTotalMinor, sortInvoicesNewestFirst, summarizeInvoices,
  ticketCounts,
} from "@/lib/selectors.ts";
import { Metric, ProgressBar, SectionHeading, StatusPill } from "@/components/ui.tsx";

function MetricsSkeleton() {
  return (
    <div className="metric-grid" aria-hidden="true">
      {Array.from({ length: 4 }, (_, index) => <div key={index} className="metric-card skeleton" />)}
    </div>
  );
}

async function Metrics() {
  const invoiceSummary = summarizeInvoices(INVOICES, PORTAL_TODAY);
  const tickets = ticketCounts(TICKETS);
  const medianReply = averageFirstResponseMinutes(TICKETS);
  // A tiny await keeps this a genuine async server component. In a live portal
  // this is where the data layer call would sit.
  await Promise.resolve();
  return (
    <div className="metric-grid">
      <Metric
        label="Balance due"
        value={formatMoney(invoiceSummary.dueMinor)}
        detail={`${invoiceSummary.openCount} open invoices, ${invoiceSummary.overdueCount} overdue`}
        tone="accent"
      />
      <Metric
        label="Paid this year"
        value={formatMoney(invoiceSummary.paidMinor)}
        detail={`${invoiceSummary.paidCount} invoices settled`}
      />
      <Metric
        label="Open tickets"
        value={String(tickets.open + tickets.waiting)}
        detail={`${tickets.open} with support, ${tickets.waiting} waiting on you`}
      />
      <Metric
        label="Median first reply"
        value={medianReply === null ? "n/a" : `${medianReply} min`}
        detail="Rolling across all support threads"
      />
    </div>
  );
}

export default function DashboardPage() {
  const recentInvoices = sortInvoicesNewestFirst(INVOICES).slice(0, 5);
  const attentionInvoice = INVOICES.find((invoice) => deriveInvoiceStatus(invoice, PORTAL_TODAY) === "overdue");
  const attentionTicket = filterTickets(TICKETS, { status: "open" })
    .find((ticket) => ticket.priority === "urgent" || ticket.priority === "high");
  const recentTickets = filterTickets(TICKETS).slice(0, 3);

  return (
    <div className="page dashboard-page">
      <section className="page-head">
        <div>
          <p className="eyebrow">Overview, {formatDateKey(PORTAL_TODAY)}</p>
          <h1>Good afternoon, {ACCOUNT.owner.split(" ")[0]}</h1>
          <p className="lede">
            Here is where {ACCOUNT.name} stands today: what is owed, what support is holding,
            and how the plan is being used.
          </p>
        </div>
        <div className="page-actions">
          <Link className="button" href="/invoices/">View invoices</Link>
          <Link className="button primary" href="/tickets/">Open a ticket</Link>
        </div>
      </section>

      <Suspense fallback={<MetricsSkeleton />}>
        <Metrics />
      </Suspense>

      <div className="dash-grid">
        <section className="card span-2 attention-card">
          <SectionHeading title="Needs attention" action={<span className="badge-count">{attentionInvoice ? "2 items" : "0 items"}</span>} />
          <div className="attention-list">
            {attentionInvoice ? (
              <article className="attention-item">
                <span className="attention-icon" aria-hidden="true">!</span>
                <div className="attention-copy">
                  <h3>Invoice {attentionInvoice.number} is overdue</h3>
                  <p>
                    {formatMoney(invoiceDueMinor(attentionInvoice))} was due on {formatDateKey(attentionInvoice.dueOn)}.
                    Support for non-critical requests pauses after 14 days.
                  </p>
                </div>
                <Link className="button small" href={`/invoices/${attentionInvoice.id}/`}>Review</Link>
              </article>
            ) : null}
            {attentionTicket ? (
              <article className="attention-item">
                <span className="attention-icon warm" aria-hidden="true">?</span>
                <div className="attention-copy">
                  <h3>{attentionTicket.subject}</h3>
                  <p>
                    {attentionTicket.number}, {attentionTicket.priority} priority.
                    The last reply came from {attentionTicket.messages.at(-1)?.author === "agent" ? "support" : "your team"}.
                  </p>
                </div>
                <Link className="button small" href={`/tickets/${attentionTicket.id}/`}>Open</Link>
              </article>
            ) : null}
          </div>
        </section>

        <section className="card usage-card">
          <SectionHeading title="Plan usage" action={<span className="pill">{ACCOUNT.plan}</span>} />
          <ProgressBar value={92} label="API calls, 1.84M of 2M" />
          <ProgressBar value={84} label="Storage, 84 GB of 100 GB" />
          <ProgressBar value={100} label={`Seats, ${USAGE.seatsUsed} of ${USAGE.seatsIncluded}`} />
          <p className="usage-note">
            Renews on {formatDateKey(ACCOUNT.renewalOn)}. Extra seats are billed monthly.
          </p>
        </section>

        <section className="card span-2">
          <SectionHeading title="Recent invoices" action={<Link className="text-link" href="/invoices/">View all</Link>} />
          <div className="table-wrap flush">
            <table className="data-table compact">
              <thead>
                <tr><th>Invoice</th><th>Issued</th><th>Due</th><th className="num">Total</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recentInvoices.map((invoice) => {
                  const status = deriveInvoiceStatus(invoice, PORTAL_TODAY);
                  return (
                    <tr key={invoice.id} data-invoice-row data-status={status} data-search={invoice.number.toLowerCase()}>
                      <td><Link className="table-link" href={`/invoices/${invoice.id}/`}>{invoice.number}</Link></td>
                      <td className="muted">{formatDateKey(invoice.issuedOn)}</td>
                      <td className="muted">{formatDateKey(invoice.dueOn)}</td>
                      <td className="num">{formatMoneyCompact(invoiceTotalMinor(invoice))}</td>
                      <td><StatusPill status={status} label={invoiceStatusLabel(status)} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card">
          <SectionHeading title="Support" action={<Link className="text-link" href="/tickets/">All tickets</Link>} />
          <ul className="mini-ticket-list">
            {recentTickets.map((ticket) => (
              <li key={ticket.id}>
                <Link href={`/tickets/${ticket.id}/`}>
                  <span className="mini-ticket-title">{ticket.subject}</span>
                  <span className="mini-ticket-meta">{ticket.number}, updated {formatDateKey(ticket.updatedAt)}</span>
                </Link>
                <StatusPill status={ticket.status} label={ticket.status === "open" ? "Open" : ticket.status === "waiting" ? "Waiting" : "Resolved"} />
              </li>
            ))}
          </ul>
        </section>

        <section className="card team-card span-2">
          <SectionHeading title="Your support team" />
          <ul className="team-list">
            {TEAM.map((person) => (
              <li key={person.name}>
                <span className="team-avatar">{initials(person.name)}</span>
                <span><strong>{person.name}</strong><small>{person.role}</small></span>
              </li>
            ))}
            <li className="team-response">
              <span className="team-avatar quiet">4h</span>
              <span><strong>Priority response</strong><small>Business hours, Monday to Friday</small></span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
