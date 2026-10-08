// components/admin/ui/Badges.jsx
import { useState } from "react";

/** Status badge — confirmed / pending / cancelled / completed */
export function StatusBadge({ status }) {
  return (
    <span className={`s9-badge badge-${status}`}>{status}</span>
  );
}

/** Tier badge — 1 / 2 / 3 */
export function TierBadge({ tier }) {
  if (tier === 1) return <span className="s9-tier-1">Tier 1</span>;
  if (tier === 2) return <span className="s9-tier-2">Tier 2</span>;
  return <span className="s9-tier-3">Tier 3</span>;
}

/** Toggle switch */
export function Toggle({ defaultChecked = true }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <label className="s9-toggle" onClick={() => setOn((v) => !v)}>
      <input type="checkbox" readOnly checked={on} />
      <span className="s9-toggle-slider"></span>
    </label>
  );
}
