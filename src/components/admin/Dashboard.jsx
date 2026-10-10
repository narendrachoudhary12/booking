// components/admin/Dashboard.jsx
// Live overview of the platform: money, bookings, hotels and what is
// waiting for an admin.

import useLoad from "../../hooks/useLoad";
import { apiError, getOverview } from "../../services/adminApi";
import { money, shortDate, shortMoney, trend } from "./format";
import ActivityFeed from "./ui/ActivityFeed";
import { StatusBadge } from "./ui/Badges";
import Loadable from "./ui/Loadable";
import RevenueChart from "./ui/RevenueChart";

const GATEWAY_COLORS = ["var(--blue)", "var(--gold)", "var(--green)"];

const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;

export default function Dashboard({ onNav }) {
  const { data, error } = useLoad(getOverview, [], apiError);

  if (!data) return <Loadable data={data} error={error} />;

  const { stats, counts, finance } = data;
  const revenueTrend = trend(stats.revenue_this_month, stats.revenue_last_month);
  const waiting = counts.pending_bookings + counts.refunds + counts.hotel_requests;

  const cards = [
    {
      cls: "s-green",
      label: "Revenue This Month",
      val: shortMoney(stats.revenue_this_month),
      sub: plural(stats.bookings_this_month, "paid booking"),
      trend: revenueTrend?.text,
      up: revenueTrend?.up,
    },
    {
      cls: "s-gold",
      label: "Active Bookings",
      val: stats.active_bookings.toLocaleString(),
      sub: `Across ${plural(stats.active_hotels, "hotel")}`,
    },
    {
      cls: "s-blue",
      label: "Hotels Listed",
      val: stats.hotels_total.toLocaleString(),
      sub: `In ${stats.cities_total} ${stats.cities_total === 1 ? "city" : "cities"}`,
      trend: stats.hotels_this_week > 0 ? `↑ +${stats.hotels_this_week} this week` : null,
      up: true,
    },
    {
      cls: "s-red",
      label: "Pending Actions",
      val: waiting,
      sub: `${plural(counts.pending_bookings, "unpaid booking")} · ${plural(counts.refunds, "refund")} · ${plural(counts.hotel_requests, "hotel request")}`,
      trend: waiting > 0 ? "⚠ Needs attention" : null,
      up: false,
    },
  ];

  return (
    <div>
      {/* ── Stat Cards ── */}
      <div className="s9-stats-grid">
        {cards.map((s) => (
          <div key={s.label} className={`s9-stat-card ${s.cls}`}>
            <div className="s9-stat-label">{s.label}</div>
            <div className="s9-stat-val">{s.val}</div>
            <div className="s9-stat-sub">{s.sub}</div>
            {s.trend && (
              <div className={`s9-stat-trend ${s.up ? "trend-up" : "trend-dn"}`}>{s.trend}</div>
            )}
          </div>
        ))}
      </div>

      {/* ── Revenue Chart + Live Feed ── */}
      <div className="s9-two-col">
        <div className="s9-card">
          <div className="s9-card-head">
            <div className="s9-card-title">Monthly Revenue</div>
            <button className="s9-btn s9-btn-outline s9-btn-sm" onClick={() => onNav("analytics")}>
              Analytics
            </button>
          </div>
          <div className="s9-card-body">
            <RevenueChart months={data.months} />
          </div>
        </div>

        <div className="s9-card">
          <div className="s9-card-head">
            <div className="s9-card-title">Latest Activity</div>
            <button className="s9-btn s9-btn-outline s9-btn-sm" onClick={() => onNav("notifications")}>
              View All
            </button>
          </div>
          <div className="s9-card-body" style={{ padding: "12px 16px" }}>
            <ActivityFeed events={data.activity} />
          </div>
        </div>
      </div>

      {/* ── Recent Bookings ── */}
      <div className="s9-card">
        <div className="s9-card-head">
          <div className="s9-card-title">Recent Bookings</div>
          <button className="s9-btn s9-btn-outline s9-btn-sm" onClick={() => onNav("bookings")}>
            View All
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="s9-tbl">
            <thead>
              <tr>
                <th>Ref</th><th>Guest</th><th>Hotel</th><th>Rooms</th>
                <th>Check-in</th><th>Nights</th><th>Amount</th><th>Paid by</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recent_bookings.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: 20, color: "var(--muted)" }}>
                    No bookings yet.
                  </td>
                </tr>
              )}
              {data.recent_bookings.map((b) => (
                <tr key={b.booking_ref}>
                  <td><code className="s9-code">{b.booking_ref}</code></td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{b.guest_name}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{b.guest_email || ""}</div>
                  </td>
                  <td>{b.hotel_name}</td>
                  <td>{b.rooms}</td>
                  <td>{shortDate(b.check_in)}</td>
                  <td>{b.nights}</td>
                  <td style={{ fontWeight: 600 }}>{money(b.total_price)}</td>
                  <td>{b.pay_method ? <span className="s9-tag">{b.pay_method}</span> : "—"}</td>
                  <td><StatusBadge status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Top Hotels + Revenue Breakdown ── */}
      <div className="s9-two-col">
        <div className="s9-card">
          <div className="s9-card-head">
            <div className="s9-card-title">Top Hotels This Month</div>
            <button className="s9-btn s9-btn-outline s9-btn-sm" onClick={() => onNav("hotels")}>
              All Hotels
            </button>
          </div>

          <div className="s9-card-body">
            {data.top_hotels.length === 0 && (
              <div style={{ color: "var(--muted)", fontSize: 13 }}>No paid bookings this month yet.</div>
            )}
            {data.top_hotels.map((h) => (
              <div key={h.id} className="s9-hotel-item">
                <div className="s9-hotel-thumb">🏨</div>
                <div className="s9-hotel-info">
                  <div className="s9-hotel-name">{h.name}</div>
                  <div className="s9-hotel-meta">{h.city_name || ""}</div>
                </div>
                <div className="s9-hotel-stats">
                  <div className="s9-hotel-revenue">{shortMoney(h.revenue)}</div>
                  <div className="s9-hotel-bookings">{plural(h.bookings, "booking")}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="s9-card">
          <div className="s9-card-head">
            <div className="s9-card-title">This Month's Money</div>
          </div>

          <div className="s9-card-body">
            {data.gateways.length > 0 && (
              <div className="s9-three-col" style={{ gridTemplateColumns: `repeat(${Math.min(data.gateways.length, 3)}, 1fr)` }}>
                {data.gateways.slice(0, 3).map((g, i) => (
                  <div key={g.name} className="s9-rev-box">
                    <div className="s9-rev-label">{g.name}</div>
                    <div className="s9-rev-val" style={{ color: GATEWAY_COLORS[i] }}>{shortMoney(g.revenue)}</div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ fontSize: 13 }}>
              {[
                { label: `Platform commission (${finance.commission_percent}%)`, val: money(finance.commission), color: "var(--green)" },
                { label: "Hotel payouts due", val: money(finance.payouts_due), color: "var(--ink)", page: "payouts" },
                { label: "Refunds waiting", val: money(finance.refunds_pending), color: "var(--red)", page: "refunds" },
              ].map((r) => (
                <div
                  key={r.label}
                  style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)", cursor: r.page ? "pointer" : "default" }}
                  onClick={() => r.page && onNav(r.page)}
                >
                  <span style={{ color: "var(--muted)" }}>{r.label}</span>
                  <span style={{ fontWeight: 600, color: r.color }}>{r.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
