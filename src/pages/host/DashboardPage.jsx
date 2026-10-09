// pages/host/DashboardPage.jsx
// Live numbers for the selected hotel: occupancy, revenue, bookings, rooms.

import { useEffect, useState } from "react";
import { apiError, getHostDashboard } from "../../services/hostApi";
import BookingsTable from "./BookingsTable";
import { money } from "./hostFormat";

// "+12% vs last month", or nothing when there is no last month to compare with
function revenueTrend(thisMonth, lastMonth) {
  if (!lastMonth) return null;

  const change = Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
  return {
    up: change >= 0,
    text: `${change >= 0 ? "↑ +" : "↓ "}${change}% vs last month`,
  };
}

export default function DashboardPage({ hotel, onNavigate }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(null);

    getHostDashboard(hotel.id)
      .then((result) => !cancelled && setData(result))
      .catch((err) => !cancelled && setError(apiError(err)));

    return () => {
      cancelled = true;
    };
  }, [hotel.id]);

  if (error) {
    return <div style={{ padding: 40, textAlign: "center", color: "var(--hd-red)" }}>{error}</div>;
  }

  if (!data) {
    return <div style={{ padding: 40, textAlign: "center", color: "var(--hd-muted)" }}>Loading…</div>;
  }

  const { stats, rooms, recent_bookings: recentBookings } = data;
  const trend = revenueTrend(stats.revenue_this_month, stats.revenue_last_month);

  return (
    <div>
      {/* Stats Row */}
      <div className="hd-stats-row">
        <div className="hd-stat-card hd-stat-green">
          <div className="hd-stat-label">Tonight's Occupancy</div>
          <div className="hd-stat-value">{stats.occupancy_percent}%</div>
          <div className="hd-stat-sub">
            {stats.rooms_occupied} of {stats.rooms_total} rooms occupied
          </div>
        </div>
        <div className="hd-stat-card hd-stat-gold">
          <div className="hd-stat-label">Revenue This Month</div>
          <div className="hd-stat-value">{money(stats.revenue_this_month)}</div>
          <div className="hd-stat-sub">
            {stats.bookings_this_month} paid booking{stats.bookings_this_month === 1 ? "" : "s"}
          </div>
          {trend && (
            <div className={`hd-stat-trend ${trend.up ? "up" : "down"}`}>{trend.text}</div>
          )}
        </div>
        <div className="hd-stat-card hd-stat-blue">
          <div className="hd-stat-label">Upcoming Check-ins</div>
          <div className="hd-stat-value">{stats.upcoming_checkins}</div>
          <div className="hd-stat-sub">In the next 7 days</div>
        </div>
        <div className="hd-stat-card hd-stat-red">
          <div className="hd-stat-label">Avg. Rate Per Night</div>
          <div className="hd-stat-value">{money(Math.round(stats.average_rate))}</div>
          <div className="hd-stat-sub">Across all room types</div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="hd-card">
        <div className="hd-card-header">
          <div className="hd-card-title">Recent Bookings</div>
          <button className="hd-btn hd-btn-outline hd-btn-sm" onClick={() => onNavigate("bookings")}>
            View All
          </button>
        </div>
        <BookingsTable bookings={recentBookings} />
      </div>

      {/* Room Types Summary */}
      <div className="hd-card">
        <div className="hd-card-header">
          <div className="hd-card-title">Room Types — Tonight</div>
        </div>
        <div className="hd-card-body">
          {rooms.length === 0 && (
            <div style={{ color: "var(--hd-muted)", fontSize: 14 }}>
              This hotel has no room types yet.
            </div>
          )}

          {rooms.map((r) => (
            <div key={r.id} className="hd-room-item">
              <div className="hd-room-info">
                <div className="hd-room-name">{r.room_type}</div>
                <div className="hd-room-meta">
                  {r.capacity} room{r.capacity === 1 ? "" : "s"}
                  {r.max_guests ? ` · Max ${r.max_guests} guests` : ""}
                </div>
              </div>
              <div>
                <div className="hd-room-rate">{money(r.price)} / night</div>
                <div
                  className="hd-room-avail"
                  style={{
                    color:
                      r.available === 0
                        ? "var(--hd-red)"
                        : r.available <= 2
                        ? "var(--hd-gold)"
                        : "var(--hd-green)",
                  }}
                >
                  {r.available} available
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
