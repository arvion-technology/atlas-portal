import test from "node:test";
import assert from "node:assert/strict";

import { ACCOUNT, INVOICES, TICKETS, USAGE, API_SUMMARY } from "../lib/data.ts";
import { invoiceTotalMinor, invoicePaidMinor, deriveInvoiceStatus } from "../lib/selectors.ts";

test("ids and invoice numbers are unique", () => {
  assert.equal(new Set(INVOICES.map((invoice) => invoice.id)).size, INVOICES.length);
  assert.equal(new Set(INVOICES.map((invoice) => invoice.number)).size, INVOICES.length);
  assert.equal(new Set(TICKETS.map((ticket) => ticket.id)).size, TICKETS.length);
  assert.equal(new Set(TICKETS.map((ticket) => ticket.number)).size, TICKETS.length);
});

test("every invoice has at least one line and consistent dates", () => {
  for (const invoice of INVOICES) {
    assert.ok(invoice.lines.length >= 1, invoice.number);
    assert.ok(invoice.dueOn > invoice.issuedOn, invoice.number);
    assert.ok(invoiceTotalMinor(invoice) > 0, invoice.number);
    assert.ok(invoicePaidMinor(invoice) >= 0, invoice.number);
  }
});

test("the workspace has a mixture of invoice states", () => {
  const states = new Set(INVOICES.map((invoice) => deriveInvoiceStatus(invoice)));
  for (const state of ["overdue", "partial", "paid", "draft", "void", "open"]) {
    assert.ok(states.has(state as never), `missing ${state}`);
  }
});

test("every ticket has a customer message first and a known status", () => {
  for (const ticket of TICKETS) {
    assert.equal(ticket.messages[0].author, "customer", ticket.number);
    assert.ok(["open", "waiting", "resolved"].includes(ticket.status));
    assert.ok(ticket.messages.length >= 2, ticket.number);
    assert.ok(ticket.updatedAt >= ticket.createdAt, ticket.number);
  }
});

test("the account and usage snapshot are internally coherent", () => {
  assert.equal(ACCOUNT.users.filter((user) => user.status === "active").length, 4);
  assert.equal(ACCOUNT.users.length, 5);
  assert.equal(USAGE.seatsUsed, ACCOUNT.seats);
  assert.ok(USAGE.apiCalls <= USAGE.apiIncluded);
  assert.equal(API_SUMMARY.account, ACCOUNT.name);
  assert.equal(API_SUMMARY.invoiceCount, INVOICES.length);
});
