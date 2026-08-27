/**
 * The sample workspace for the Atlas customer portal.
 *
 * The portal clock is pinned to 29 October 2026. A live portal would use the
 * server clock, but a fixed clock keeps statuses, screenshots and tests in sync
 * and makes the overdue invoice actually overdue on any day you run the demo.
 * The README says so in the limitations section.
 */

import type { Account, Invoice, Ticket } from "./types.ts";

export const PORTAL_TODAY = "2026-10-29";

export const ACCOUNT: Account = {
  name: "Northwind Labs",
  legalName: "Northwind Labs, Inc.",
  plan: "Scale",
  seats: 24,
  region: "us-east-1",
  billingEmail: "billing@northwindlabs.example",
  owner: "Alex Rivera",
  customerSince: "2024-03-11",
  renewalOn: "2027-03-11",
  apiKeyMasked: "atlas_live_sk_4f19_9c2e_7a0d",
  balanceCurrency: "USD",
  users: [
    { id: "usr-1", name: "Alex Rivera", email: "alex@northwindlabs.example", role: "Owner", status: "active" },
    { id: "usr-2", name: "Priya Nair", email: "priya@northwindlabs.example", role: "Admin", status: "active" },
    { id: "usr-3", name: "Jonas Berg", email: "jonas@northwindlabs.example", role: "Billing", status: "active" },
    { id: "usr-4", name: "Maya Trudeau", email: "maya@northwindlabs.example", role: "Member", status: "invited" },
    { id: "usr-5", name: "Tom Ashby", email: "tom@northwindlabs.example", role: "Member", status: "active" },
  ],
};

