"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { Invoice, InvoiceStatus } from "@/lib/types.ts";
import { formatDateKey, formatMoney } from "@/lib/format.ts";
import {
  daysLate, deriveInvoiceStatus, filterInvoices, invoiceDueMinor, invoiceStatusLabel,
  invoiceTotalMinor,
} from "@/lib/selectors.ts";
import { StatusPill } from "@/components/ui.tsx";

const STATUS_OPTIONS: Array<{ value: InvoiceStatus | "all"; label: string }> = [
  { value: "all", label: "All invoices" },
  { value: "open", label: "Open" },
  { value: "partial", label: "Part paid" },
  { value: "overdue", label: "Overdue" },
  { value: "paid", label: "Paid" },
  { value: "draft", label: "Draft" },
  { value: "void", label: "Void" },
];

export function InvoiceExplorer({ invoices, today }: { invoices: Invoice[]; today: string }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<InvoiceStatus | "all">("all");

  const rows = useMemo(
    () => filterInvoices(invoices, { query, status }, today),
    [invoices, query, status, today],
  );

  return (
    <section className="card invoice-explorer" aria-label="Invoice list">
      <div className="explorer-toolbar">
        <label className="search-field">
          <span className="sr-only">Search invoices</span>
          <input
            id="invoice-search"
            type="search"
            placeholder="Search number or line item"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label className="select-field">
          <span className="sr-only">Filter by status</span>
          <select
            id="invoice-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as InvoiceStatus | "all")}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <p className="explorer-count" id="invoice-count">
          {rows.length} of {invoices.length} invoices
        </p>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Invoice</th>
              <th scope="col">Issued</th>
              <th scope="col">Due</th>
              <th scope="col" className="num">Total</th>
              <th scope="col" className="num">Balance</th>
              <th scope="col">Status</th>
              <th scope="col"><span className="sr-only">Open</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((invoice) => {
              const derived = deriveInvoiceStatus(invoice, today);
              const searchText = [
                invoice.number,
                ...invoice.lines.map((line) => `${line.description} ${line.detail ?? ""}`),
              ].join(" ").toLowerCase();
              return (
                <tr
                  key={invoice.id}
                  data-invoice-row
                  data-status={derived}
                  data-search={searchText}
                >
                  <td>
                    <Link className="table-link" href={`/invoices/${invoice.id}/`}>{invoice.number}</Link>
                    <span className="cell-sub">{invoice.lines[0]?.description}</span>
                  </td>
                  <td className="muted">{formatDateKey(invoice.issuedOn)}</td>
                  <td className="muted">
                    {formatDateKey(invoice.dueOn)}
                    {derived === "overdue" ? <span className="cell-warning">{daysLate(invoice, today)} days late</span> : null}
                  </td>
                  <td className="num">{formatMoney(invoiceTotalMinor(invoice))}</td>
                  <td className="num strong">{formatMoney(invoiceDueMinor(invoice))}</td>
                  <td><StatusPill status={derived} label={invoiceStatusLabel(derived)} /></td>
                  <td className="num"><Link className="text-link" href={`/invoices/${invoice.id}/`}>View</Link></td>
                </tr>
              );
            })}
            {rows.length === 0 ? (
              <tr id="invoice-empty">
                <td colSpan={7} className="empty-cell">No invoices match this filter.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
