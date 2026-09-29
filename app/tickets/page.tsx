import Link from "next/link";

import { TICKETS } from "@/lib/data.ts";
import { averageFirstResponseMinutes, ticketCounts } from "@/lib/selectors.ts";
import { TicketExplorer } from "@/components/TicketExplorer";
import { Metric } from "@/components/ui.tsx";

export const metadata = { title: "Support | Atlas Portal" };

export default function TicketsPage() {
  const counts = ticketCounts(TICKETS);
  const median = averageFirstResponseMinutes(TICKETS);
  return (
    <div className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">Support</p>
          <h1>Tickets</h1>
          <p className="lede">
            Support threads for this workspace. A ticket stays open until both sides agree it is
            resolved; the reply thread is the record.
          </p>
        </div>
        <div className="page-actions">
          <Link className="button primary" href="/tickets/tkt-201/">Open urgent ticket</Link>
        </div>
      </section>

      <div className="metric-grid three">
        <Metric label="Open" value={String(counts.open)} detail="With the support team" tone="accent" />
        <Metric label="Waiting on you" value={String(counts.waiting)} detail="Support needs a reply" />
        <Metric label="Median first reply" value={median === null ? "n/a" : `${median} min`} detail={`${counts.resolved} resolved threads`} />
      </div>

      <TicketExplorer tickets={TICKETS} />
    </div>
  );
}
