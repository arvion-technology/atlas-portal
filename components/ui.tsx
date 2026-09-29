import type { ReactNode } from "react";

export function StatusPill({ status, label }: { status: string; label: string }) {
  return <span className={`status status-${status}`}>{label}</span>;
}

export function Metric({
  label,
  value,
  detail,
  tone = "",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: string;
}) {
  return (
    <article className={`metric-card${tone ? ` tone-${tone}` : ""}`}>
      <span className="metric-label">{label}</span>
      <strong className="metric-value">{value}</strong>
      <span className="metric-detail">{detail}</span>
    </article>
  );
}

export function SectionHeading({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {action ? <div className="section-action">{action}</div> : null}
    </div>
  );
}

export function ProgressBar({ value, label }: { value: number; label: string }) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div className="progress-row">
      <div className="progress-label">
        <span>{label}</span>
        <span className="progress-value">{safe}%</span>
      </div>
      <div className="progress-track" role="progressbar" aria-valuenow={safe} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <span style={{ width: `${safe}%` }} />
      </div>
    </div>
  );
}
