import test from "node:test";
import assert from "node:assert/strict";

import { INVOICES, TICKETS, PORTAL_TODAY } from "../lib/data.ts";
import {
  invoiceSubtotalMinor, invoiceTaxMinor, invoiceTotalMinor, invoicePaidMinor,
  invoiceDueMinor, deriveInvoiceStatus, summarizeInvoices, filterInvoices,
  sortInvoicesNewestFirst, getInvoiceById, daysLate, ticketFirstResponseMinutes,
  averageFirstResponseMinutes, filterTickets, ticketCounts, latestTicketMessage,
  ticketStatusLabel, invoiceStatusLabel,
} from "../lib/selectors.ts";

test("invoice totals are integer minor units and tax rounds once", () => {
  const invoice = getInvoiceById(INVOICES, "inv-1004");
  assert.ok(invoice);
  assert.equal(invoiceSubtotalMinor(invoice), 390_000);
  assert.equal(invoiceTaxMinor(invoice), 34_632);
  assert.equal(invoiceTotalMinor(invoice), 424_632);
  assert.equal(invoicePaidMinor(invoice), 424_632);
  assert.equal(invoiceDueMinor(invoice), 0);
});

test("status is derived from payments and the due date", () => {
  const overdue = getInvoiceById(INVOICES, "inv-1001");
  const partial = getInvoiceById(INVOICES, "inv-1002");
  const paid = getInvoiceById(INVOICES, "inv-1003");
  const draft = getInvoiceById(INVOICES, "inv-1007");
  const voided = getInvoiceById(INVOICES, "inv-1008");
  assert.ok(overdue && partial && paid && draft && voided);
  assert.equal(deriveInvoiceStatus(overdue), "overdue");
  assert.equal(deriveInvoiceStatus(partial), "partial");
  assert.equal(deriveInvoiceStatus(paid), "paid");
  assert.equal(deriveInvoiceStatus(draft), "draft");
  assert.equal(deriveInvoiceStatus(voided), "void");
  assert.equal(daysLate(overdue), 28);
});

test("an invoice due today is still open, not overdue", () => {
  const invoice = getInvoiceById(INVOICES, "inv-1001");
  assert.ok(invoice);
  assert.equal(deriveInvoiceStatus(invoice, "2026-10-01"), "open");
  assert.equal(deriveInvoiceStatus(invoice, "2026-10-02"), "overdue");
});

test("summary excludes drafts and voids and splits paid from due", () => {
  const summary = summarizeInvoices(INVOICES);
  assert.equal(summary.openCount, 5);
  assert.equal(summary.overdueCount, 1);
  assert.equal(summary.paidCount, 3);
  assert.equal(summary.overdueMinor, 256_250);
  assert.equal(summary.dueMinor, 1_045_850);
  assert.equal(summary.paidMinor + summary.dueMinor, summary.totalMinor);
});

test("payments never make the balance negative", () => {
  const overpaid = {
    ...INVOICES[0],
    payments: [{ id: "p", amountMinor: 999_999, paidOn: "2026-10-01", method: "Card" }],
  };
  assert.equal(invoiceDueMinor(overpaid), 0);
  assert.equal(deriveInvoiceStatus(overpaid), "paid");
});

test("filtering matches number and line descriptions", () => {
  assert.deepEqual(filterInvoices(INVOICES, { query: "atl-2026-0107" }).map((row) => row.id), ["inv-1001"]);
  assert.deepEqual(filterInvoices(INVOICES, { query: "priority support" }).map((row) => row.id), ["inv-1010", "inv-1008", "inv-1002"]);
  assert.equal(filterInvoices(INVOICES, { query: "nothing here" }).length, 0);
});

test("filtering by status uses the derived status", () => {
  assert.deepEqual(filterInvoices(INVOICES, { status: "paid" }).map((row) => row.id), ["inv-1003", "inv-1004", "inv-1009"]);
  assert.equal(filterInvoices(INVOICES, { status: "overdue" }).length, 1);
  assert.equal(filterInvoices(INVOICES, { status: "draft" }).length, 1);
});

test("invoices sort newest first and can be looked up by id", () => {
  const sorted = sortInvoicesNewestFirst(INVOICES);
  assert.equal(sorted[0].id, "inv-1007");
  assert.equal(sorted.at(-1)?.id, "inv-1009");
  assert.equal(getInvoiceById(INVOICES, "nope"), undefined);
});

test("first response time is measured from the first customer message", () => {
  const ticket = TICKETS[0];
  assert.equal(ticketFirstResponseMinutes(ticket), 42);
  const resolved = TICKETS[3];
  assert.equal(ticketFirstResponseMinutes(resolved), 36);
});

test("tickets with no agent reply have no response time", () => {
  const ticket = { ...TICKETS[0], messages: TICKETS[0].messages.slice(0, 1) };
  assert.equal(ticketFirstResponseMinutes(ticket), null);
});

test("the median first response ignores missing values", () => {
  const value = averageFirstResponseMinutes(TICKETS);
  assert.ok(value !== null);
  assert.equal(Number.isInteger(value), true);
  assert.ok(value > 0 && value < 600);
});

test("ticket filters combine status and free text", () => {
  assert.equal(filterTickets(TICKETS, { status: "open" }).length, 4);
  assert.deepEqual(filterTickets(TICKETS, { query: "sso" }).map((row) => row.id), ["tkt-202"]);
  assert.deepEqual(filterTickets(TICKETS, { query: "exports" }).map((row) => row.id), ["tkt-201", "tkt-207"]);
  assert.equal(filterTickets(TICKETS, { query: "ATL-4821" }).length, 1);
});

test("ticket counts cover every status and labels read correctly", () => {
  assert.deepEqual(ticketCounts(TICKETS), { open: 4, waiting: 2, resolved: 2 });
  assert.equal(ticketStatusLabel("waiting"), "Waiting on you");
  assert.equal(invoiceStatusLabel("partial"), "Part paid");
});

test("the latest message is the newest timestamp, not the last array entry", () => {
  const shuffled = { ...TICKETS[0], messages: [...TICKETS[0].messages].reverse() };
  assert.equal(latestTicketMessage(shuffled)?.id, "msg-4");
});

test("the fixed portal clock is consistent with the seeded data", () => {
  assert.equal(PORTAL_TODAY, "2026-10-29");
  assert.ok(INVOICES.some((invoice) => deriveInvoiceStatus(invoice) === "overdue"));
});
