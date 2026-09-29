import { ACCOUNT } from "@/lib/data.ts";
import { SettingsForm } from "@/components/SettingsForm";
import { formatDateKey, initials } from "@/lib/format.ts";

export const metadata = { title: "Settings | Atlas Portal" };

export default function SettingsPage() {
  return (
    <div className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">Account</p>
          <h1>Settings</h1>
          <p className="lede">
            Workspace, billing and access settings for {ACCOUNT.name}. Changes in this static demo
            stay in the browser; a production portal writes them through an authenticated API.
          </p>
        </div>
      </section>

      <div className="settings-layout">
        <SettingsForm account={ACCOUNT} />

        <aside className="settings-sidebar">
          <section className="card">
            <h2>Workspace summary</h2>
            <dl className="detail-list">
              <div><dt>Customer since</dt><dd>{formatDateKey(ACCOUNT.customerSince)}</dd></div>
              <div><dt>Plan</dt><dd>{ACCOUNT.plan}</dd></div>
              <div><dt>Seats</dt><dd>{ACCOUNT.seats} included</dd></div>
              <div><dt>Region</dt><dd>{ACCOUNT.region}</dd></div>
              <div><dt>Renewal</dt><dd>{formatDateKey(ACCOUNT.renewalOn)}</dd></div>
            </dl>
          </section>

          <section className="card">
            <h2>Team</h2>
            <ul className="member-list">
              {ACCOUNT.users.map((user) => (
                <li key={user.id}>
                  <span className="team-avatar">{initials(user.name)}</span>
                  <span className="member-copy">
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </span>
                  <span className="member-role">{user.role}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="card quiet-card">
            <h2>Developer endpoints</h2>
            <p>Static route handlers ship with the build:</p>
            <ul className="endpoint-list">
              <li><code>GET /api/summary</code></li>
              <li><code>GET /api/invoices</code></li>
            </ul>
            <p className="muted small">They return the same typed data the pages render.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
