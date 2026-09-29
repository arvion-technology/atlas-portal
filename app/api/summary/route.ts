import { ACCOUNT, INVOICES, PORTAL_TODAY, TICKETS } from "@/lib/data.ts";
import {
  averageFirstResponseMinutes, deriveInvoiceStatus, summarizeInvoices, ticketCounts,
} from "@/lib/selectors.ts";

// Static export has no request-time server, so the handler is resolved at build
// time. A live portal would drop this line and hit the same selectors per request.
export const dynamic = "force-static";

export function GET() {
  const summary = summarizeInvoices(INVOICES, PORTAL_TODAY);
  return Response.json({
    account: ACCOUNT.name,
    plan: ACCOUNT.plan,
    today: PORTAL_TODAY,
    invoices: {
      total: INVOICES.length,
      open: summary.openCount,
      overdue: summary.overdueCount,
      dueMinor: summary.dueMinor,
      overdueMinor: summary.overdueMinor,
      paidMinor: summary.paidMinor,
      currency: "USD",
    },
    tickets: {
      ...ticketCounts(TICKETS),
      medianFirstResponseMinutes: averageFirstResponseMinutes(TICKETS),
    },
    statuses: INVOICES.map((invoice) => ({ id: invoice.id, status: deriveInvoiceStatus(invoice, PORTAL_TODAY) })),
  });
}
