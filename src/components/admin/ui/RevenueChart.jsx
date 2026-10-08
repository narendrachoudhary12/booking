// components/admin/ui/RevenueChart.jsx
import { useState } from "react";

const REVENUE_DATA = [12, 18, 15, 22, 19, 25, 28, 24, 20, 16, 21, 28];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function RevenueChart() {
  const [active, setActive] = useState(11);
  const max = Math.max(...REVENUE_DATA);

  return (
    <>
      <div className="s9-chart-bars">
        {REVENUE_DATA.map((v, i) => (
          <div key={i} className="s9-chart-bar-wrap">
            <div
              className={`s9-chart-bar${active === i ? " active" : ""}`}
              style={{ height: Math.round((v / max) * 100) + "px" }}
              title={`₦${v}M`}
              onClick={() => setActive(i)}
            />
          </div>
        ))}
      </div>

      <div className="s9-chart-label-row">
        {MONTHS.map((m) => (
          <span key={m} style={{ fontSize: 12, color: "var(--muted)" }}>
            {m}
          </span>
        ))}
      </div>
    </>
  );
}