export const INVOICES: Invoice[] = [
  {
    id: "inv-1001",
    number: "ATL-2026-0107",
    issuedOn: "2026-09-01",
    dueOn: "2026-10-01",
    currency: "USD",
    taxBasisPoints: 0,
    lines: [
      { description: "Scale plan, October", detail: "24 seats, billed monthly", quantity: 1, unitPriceMinor: 240_000 },
      { description: "Additional seats", detail: "4 seats above the plan allowance", quantity: 4, unitPriceMinor: 3_000 },
      { description: "API overage", detail: "342,000 calls beyond the included 2M", quantity: 1, unitPriceMinor: 4_250 },
    ],
    payments: [],
    note: "Payment terms are net 30. Late payments pause non-critical support after 14 days.",
  },
  {
    id: "inv-1002",
    number: "ATL-2026-0114",
    issuedOn: "2026-10-01",
    dueOn: "2026-10-31",
    currency: "USD",
    taxBasisPoints: 0,
    lines: [
      { description: "Scale plan, November", detail: "24 seats, billed monthly", quantity: 1, unitPriceMinor: 240_000 },
      { description: "Additional seats", detail: "4 seats above the plan allowance", quantity: 4, unitPriceMinor: 3_000 },
      { description: "Priority support", detail: "Business-hours response target", quantity: 1, unitPriceMinor: 50_000 },
    ],
    payments: [{ id: "pay-2001", amountMinor: 100_000, paidOn: "2026-10-12", method: "Bank transfer" }],
  },
  {
    id: "inv-1003",
    number: "ATL-2026-0101",
    issuedOn: "2026-09-01",
    dueOn: "2026-09-15",
    currency: "USD",
    taxBasisPoints: 0,
    lines: [
      { description: "Scale plan, September", detail: "24 seats, billed monthly", quantity: 1, unitPriceMinor: 240_000 },
      { description: "API overage", quantity: 1, unitPriceMinor: 4_250 },
      { description: "Additional seats", quantity: 4, unitPriceMinor: 3_000 },
    ],
    payments: [{ id: "pay-2002", amountMinor: 256_250, paidOn: "2026-09-14", method: "Card" }],
  },
  {
    id: "inv-1004",
    number: "ATL-2026-0092",
    issuedOn: "2026-08-01",
    dueOn: "2026-08-15",
    currency: "USD",
    taxBasisPoints: 888,
    lines: [
      { description: "Scale plan, August", detail: "24 seats, billed monthly", quantity: 1, unitPriceMinor: 240_000 },
      { description: "Implementation review", detail: "Two remote sessions with a solutions engineer", quantity: 1, unitPriceMinor: 150_000 },
    ],
    payments: [{ id: "pay-2003", amountMinor: 424_632, paidOn: "2026-08-12", method: "Bank transfer" }],
    note: "Sales tax applied at 8.88% for the implementation review.",
  },
  {
    id: "inv-1005",
    number: "ATL-2026-0078",
    issuedOn: "2026-07-01",
    dueOn: "2026-07-31",
    currency: "USD",
    taxBasisPoints: 0,
    lines: [
      { description: "Scale plan, July", detail: "24 seats, billed monthly", quantity: 1, unitPriceMinor: 240_000 },
      { description: "Additional seats", quantity: 3, unitPriceMinor: 3_000 },
    ],
    payments: [{ id: "pay-2004", amountMinor: 100_000, paidOn: "2026-07-18", method: "Bank transfer" }],
  },
  {
    id: "inv-1006",
    number: "ATL-2026-0116",
    issuedOn: "2026-10-20",
    dueOn: "2026-11-19",
    currency: "USD",
    taxBasisPoints: 0,
    lines: [
      { description: "Scale plan, November", detail: "24 seats, billed monthly", quantity: 1, unitPriceMinor: 240_000 },
      { description: "Sandbox environment", detail: "Staging workspace with 7-day retention", quantity: 1, unitPriceMinor: 18_600 },
    ],
    payments: [],
  },
  {
    id: "inv-1007",
    number: "ATL-2026-0118",
    issuedOn: "2026-10-28",
    dueOn: "2026-11-27",
    currency: "USD",
    taxBasisPoints: 0,
    lines: [
      { description: "Scale plan, December", detail: "24 seats, billed monthly", quantity: 1, unitPriceMinor: 240_000 },
      { description: "Additional seats", quantity: 4, unitPriceMinor: 3_000 },
    ],
    payments: [],
    draft: true,
  },
  {
    id: "inv-1008",
    number: "ATL-2026-0112",
    issuedOn: "2026-10-05",
    dueOn: "2026-11-04",
    currency: "USD",
    taxBasisPoints: 0,
    lines: [
      { description: "Scale plan, November", quantity: 1, unitPriceMinor: 240_000 },
      { description: "Priority support", quantity: 1, unitPriceMinor: 50_000 },
    ],
    payments: [],
    voided: true,
    note: "Voided after a billing entity change. Reissued as ATL-2026-0114.",
  },
  {
    id: "inv-1009",
    number: "ATL-2026-0061",
    issuedOn: "2026-06-01",
    dueOn: "2026-06-30",
    currency: "USD",
    taxBasisPoints: 0,
    lines: [
      { description: "Scale plan, June", detail: "24 seats, billed monthly", quantity: 1, unitPriceMinor: 240_000 },
      { description: "Additional seats", quantity: 2, unitPriceMinor: 3_000 },
    ],
    payments: [{ id: "pay-2005", amountMinor: 246_000, paidOn: "2026-06-24", method: "Card" }],
  },
  {
    id: "inv-1010",
    number: "ATL-2026-0117",
    issuedOn: "2026-10-25",
    dueOn: "2026-11-09",
    currency: "USD",
    taxBasisPoints: 0,
    lines: [
      { description: "Annual support renewal", detail: "Priority support through October 2027", quantity: 1, unitPriceMinor: 180_000 },
    ],
    payments: [],
  },
];

