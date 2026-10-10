// components/admin/ui/RevenueChart.jsx
import { useState } from "react";
import { money, shortMonth } from "../format";

// months: [{ month: "YYYY-MM", revenue, bookings }], oldest first
export default function RevenueChart({ months }) {
  const [active, setActive] = useState(months.length - 1);
  const max = Math.max(...months.map((m) => m.revenue), 1);
  const selected = months[active];

  return (
    <>
      <div style={{ fontSize: 13, marginBottom: 12, color: "var(--muted)" }}>
        {shortMonth(selected.month)} {selected.month.slice(0, 4)}:{" "}
        <strong style={{ color: "var(--ink)" }}>{money(selected.revenue)}</strong> from{" "}
        {selected.bookings} paid booking{selected.bookings === 1 ? "" : "s"}
      </div>

      <div className="s9-chart-bars">
        {months.map((m, i) => (
          <div key={m.month} className="s9-chart-bar-wrap" style={{ justifyContent: "flex-end", height: "100%" }}>
            <div
              className={`s9-chart-bar${active === i ? " active" : ""}`}
              style={{ height: Math.max(2, Math.round((m.revenue / max) * 100)) + "px" }}
              title={money(m.revenue)}
              onClick={() => setActive(i)}
            />
          </div>
        ))}
      </div>

      <div className="s9-chart-label-row">
        {months.map((m) => (
          <span key={m.month} style={{ fontSize: 12, color: "var(--muted)" }}>
            {shortMonth(m.month)}
          </span>
        ))}
      </div>
    </>
  );
}
