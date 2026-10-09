// pages/host/BookingsTable.jsx
// Table of bookings, used on the dashboard and on the Bookings page.

import { BADGE_CLASS, STATUS_LABEL, money, shortDate } from "./hostFormat";

export default function BookingsTable({ bookings, emptyText = "No bookings yet." }) {
  if (bookings.length === 0) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: "var(--hd-muted)", fontSize: 14 }}>
        {emptyText}
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="hd-table">
        <thead>
          <tr>
            <th>Ref</th><th>Guest</th><th>Rooms</th><th>Check-in</th>
            <th>Check-out</th><th>Nights</th><th>Amount</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.booking_ref}>
              <td>{b.booking_ref}</td>
              <td>
                <div className="hd-guest-name">{b.guest_name}</div>
                <div className="hd-guest-email">{b.guest_email || b.guest_phone || ""}</div>
              </td>
              <td>{b.rooms}</td>
              <td>{shortDate(b.check_in)}</td>
              <td>{shortDate(b.check_out)}</td>
              <td>{b.nights}</td>
              <td>{money(b.total_price)}</td>
              <td>
                <span className={`hd-badge ${BADGE_CLASS[b.status] || ""}`}>
                  {STATUS_LABEL[b.status] || b.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
