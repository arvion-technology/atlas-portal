import { INVOICES, PORTAL_TODAY } from "@/lib/data.ts";
import {
  deriveInvoiceStatus, invoiceDueMinor, invoicePaidMinor, invoiceTotalMinor, invoiceStatusLabel,
} from "@/lib/selectors.ts";

export const dynamic = "force-static";

export function GET() {
  return Response.json({
    today: PORTAL_TODAY,
    invoices: INVOICES.map((invoice) => {
      const status = deriveInvoiceStatus(invoice, PORTAL_TODAY);
      return {
        id: invoice.id,
        number: invoice.number,
        issuedOn: invoice.issuedOn,
        dueOn: invoice.dueOn,
        currency: invoice.currency,
        status,
        statusLabel: invoiceStatusLabel(status),
        totalMinor: invoiceTotalMinor(invoice),
        paidMinor: invoicePaidMinor(invoice),
        dueMinor: invoiceDueMinor(invoice),
        lines: invoice.lines,
      };
    }),
  });
}
