// pages/host/DashboardPage.jsx
import { useState } from "react";

const INITIAL_BOOKINGS = [
  { id: 1,  guest: "Chidi Okafor",      email: "chidi@gmail.com",    room: "Deluxe Double",    checkIn: "Jul 15", nights: 3, amount: "₦135,000", status: "confirmed" },
  { id: 2,  guest: "Amaka Nwosu",       email: "amaka@yahoo.com",    room: "Executive Suite",  checkIn: "Jul 18", nights: 2, amount: "₦210,000", status: "pending"   },
  { id: 3,  guest: "Babatunde Adeyemi", email: "babs@hotmail.com",   room: "Standard Room",    checkIn: "Jul 20", nights: 1, amount: "₦45,000",  status: "pending"   },
  { id: 4,  guest: "Fatima Aliyu",      email: "fatima@gmail.com",   room: "Deluxe Double",    checkIn: "Jul 10", nights: 5, amount: "₦225,000", status: "completed" },
  { id: 5,  guest: "Emeka Eze",         email: "emeka@gmail.com",    room: "Standard Room",    checkIn: "Jul 8",  nights: 2, amount: "₦90,000",  status: "cancelled" },
];

const ROOMS = [
  { name: "Standard Room",     meta: "10 rooms · Max 2 guests · No breakfast",  rate: "₦45,000",  avail: 6,  availColor: "var(--hd-green)" },
  { name: "Deluxe Double",     meta: "8 rooms · Max 2 guests · Breakfast included", rate: "₦67,500", avail: 1,  availColor: "var(--hd-gold)"  },
  { name: "Executive Suite",   meta: "5 rooms · Max 3 guests · Full board",     rate: "₦105,000", avail: 0,  availColor: "var(--hd-red)"   },
  { name: "Presidential Suite",meta: "2 rooms · Max 4 guests · All inclusive",  rate: "₦220,000", avail: 2,  availColor: "var(--hd-green)" },
];

const BADGE_CLASS = {
  confirmed: "hd-badge-confirmed",
  pending:   "hd-badge-pending",
  cancelled: "hd-badge-cancelled",
  completed: "hd-badge-completed",
};

