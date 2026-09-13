/**
 * The portal's data model. Money is an integer count of minor units and dates
 * are calendar keys ("YYYY-MM-DD"), the same rules used across Arvion projects.
 * Nothing here is framework-specific, which is why the unit tests can exercise
 * it without booting Next.
 */

export type Currency = "USD";

export type InvoiceStatus = "draft" | "open" | "partial" | "overdue" | "paid" | "void";

export type TicketStatus = "open" | "waiting" | "resolved";
export type TicketPriority = "urgent" | "high" | "normal" | "low";
export type TicketAuthor = "customer" | "agent";

export interface InvoiceLine {
  description: string;
  detail?: string;
  quantity: number;
  unitPriceMinor: number;
}

export interface Payment {
  id: string;
  amountMinor: number;
  paidOn: string;
  method: string;
}

export interface Invoice {
  id: string;
  number: string;
  issuedOn: string;
  dueOn: string;
  currency: Currency;
  lines: InvoiceLine[];
  taxBasisPoints: number;
  payments: Payment[];
  draft?: boolean;
  voided?: boolean;
  note?: string;
}

export interface TicketMessage {
  id: string;
  author: TicketAuthor;
  authorName: string;
  sentOn: string;
  body: string;
}

export interface Ticket {
  id: string;
  number: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  messages: TicketMessage[];
}

export interface AccountUser {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Billing" | "Member";
  status: "active" | "invited";
}

export interface Account {
  name: string;
  legalName: string;
  plan: string;
  seats: number;
  region: string;
  billingEmail: string;
  owner: string;
  customerSince: string;
  renewalOn: string;
  apiKeyMasked: string;
  balanceCurrency: Currency;
  users: AccountUser[];
}

export interface MoneySummary {
  totalMinor: number;
  paidMinor: number;
  dueMinor: number;
  overdueMinor: number;
  openCount: number;
  overdueCount: number;
  paidCount: number;
}
