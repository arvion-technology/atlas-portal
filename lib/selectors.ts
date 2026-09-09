/**
 * Pure selectors over the portal data. Invoice status is derived from the due
 * date and recorded payments; the only stored facts are dates, lines and
 * payments. The fixed portal clock is injected so tests can move through time.
 */

import { PORTAL_TODAY } from "./data.ts";
import { daysBetween } from "./format.ts";
import type {
  Invoice, InvoiceStatus, MoneySummary, Ticket, TicketPriority, TicketStatus,
} from "./types.ts";

export function invoiceSubtotalMinor(invoice: Invoice): number {
  return invoice.lines.reduce((sum, line) => sum + line.quantity * line.unitPriceMinor, 0);
}

export function invoiceTaxMinor(invoice: Invoice): number {
  const raw = (invoiceSubtotalMinor(invoice) * invoice.taxBasisPoints) / 10_000;
  return Math.round(raw);
}

export function invoiceTotalMinor(invoice: Invoice): number {
  return invoiceSubtotalMinor(invoice) + invoiceTaxMinor(invoice);
}

export function invoicePaidMinor(invoice: Invoice): number {
  return invoice.payments.reduce((sum, payment) => sum + payment.amountMinor, 0);
}

export function invoiceDueMinor(invoice: Invoice): number {
  return Math.max(0, invoiceTotalMinor(invoice) - invoicePaidMinor(invoice));
}

export function deriveInvoiceStatus(invoice: Invoice, today = PORTAL_TODAY): InvoiceStatus {
  if (invoice.voided) return "void";
  if (invoice.draft) return "draft";
  const total = invoiceTotalMinor(invoice);
  const paid = invoicePaidMinor(invoice);
  if (paid >= total) return "paid";
  if (paid > 0) return "partial";
  if (today > invoice.dueOn) return "overdue";
  return "open";
}

export function invoiceStatusLabel(status: InvoiceStatus): string {
  const labels: Record<InvoiceStatus, string> = {
    draft: "Draft",
    open: "Open",
    partial: "Part paid",
    overdue: "Overdue",
    paid: "Paid",
    void: "Void",
  };
  return labels[status];
}

export function isInvoiceOverdue(invoice: Invoice, today = PORTAL_TODAY): boolean {
  return deriveInvoiceStatus(invoice, today) === "overdue";
}

export function daysLate(invoice: Invoice, today = PORTAL_TODAY): number {
  return Math.max(0, daysBetween(invoice.dueOn, today));
}

export function summarizeInvoices(invoices: Invoice[], today = PORTAL_TODAY): MoneySummary {
  return invoices.reduce<MoneySummary>((summary, invoice) => {
    const status = deriveInvoiceStatus(invoice, today);
    if (status === "draft" || status === "void") return summary;
    const total = invoiceTotalMinor(invoice);
    const due = invoiceDueMinor(invoice);
    summary.totalMinor += total;
    summary.paidMinor += Math.min(invoicePaidMinor(invoice), total);
    summary.dueMinor += due;
    if (status === "overdue") {
      summary.overdueMinor += due;
      summary.overdueCount += 1;
    }
    if (status === "partial" || status === "open" || status === "overdue") summary.openCount += 1;
    if (status === "paid") summary.paidCount += 1;
    return summary;
  }, {
    totalMinor: 0,
    paidMinor: 0,
    dueMinor: 0,
    overdueMinor: 0,
    openCount: 0,
    overdueCount: 0,
    paidCount: 0,
  });
}

export function sortInvoicesNewestFirst(invoices: Invoice[]): Invoice[] {
  return [...invoices].sort((a, b) => b.issuedOn.localeCompare(a.issuedOn) || b.number.localeCompare(a.number));
}

export function filterInvoices(
  invoices: Invoice[],
  { query = "", status = "all" }: { query?: string; status?: InvoiceStatus | "all" } = {},
  today = PORTAL_TODAY,
): Invoice[] {
  const needle = query.trim().toLowerCase();
  return sortInvoicesNewestFirst(invoices).filter((invoice) => {
    if (status !== "all" && deriveInvoiceStatus(invoice, today) !== status) return false;
    if (!needle) return true;
    return invoice.number.toLowerCase().includes(needle)
      || invoice.lines.some((line) => line.description.toLowerCase().includes(needle)
        || (line.detail || "").toLowerCase().includes(needle));
  });
}

export function getInvoiceById(invoices: Invoice[], id: string): Invoice | undefined {
  return invoices.find((invoice) => invoice.id === id);
}

/* ----------------------------------------------------------------- tickets */

export function ticketFirstResponseMinutes(ticket: Ticket): number | null {
  const firstCustomer = ticket.messages.find((message) => message.author === "customer");
  const firstAgent = ticket.messages.find((message) => message.author === "agent");
  if (!firstCustomer || !firstAgent) return null;
  if (firstAgent.sentOn < firstCustomer.sentOn) return null;
  const minutes = (Date.parse(firstAgent.sentOn) - Date.parse(firstCustomer.sentOn)) / 60_000;
  return Math.max(0, Math.round(minutes));
}

export function averageFirstResponseMinutes(tickets: Ticket[]): number | null {
  const values = tickets
    .map((ticket) => ticketFirstResponseMinutes(ticket))
    .filter((value): value is number => value !== null)
    .sort((a, b) => a - b);
  if (!values.length) return null;
  return Math.round(values[values.length >> 1]);
}

export function filterTickets(
  tickets: Ticket[],
  { query = "", status = "all" }: { query?: string; status?: TicketStatus | "all" } = {},
): Ticket[] {
  const needle = query.trim().toLowerCase();
  return [...tickets]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .filter((ticket) => {
      if (status !== "all" && ticket.status !== status) return false;
      if (!needle) return true;
      return ticket.number.toLowerCase().includes(needle)
        || ticket.subject.toLowerCase().includes(needle)
        || ticket.tags.some((tag) => tag.toLowerCase().includes(needle));
    });
}

export function ticketStatusLabel(status: TicketStatus): string {
  const labels: Record<TicketStatus, string> = {
    open: "Open",
    waiting: "Waiting on you",
    resolved: "Resolved",
  };
  return labels[status];
}

export function ticketPriorityLabel(priority: TicketPriority): string {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

export function ticketCounts(tickets: Ticket[]): Record<TicketStatus, number> {
  return tickets.reduce<Record<TicketStatus, number>>((counts, ticket) => {
    counts[ticket.status] += 1;
    return counts;
  }, { open: 0, waiting: 0, resolved: 0 });
}

export function latestTicketMessage(ticket: Ticket): Ticket["messages"][number] | null {
  return [...ticket.messages].sort((a, b) => b.sentOn.localeCompare(a.sentOn))[0] ?? null;
}

export function planUsage() {
  return {
    apiPercent: 92,
    storagePercent: 84,
    seatsPercent: 100,
  };
}
