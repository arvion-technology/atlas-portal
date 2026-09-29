"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { Ticket, TicketStatus } from "@/lib/types.ts";
import { formatDateKey } from "@/lib/format.ts";
import { filterTickets, ticketStatusLabel } from "@/lib/selectors.ts";
import { StatusPill } from "@/components/ui.tsx";

const STATUS_OPTIONS: Array<{ value: TicketStatus | "all"; label: string }> = [
  { value: "all", label: "All tickets" },
  { value: "open", label: "Open" },
  { value: "waiting", label: "Waiting on you" },
  { value: "resolved", label: "Resolved" },
];

export function TicketExplorer({ tickets }: { tickets: Ticket[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<TicketStatus | "all">("all");

  const rows = useMemo(() => filterTickets(tickets, { query, status }), [tickets, query, status]);

  return (
    <section className="card ticket-explorer" aria-label="Support tickets">
      <div className="explorer-toolbar">
        <label className="search-field">
          <span className="sr-only">Search tickets</span>
          <input
            id="ticket-search"
            type="search"
            placeholder="Search subject, number or tag"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label className="select-field">
          <span className="sr-only">Filter by status</span>
          <select
            id="ticket-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as TicketStatus | "all")}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <p className="explorer-count" id="ticket-count">
          {rows.length} of {tickets.length} tickets
        </p>
      </div>

      <ul className="ticket-rows">
        {rows.map((ticket) => {
          const searchText = [ticket.number, ticket.subject, ...ticket.tags].join(" ").toLowerCase();
          return (
            <li key={ticket.id}>
              <Link
                className="ticket-row"
                href={`/tickets/${ticket.id}/`}
                data-ticket-row
                data-status={ticket.status}
                data-search={searchText}
              >
                <span className={`priority-mark priority-${ticket.priority}`} aria-hidden="true" />
                <span className="ticket-row-main">
                  <span className="ticket-row-title">{ticket.subject}</span>
                  <span className="ticket-row-meta">
                    {ticket.number}
                    <span className="dot-sep" aria-hidden="true" />
                    Updated {formatDateKey(ticket.updatedAt)}
                    <span className="dot-sep" aria-hidden="true" />
                    {ticket.tags.join(", ")}
                  </span>
                </span>
                <span className="ticket-row-side">
                  <StatusPill status={ticket.status} label={ticketStatusLabel(ticket.status)} />
                  <span className={`priority-label priority-${ticket.priority}`}>{ticket.priority}</span>
                </span>
              </Link>
            </li>
          );
        })}
        {rows.length === 0 ? <li id="ticket-empty" className="empty-cell">No tickets match this filter.</li> : null}
      </ul>
    </section>
  );
}