export default function DashboardPage({ onNavigate, onBadgeChange }) {
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);

  const handleConfirm = (id) => {
    setBookings((prev) =>
      prev.map((b) => b.id === id ? { ...b, status: "confirmed" } : b)
    );
    const remaining = bookings.filter((b) => b.status === "pending" && b.id !== id).length;
    onBadgeChange(remaining);
  };

  return (
    <div>
      {/* Stats Row */}
      <div className="hd-stats-row">
        <div className="hd-stat-card hd-stat-green">
          <div className="hd-stat-label">Tonight's Occupancy</div>
          <div className="hd-stat-value">72%</div>
          <div className="hd-stat-sub">18 of 25 rooms occupied</div>
          <div className="hd-stat-trend up">↑ +8% vs last week</div>
        </div>
        <div className="hd-stat-card hd-stat-gold">
          <div className="hd-stat-label">Revenue This Month</div>
          <div className="hd-stat-value">₦4.2M</div>
          <div className="hd-stat-sub">62 bookings completed</div>
          <div className="hd-stat-trend up">↑ +12% vs last month</div>
        </div>
        <div className="hd-stat-card hd-stat-blue">
          <div className="hd-stat-label">Pending Confirmations</div>
          <div className="hd-stat-value">3</div>
          <div className="hd-stat-sub">Awaiting your response</div>
          <div className="hd-stat-trend down">⚠ Action required</div>
        </div>
        <div className="hd-stat-card hd-stat-red">
          <div className="hd-stat-label">Avg. Rate Per Night</div>
          <div className="hd-stat-value">₦67K</div>
          <div className="hd-stat-sub">Across all room types</div>
          <div className="hd-stat-trend up">↑ +5% vs last month</div>
        </div>
      </div>

      {/* Two Col */}
      <div className="hd-two-col">
        {/* Recent Bookings */}
        <div className="hd-card">
          <div className="hd-card-header">
            <div className="hd-card-title">Recent Bookings</div>
            <button className="hd-btn hd-btn-outline hd-btn-sm" onClick={() => onNavigate("bookings")}>
              View All
            </button>
          </div>
          <table className="hd-table">
            <thead>
              <tr>
                <th>Guest</th><th>Room</th><th>Check-in</th>
                <th>Nights</th><th>Amount</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div className="hd-guest-name">{b.guest}</div>
                    <div className="hd-guest-email">{b.email}</div>
                  </td>
                  <td>{b.room}</td>
                  <td>{b.checkIn}</td>
                  <td>{b.nights}</td>
                  <td>{b.amount}</td>
                  <td><span className={`hd-badge ${BADGE_CLASS[b.status]}`}>{b.status}</span></td>
                  <td>
                    {b.status === "pending" ? (
                      <button className="hd-btn hd-btn-primary hd-btn-sm" onClick={() => handleConfirm(b.id)}>
                        Confirm
                      </button>
                    ) : (
                      <button className="hd-btn hd-btn-outline hd-btn-sm">
                        {b.status === "completed" ? "Receipt" : "Details"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Channel Manager Status */}
          <div className="hd-card">
            <div className="hd-card-header">
              <div className="hd-card-title">Channel Manager</div>
              <button className="hd-btn hd-btn-outline hd-btn-sm" onClick={() => onNavigate("channel")}>
                Manage
              </button>
            </div>
            <div className="hd-card-body">
              <div className="hd-conn-status connected"><div className="hd-conn-dot" />Channex — Connected &amp; syncing</div>
              <div className="hd-conn-status pending"><div className="hd-conn-dot" />Booking.com — Pending verification</div>
              <div className="hd-conn-status disconnected"><div className="hd-conn-dot" />Expedia — Not connected</div>
              <div style={{ marginTop: 12, fontSize: 12, color: "var(--hd-muted)" }}>
                Last ARI sync: <strong>2 minutes ago</strong>
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div className="hd-card">
            <div className="hd-card-header">
              <div className="hd-card-title">Alerts</div>
              <span className="hd-badge hd-badge-pending">3 new</span>
            </div>
            <div className="hd-card-body" style={{ padding: "12px 16px" }}>
              {[
                { dot: "action", text: "Booking STY-2024-00234 needs confirmation — Amaka Nwosu, Jul 18", time: "10 minutes ago" },
                { dot: "action", text: "New booking request from Babatunde Adeyemi — Standard Room, Jul 20", time: "32 minutes ago" },
                { dot: "alert",  text: "Low availability: Deluxe Double has only 1 room left Jul 14–17", time: "1 hour ago" },
                { dot: "new",    text: "ARI sync completed — 14 dates updated across 3 room types", time: "2 hours ago" },
              ].map((n, i) => (
                <div key={i} className="hd-notif-item">
                  <div className={`hd-notif-dot ${n.dot}`} />
                  <div>
                    <div className="hd-notif-text">{n.text}</div>
                    <div className="hd-notif-time">{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Room Types Summary */}
      <div className="hd-card">
        <div className="hd-card-header">
          <div className="hd-card-title">Room Types — Tonight</div>
          <button className="hd-btn hd-btn-outline hd-btn-sm" onClick={() => onNavigate("rooms")}>
            Manage Rooms
          </button>
        </div>
        <div className="hd-card-body">
          {ROOMS.map((r) => (
            <div key={r.name} className="hd-room-item">
              <div className="hd-room-info">
                <div className="hd-room-name">{r.name}</div>
                <div className="hd-room-meta">{r.meta}</div>
              </div>
              <div>
                <div className="hd-room-rate">{r.rate} / night</div>
                <div className="hd-room-avail" style={{ color: r.availColor }}>
                  {r.avail} available
                </div>
              </div>
              <button className="hd-btn hd-btn-outline hd-btn-sm" style={{ marginLeft: 12 }}>Edit</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