export const TICKETS: Ticket[] = [
  {
    id: "tkt-201",
    number: "ATL-4821",
    subject: "Exports fail above 50,000 rows",
    status: "open",
    priority: "urgent",
    createdAt: "2026-10-28",
    updatedAt: "2026-10-29",
    tags: ["exports", "bug"],
    messages: [
      {
        id: "msg-1",
        author: "customer",
        authorName: "Priya Nair",
        sentOn: "2026-10-28T09:12:00Z",
        body: "Every CSV export over roughly 50,000 rows fails with a gateway timeout after 30 seconds. Smaller exports work. This is blocking our month-end reconciliation.",
      },
      {
        id: "msg-2",
        author: "agent",
        authorName: "Asha Karki",
        sentOn: "2026-10-28T09:54:00Z",
        body: "I reproduced this with 60,000 rows. The export runs synchronously inside the request, so the gateway cuts it off. I have raised it with the platform team as a high-priority defect and will update you with a fix window.",
      },
      {
        id: "msg-3",
        author: "customer",
        authorName: "Priya Nair",
        sentOn: "2026-10-28T10:20:00Z",
        body: "Thank you. A workaround for this month would help more than a long-term fix. Could we split the export by date range?",
      },
      {
        id: "msg-4",
        author: "agent",
        authorName: "Asha Karki",
        sentOn: "2026-10-29T08:05:00Z",
        body: "Yes. Filters are applied before the row limit, so exporting one month at a time stays under the limit. I have attached a saved filter to your workspace and the platform team is testing an async job path.",
      },
    ],
  },
  {
    id: "tkt-202",
    number: "ATL-4817",
    subject: "Add SSO for our finance team",
    status: "waiting",
    priority: "high",
    createdAt: "2026-10-24",
    updatedAt: "2026-10-27",
    tags: ["sso", "account"],
    messages: [
      {
        id: "msg-5",
        author: "customer",
        authorName: "Jonas Berg",
        sentOn: "2026-10-24T14:30:00Z",
        body: "Our finance team needs to sign in through our identity provider. We are on Google Workspace today and the setup page only offers password login for them.",
      },
      {
        id: "msg-6",
        author: "agent",
        authorName: "Bibek Shrestha",
        sentOn: "2026-10-24T15:18:00Z",
        body: "SSO is available on the Scale plan. I have enabled the SAML configuration for your workspace and sent the metadata link to your admin address. Once you upload it on the IdP side, the finance group can be assigned the Billing role.",
      },
      {
        id: "msg-7",
        author: "agent",
        authorName: "Bibek Shrestha",
        sentOn: "2026-10-27T11:02:00Z",
        body: "Following up: the configuration is still waiting for the IdP metadata upload. Let me know if you want a short call to walk through it.",
      },
    ],
  },
  {
    id: "tkt-203",
    number: "ATL-4813",
    subject: "Invoice shows the wrong VAT number",
    status: "open",
    priority: "normal",
    createdAt: "2026-10-26",
    updatedAt: "2026-10-28",
    tags: ["billing", "invoice"],
    messages: [
      {
        id: "msg-8",
        author: "customer",
        authorName: "Jonas Berg",
        sentOn: "2026-10-26T08:40:00Z",
        body: "Invoice ATL-2026-0114 lists an old VAT number. Our finance system rejects it. Can you reissue it with the number on file in Settings?",
      },
      {
        id: "msg-9",
        author: "agent",
        authorName: "Rohan Gurung",
        sentOn: "2026-10-26T09:25:00Z",
        body: "The invoice inherited the number from the billing profile before your last update. I can reissue it with the current number, but the original will stay on record as void. Confirm and I will send the replacement today.",
      },
    ],
  },
  {
    id: "tkt-204",
    number: "ATL-4809",
    subject: "API rate limit questions",
    status: "resolved",
    priority: "normal",
    createdAt: "2026-10-21",
    updatedAt: "2026-10-22",
    tags: ["api"],
    messages: [
      {
        id: "msg-10",
        author: "customer",
        authorName: "Tom Ashby",
        sentOn: "2026-10-21T11:05:00Z",
        body: "What happens when we exceed 100 requests per second? We see 429s but no Retry-After header in our test harness.",
      },
      {
        id: "msg-11",
        author: "agent",
        authorName: "Asha Karki",
        sentOn: "2026-10-21T11:41:00Z",
        body: "The limiter returns Retry-After in seconds on every 429. If your client is stripping headers through the proxy, that would explain it. I have attached the response from our side and a short curl example.",
      },
      {
        id: "msg-12",
        author: "customer",
        authorName: "Tom Ashby",
        sentOn: "2026-10-22T09:14:00Z",
        body: "The header was being dropped by our gateway. Fixed on our side, thanks.",
      },
    ],
  },
  {
    id: "tkt-205",
    number: "ATL-4806",
    subject: "Dashboard slow for large workspaces",
    status: "open",
    priority: "high",
    createdAt: "2026-10-23",
    updatedAt: "2026-10-28",
    tags: ["performance", "dashboard"],
    messages: [
      {
        id: "msg-13",
        author: "customer",
        authorName: "Priya Nair",
        sentOn: "2026-10-23T16:20:00Z",
        body: "The overview takes six to nine seconds to load for our workspace. Smaller client workspaces load in under a second. Is this related to the export issue?",
      },
      {
        id: "msg-14",
        author: "agent",
        authorName: "Bibek Shrestha",
        sentOn: "2026-10-23T17:10:00Z",
        body: "Probably not. Your workspace has 1.8 million events in the 30-day window and the overview aggregates them on each request. We are testing a pre-aggregated daily rollup that should bring this under a second.",
      },
    ],
  },
  {
    id: "tkt-206",
    number: "ATL-4802",
    subject: "Invite two analysts for a client project",
    status: "waiting",
    priority: "low",
    createdAt: "2026-10-19",
    updatedAt: "2026-10-20",
    tags: ["seats", "account"],
    messages: [
      {
        id: "msg-15",
        author: "customer",
        authorName: "Alex Rivera",
        sentOn: "2026-10-19T10:02:00Z",
        body: "We are at 24 of 24 seats. I need two temporary analyst seats for a six-week client project. Can those be added without changing the annual commitment?",
      },
      {
        id: "msg-16",
        author: "agent",
        authorName: "Nisha Tamang",
        sentOn: "2026-10-19T10:48:00Z",
        body: "Yes, seats can be added monthly on top of the annual plan. I have prepared a quote for two seats for six weeks. Send me the two email addresses and I will provision them once you approve the quote.",
      },
    ],
  },
  {
    id: "tkt-207",
    number: "ATL-4798",
    subject: "Export format for the data warehouse",
    status: "resolved",
    priority: "normal",
    createdAt: "2026-10-14",
    updatedAt: "2026-10-16",
    tags: ["exports", "api"],
    messages: [
      {
        id: "msg-17",
        author: "customer",
        authorName: "Tom Ashby",
        sentOn: "2026-10-14T13:15:00Z",
        body: "We want nightly events in Parquet. Is the S3 export on the roadmap, or should we build against the API?",
      },
      {
        id: "msg-18",
        author: "agent",
        authorName: "Asha Karki",
        sentOn: "2026-10-14T14:03:00Z",
        body: "Parquet export to your own bucket is available as a beta for Scale workspaces. It runs at 02:00 UTC and writes partitioned files by day. I can enable it for one bucket today.",
      },
      {
        id: "msg-19",
        author: "customer",
        authorName: "Tom Ashby",
        sentOn: "2026-10-16T08:30:00Z",
        body: "Beta is fine. Bucket name sent by email, and the first run landed correctly.",
      },
    ],
  },
  {
    id: "tkt-208",
    number: "ATL-4795",
    subject: "Change billing contact before renewal",
    status: "open",
    priority: "normal",
    createdAt: "2026-10-18",
    updatedAt: "2026-10-27",
    tags: ["billing", "account"],
    messages: [
      {
        id: "msg-20",
        author: "customer",
        authorName: "Alex Rivera",
        sentOn: "2026-10-18T09:40:00Z",
        body: "Our finance director is retiring. Please move all billing notices to billing@northwindlabs.example and add Jonas as the billing admin. The renewal is in March.",
      },
      {
        id: "msg-21",
        author: "agent",
        authorName: "Rohan Gurung",
        sentOn: "2026-10-18T10:22:00Z",
        body: "Done for the billing email and Jonas has the Billing role. One thing to confirm: the renewal reminder is still addressed to the old director by name. I can remove that contact entirely if you prefer.",
      },
    ],
  },
];

export const USAGE = {
  apiCalls: 1_842_000,
  apiIncluded: 2_000_000,
  storageGb: 84,
  storageIncluded: 100,
  seatsUsed: 24,
  seatsIncluded: 24,
  lastThirtyDays: [62, 68, 71, 66, 74, 79, 73, 81, 86, 83, 88, 91, 87, 92],
};

export const TEAM = [
  { name: "Asha Karki", role: "Support lead", initials: "AK" },
  { name: "Bibek Shrestha", role: "Support engineer", initials: "BS" },
  { name: "Rohan Gurung", role: "Billing specialist", initials: "RG" },
];

export const API_SUMMARY = {
  account: ACCOUNT.name,
  plan: ACCOUNT.plan,
  invoiceCount: INVOICES.length,
  ticketCount: TICKETS.length,
  today: PORTAL_TODAY,
};
