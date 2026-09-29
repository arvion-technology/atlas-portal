"use client";

import { useState } from "react";

import type { Account } from "@/lib/types.ts";

export function SettingsForm({ account }: { account: Account }) {
  const [name, setName] = useState(account.name);
  const [legalName, setLegalName] = useState(account.legalName);
  const [email, setEmail] = useState(account.billingEmail);
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <form className="settings-form" onSubmit={submit}>
      <section className="card">
        <h2>Workspace</h2>
        <p className="muted">These details appear on invoices and billing emails.</p>
        <div className="form-grid">
          <label className="field">
            <span>Workspace name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="field">
            <span>Legal entity</span>
            <input value={legalName} onChange={(event) => setLegalName(event.target.value)} />
          </label>
          <label className="field">
            <span>Billing email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
          </label>
          <label className="field">
            <span>Plan</span>
            <input value={`${account.plan}, renews ${account.renewalOn}`} readOnly />
          </label>
        </div>
      </section>

      <section className="card">
        <h2>API access</h2>
        <p className="muted">Use this key for server-to-server requests. Rotate it immediately if it leaks.</p>
        <div className="api-key-row">
          <code id="api-key">{showKey ? account.apiKeyMasked : "atlas_live_sk_hidden"}</code>
          <button type="button" className="button ghost" onClick={() => setShowKey(!showKey)}>
            {showKey ? "Hide" : "Reveal"}
          </button>
        </div>
      </section>

      <section className="card">
        <h2>Notifications</h2>
        <label className="checkbox-row">
          <input type="checkbox" defaultChecked />
          <span>Email me when an invoice is issued</span>
        </label>
        <label className="checkbox-row">
          <input type="checkbox" defaultChecked />
          <span>Email me when support replies to a ticket</span>
        </label>
        <label className="checkbox-row">
          <input type="checkbox" />
          <span>Send a monthly usage summary</span>
        </label>
      </section>

      <div className="form-actions">
        <button type="submit" className="button primary">Save changes</button>
        {saved ? <p className="form-notice" role="status">Changes saved in this browser session. The static demo has no backend.</p> : null}
      </div>
    </form>
  );
}
