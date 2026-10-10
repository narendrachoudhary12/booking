// pages/host/AnalyticsPage.jsx
// Twelve months of revenue and bookings for the selected hotel.

import useLoad from "../../hooks/useLoad";
import { apiError, getHostAnalytics } from "../../services/hostApi";
import BarChart from "./BarChart";
import Loadable from "./Loadable";
import { BADGE_CLASS, STATUS_LABEL, money, shortMonth } from "./hostFormat";

export default function AnalyticsPage({ hotel }) {
  const { data, error } = useLoad(() => getHostAnalytics(hotel.id), [hotel.id], apiError);

  return (
    <Loadable data={data} error={error}>
      {data && (
        <div>
          <div className="hd-stats-row">
            <div className="hd-stat-card hd-stat-green">
              <div className="hd-stat-label">Total Revenue</div>
              <div className="hd-stat-value">{money(data.totals.revenue)}</div>
              <div className="hd-stat-sub">{data.totals.paid_bookings} paid bookings</div>
            </div>
            <div className="hd-stat-card hd-stat-gold">
              <div className="hd-stat-label">Avg. Booking Value</div>
              <div className="hd-stat-value">{money(Math.round(data.totals.average_value))}</div>
              <div className="hd-stat-sub">Per paid booking</div>
            </div>
            <div className="hd-stat-card hd-stat-blue">
              <div className="hd-stat-label">Avg. Stay</div>
              <div className="hd-stat-value">{data.totals.average_nights}</div>
              <div className="hd-stat-sub">Nights per booking</div>
            </div>
            <div className="hd-stat-card hd-stat-red">
              <div className="hd-stat-label">Guest Rating</div>
              <div className="hd-stat-value">{data.totals.reviews ? `${data.totals.rating} ★` : "—"}</div>
              <div className="hd-stat-sub">{data.totals.reviews} review{data.totals.reviews === 1 ? "" : "s"}</div>
            </div>
          </div>

          <div className="hd-card">
            <div className="hd-card-header">
              <div className="hd-card-title">Revenue — last 12 months</div>
            </div>
            <div className="hd-card-body">
              <BarChart
                items={data.months.map((m) => ({
                  label: shortMonth(m.month),
                  value: m.revenue,
                  title: `${money(m.revenue)} · ${m.bookings} bookings`,
                }))}
              />
            </div>
          </div>

          <div className="hd-two-col" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="hd-card">
              <div className="hd-card-header">
                <div className="hd-card-title">Bookings by status</div>
              </div>
              <div className="hd-card-body">
                {Object.keys(data.by_status).length === 0 && (
                  <div style={{ color: "var(--hd-muted)", fontSize: 14 }}>No bookings yet.</div>
                )}
                {Object.entries(data.by_status).map(([status, total]) => (
                  <div key={status} className="hd-room-item">
                    <span className={`hd-badge ${BADGE_CLASS[status] || ""}`}>
                      {STATUS_LABEL[status] || status}
                    </span>
                    <strong>{total}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="hd-card">
              <div className="hd-card-header">
                <div className="hd-card-title">Rooms sold by type</div>
              </div>
              <div className="hd-card-body">
                {data.by_room.length === 0 && (
                  <div style={{ color: "var(--hd-muted)", fontSize: 14 }}>No confirmed bookings yet.</div>
                )}
                {data.by_room.map((room) => (
                  <div key={room.room_name} className="hd-room-item">
                    <div className="hd-room-info">
                      <div className="hd-room-name">{room.room_name}</div>
                      <div className="hd-room-meta">{room.bookings} bookings</div>
                    </div>
                    <strong>{room.rooms} rooms</strong>
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
