import Link from "next/link";
import { notFound } from "next/navigation";

import { ACCOUNT, TICKETS } from "@/lib/data.ts";
import { TicketThread } from "@/components/TicketThread";

export const dynamicParams = false;

export function generateStaticParams() {
  return TICKETS.map((ticket) => ({ id: ticket.id }));
}

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = TICKETS.find((row) => row.id === id);
  if (!ticket) notFound();

  return (
    <div className="page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/tickets/">Support</Link>
        <span aria-hidden="true">/</span>
        <span>{ticket.number}</span>
      </nav>
      <TicketThread ticket={ticket} ownerName={ACCOUNT.owner} />
    </div>
  );
}
