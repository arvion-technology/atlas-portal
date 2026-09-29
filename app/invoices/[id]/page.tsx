import Link from "next/link";
import { notFound } from "next/navigation";

import { ACCOUNT, INVOICES, PORTAL_TODAY } from "@/lib/data.ts";
import { daysBetween, formatDateKey, formatMoney } from "@/lib/format.ts";
import {
  daysLate, deriveInvoiceStatus, invoiceDueMinor, invoicePaidMinor, invoiceStatusLabel,
  invoiceSubtotalMinor, invoiceTaxMinor, invoiceTotalMinor,
} from "@/lib/selectors.ts";
import { StatusPill } from "@/components/ui.tsx";

export const dynamicParams = false;

export function generateStaticParams() {
  return INVOICES.map((invoice) => ({ id: invoice.id }));
}

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = INVOICES.find((row) => row.id === id);
  if (!invoice) notFound();

  const status = deriveInvoiceStatus(invoice, PORTAL_TODAY);
  const subtotal = invoiceSubtotalMinor(invoice);
  const tax = invoiceTaxMinor(invoice);
  const total = invoiceTotalMinor(invoice);
  const paid = invoicePaidMinor(invoice);
  const due = invoiceDueMinor(invoice);
  const terms = daysBetween(invoice.issuedOn, invoice.dueOn);

  return (
    <div className="page invoice-detail-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/invoices/">Invoices</Link>
        <span aria-hidden="true">/</span>
        <span>{invoice.number}</span>
      </nav>

      <section className="invoice-hero card">
        <div>
          <p className="eyebrow">Invoice</p>
          <h1>{invoice.number}</h1>
          <p className="muted">
            Issued {formatDateKey(invoice.issuedOn)}. Payment terms net {terms} days.
            {status === "overdue" ? ` ${daysLate(invoice, PORTAL_TODAY)} days past due.` : ""}
          </p>
        </div>
        <div className="invoice-hero-side">
          <StatusPill status={status} label={invoiceStatusLabel(status)} />
          <div className="amount-due">
            <span className="muted">Balance due</span>
            <strong>{formatMoney(due)}</strong>
          </div>
          <div className="hero-actions">
            <a className="button primary" href="#payments">Payment methods</a>
            <button className="button ghost" type="button" title="PDF generation is outside this reference implementation">
              Download PDF
            </button>
          </div>
        </div>
      </section>

      <div className="invoice-meta-grid">
        <section className="card">
          <h2>Billed to</h2>
          <p className="strong">{ACCOUNT.legalName}</p>
          <p className="muted">{ACCOUNT.billingEmail}</p>
          <p className="muted">24 Mercer Street, Suite 400, New York, NY 10013</p>
          <p className="muted">Tax ID 88-0412399</p>
        </section>
        <section className="card">
          <h2>From</h2>
          <p className="strong">Atlas Technologies, Inc.</p>
          <p className="muted">2261 Market Street #4412, San Francisco, CA 94114</p>
          <p className="muted">billing@atlasportal.example</p>
          <p className="muted">Tax ID 94-5521038</p>
        </section>
        <section className="card invoice-dates">
          <dl className="detail-list">
            <div><dt>Issued</dt><dd>{formatDateKey(invoice.issuedOn)}</dd></div>
            <div><dt>Due</dt><dd>{formatDateKey(invoice.dueOn)}</dd></div>
            <div><dt>Terms</dt><dd>Net {terms}</dd></div>
            <div><dt>Currency</dt><dd>{invoice.currency}</dd></div>
          </dl>
        </section>
      </div>

      <section className="card invoice-lines-card">
        <h2>Line items</h2>
        <div className="table-wrap flush">
          <table className="data-table line-table">
            <thead>
              <tr><th>Description</th><th className="num">Qty</th><th className="num">Unit price</th><th className="num">Amount</th></tr>
            </thead>
            <tbody>
              {invoice.lines.map((line) => (
                <tr key={line.description}>
                  <td>
                    <span className="strong">{line.description}</span>
                    {line.detail ? <span className="cell-sub">{line.detail}</span> : null}
                  </td>
                  <td className="num">{line.quantity}</td>
                  <td className="num">{formatMoney(line.unitPriceMinor)}</td>
                  <td className="num">{formatMoney(line.quantity * line.unitPriceMinor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="invoice-totals">
          <div><span>Subtotal</span><span>{formatMoney(subtotal)}</span></div>
          <div><span>Tax</span><span>{formatMoney(tax)}</span></div>
          <div className="total-line"><span>Total</span><span>{formatMoney(total)}</span></div>
          <div><span>Paid</span><span>{paid ? `-${formatMoney(paid)}` : formatMoney(0)}</span></div>
          <div className="balance-line"><span>Balance due</span><span>{formatMoney(due)}</span></div>
        </div>
      </section>

      <div className="invoice-bottom-grid">
        <section className="card" id="payments">
          <h2>Payment history</h2>
          {invoice.payments.length ? (
            <div className="table-wrap flush">
              <table className="data-table compact">
                <thead><tr><th>Date</th><th>Method</th><th className="num">Amount</th></tr></thead>
                <tbody>
                  {invoice.payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{formatDateKey(payment.paidOn)}</td>
                      <td className="muted">{payment.method}</td>
                      <td className="num">{formatMoney(payment.amountMinor)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="muted">No payments recorded. Bank transfer details are on the invoice PDF.</p>
          )}
          {invoice.note ? <p className="invoice-note">{invoice.note}</p> : null}
        </section>
        <section className="card quiet-card">
          <h2>Payment methods</h2>
          <p>Pay by bank transfer to the account on the invoice, or by card from the billing contact.</p>
          <p className="muted">Invoices are issued in USD. Card payments settle in the same currency and may carry a bank conversion fee.</p>
          <p className="muted small">This is a reference implementation. No real charge is made from this page.</p>
        </section>
      </div>
    </div>
  );
}
