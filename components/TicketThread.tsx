"use client";

import { useState } from "react";

import type { Ticket, TicketMessage } from "@/lib/types.ts";
import { formatDateTime, initials } from "@/lib/format.ts";
import { ticketStatusLabel } from "@/lib/selectors.ts";
import { StatusPill } from "@/components/ui.tsx";

const QUICK_REPLIES = [
  "Could you give us a rough fix window?",
  "We can test a workaround on our side today.",
  "This is still blocking our month-end close.",
];

export function TicketThread({ ticket, ownerName }: { ticket: Ticket; ownerName: string }) {
  const [messages, setMessages] = useState<TicketMessage[]>(ticket.messages);
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState(ticket.status);
  const [notice, setNotice] = useState<string | null>(null);

  function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = reply.trim();
    if (!body) {
      setNotice("Write a reply before sending.");
      return;
    }
    const next: TicketMessage = {
      id: `local-${messages.length + 1}`,
      author: "customer",
      authorName: ownerName,
      sentOn: "2026-10-29T12:00:00Z",
      body,
    };
    setMessages([...messages, next]);
    setReply("");
    setStatus("open");
    setNotice("Reply added to this browser session. The real app posts it to the ticket API.");
  }

  return (
    <div className="thread-layout">
      <section className="card thread-card" aria-label="Ticket conversation">
        <header className="thread-head">
          <div>
            <span className="eyebrow">Ticket {ticket.number}</span>
            <h1>{ticket.subject}</h1>
            <p className="muted">
              Opened {formatDateTime(ticket.messages[0].sentOn)} by {ticket.messages[0].authorName}
            </p>
          </div>
          <StatusPill status={status} label={ticketStatusLabel(status)} />
        </header>

        <ol className="thread" id="ticket-thread">
          {messages.map((message) => (
            <li key={message.id} className={`thread-message message-${message.author}`}>
              <span className={`thread-avatar avatar-${message.author}`} aria-hidden="true">
                {initials(message.authorName)}
              </span>
              <div className="thread-bubble">
                <div className="thread-meta">
                  <strong>{message.authorName}</strong>
                  <span>{message.author === "agent" ? "Atlas support" : "Customer"}</span>
                  <time dateTime={message.sentOn}>{formatDateTime(message.sentOn)}</time>
                </div>
                <p>{message.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <form className="reply-form" id="reply-form" onSubmit={send}>
          <label className="reply-label" htmlFor="reply-body">Reply to support</label>
          <textarea
            id="reply-body"
            rows={4}
            value={reply}
            onChange={(event) => setReply(event.target.value)}
            placeholder="Add context, a screenshot link or the result of a workaround."
          />
          <div className="quick-replies">
            {QUICK_REPLIES.map((text) => (
              <button key={text} type="button" className="quick-reply" onClick={() => setReply(text)}>
                {text}
              </button>
            ))}
          </div>
          <div className="reply-actions">
            <span className="reply-note">Replies are stored in this browser only in the static demo.</span>
            <button type="submit" className="button primary">Send reply</button>
          </div>
          {notice ? <p className="form-notice" role="status">{notice}</p> : null}
        </form>
      </section>

      <aside className="thread-sidebar">
        <section className="card">
          <h2>Ticket details</h2>
          <dl className="detail-list">
            <div><dt>Status</dt><dd>{ticketStatusLabel(status)}</dd></div>
            <div><dt>Priority</dt><dd className="capitalize">{ticket.priority}</dd></div>
            <div><dt>Opened</dt><dd>{formatDateTime(ticket.messages[0].sentOn)}</dd></div>
            <div><dt>Updated</dt><dd>{formatDateTime(ticket.messages[messages.length - 1].sentOn)}</dd></div>
            <div><dt>Tags</dt><dd>{ticket.tags.join(", ")}</dd></div>
          </dl>
        </section>
        <section className="card">
          <h2>Support team</h2>
          <ul className="team-list">
            <li><span className="team-avatar">AK</span><span><strong>Asha Karki</strong><small>Support lead</small></span></li>
            <li><span className="team-avatar">BS</span><span><strong>Bibek Shrestha</strong><small>Support engineer</small></span></li>
            <li><span className="team-avatar">RG</span><span><strong>Rohan Gurung</strong><small>Billing specialist</small></span></li>
          </ul>
        </section>
        <section className="card quiet-card">
          <h2>Response target</h2>
          <p>Priority support responds within four business hours. Urgent tickets are paged to the on-call engineer.</p>
        </section>
      </aside>
    </div>
  );
}
