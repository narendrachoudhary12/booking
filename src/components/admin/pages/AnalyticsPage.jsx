// components/admin/pages/AnalyticsPage.jsx
// Twelve months of revenue, bookings and sign-ups across the platform.

import useLoad from "../../../hooks/useLoad";
import { apiError, getAnalytics } from "../../../services/adminApi";
import { money, shortMoney, shortMonth } from "../format";
import { StatusBadge } from "../ui/Badges";
import Loadable from "../ui/Loadable";
import RevenueChart from "../ui/RevenueChart";

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 0",
  borderBottom: "1px solid var(--border)",
  fontSize: 13,
};

export default function AnalyticsPage() {
  const { data, error } = useLoad(getAnalytics, [], apiError);

  return (
    <Loadable data={data} error={error}>
      {data && (
        <div>
          <div className="s9-stats-grid">
            <div className="s9-stat-card s-green">
              <div className="s9-stat-label">Total Revenue</div>
              <div className="s9-stat-val">{shortMoney(data.totals.revenue)}</div>
              <div className="s9-stat-sub">{data.totals.paid_bookings} paid bookings</div>
            </div>
            <div className="s9-stat-card s-gold">
              <div className="s9-stat-label">Avg. Booking Value</div>
              <div className="s9-stat-val">{shortMoney(data.totals.average_value)}</div>
              <div className="s9-stat-sub">Per paid booking</div>
            </div>
            <div className="s9-stat-card s-blue">
              <div className="s9-stat-label">Customers</div>
              <div className="s9-stat-val">{data.totals.customers.toLocaleString()}</div>
              <div className="s9-stat-sub">{data.totals.partners} hotel partners</div>
            </div>
            <div className="s9-stat-card s-red">
              <div className="s9-stat-label">Hotels</div>
              <div className="s9-stat-val">{data.totals.hotels.toLocaleString()}</div>
              <div className="s9-stat-sub">{data.totals.hotels_owned} with an owner account</div>
            </div>
          </div>

          <div className="s9-card">
            <div className="s9-card-head">
              <div className="s9-card-title">Revenue — last 12 months</div>
            </div>
            <div className="s9-card-body">
              <RevenueChart months={data.months} />
            </div>
          </div>

          <div className="s9-three-col">
            <div className="s9-card">
              <div className="s9-card-head">
                <div className="s9-card-title">Bookings by status</div>
              </div>
              <div className="s9-card-body">
                {Object.keys(data.by_status).length === 0 && <div style={{ color: "var(--muted)" }}>No bookings yet.</div>}
                {Object.entries(data.by_status).map(([status, total]) => (
                  <div key={status} style={rowStyle}>
                    <StatusBadge status={status} />
                    <strong>{total}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="s9-card">
              <div className="s9-card-head">
                <div className="s9-card-title">Top cities by revenue</div>
              </div>
              <div className="s9-card-body">
                {data.top_cities.length === 0 && <div style={{ color: "var(--muted)" }}>No paid bookings yet.</div>}
                {data.top_cities.map((city) => (
                  <div key={city.name} style={rowStyle}>
                    <span>
                      {city.name}
                      <span style={{ color: "var(--muted)" }}> · {city.bookings} bookings</span>
                    </span>
                    <strong>{money(city.revenue)}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="s9-card">
              <div className="s9-card-head">
                <div className="s9-card-title">New accounts per month</div>
              </div>
              <div className="s9-card-body">
                {data.months.slice(-6).reverse().map((m) => (
                  <div key={m.month} style={rowStyle}>
                    <span>{shortMonth(m.month)} {m.month.slice(0, 4)}</span>
                    <strong>{m.new_users}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Loadable>
  );
}
