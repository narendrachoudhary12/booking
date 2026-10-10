// pages/host/PayoutsPage.jsx
// What Stay9ja owes the hotel and what it has already paid.

import useLoad from "../../hooks/useLoad";
import { apiError, getHostPayouts } from "../../services/hostApi";
import Loadable from "./Loadable";
import { money, shortDate } from "./hostFormat";

export default function PayoutsPage({ hotel }) {
  const { data, error } = useLoad(() => getHostPayouts(hotel.id), [hotel.id], apiError);

  return (
    <Loadable data={data} error={error}>
      {data && (
        <div>
          <div className="hd-stats-row" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            <div className="hd-stat-card hd-stat-green">
              <div className="hd-stat-label">Ready for payout</div>
              <div className="hd-stat-value">{money(data.due.net)}</div>
              <div className="hd-stat-sub">
                {data.due.bookings} finished stay{data.due.bookings === 1 ? "" : "s"} · {money(data.due.gross)} minus{" "}
                {data.due.commission_percent}% commission
              </div>
            </div>
            <div className="hd-stat-card hd-stat-gold">
              <div className="hd-stat-label">Upcoming earnings</div>
              <div className="hd-stat-value">{money(data.upcoming.net)}</div>
              <div className="hd-stat-sub">
                {data.upcoming.bookings} paid booking{data.upcoming.bookings === 1 ? "" : "s"} not checked out yet
              </div>
            </div>
            <div className="hd-stat-card hd-stat-blue">
              <div className="hd-stat-label">Paid to you</div>
              <div className="hd-stat-value">{money(data.total_paid)}</div>
              <div className="hd-stat-sub">
                {data.history.length} payout{data.history.length === 1 ? "" : "s"}
              </div>
            </div>
          </div>

          <div className="hd-card">
            <div className="hd-card-header">
              <div className="hd-card-title">Payout history</div>
            </div>
            {data.history.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: "var(--hd-muted)", fontSize: 14 }}>
                No payouts yet. A stay becomes ready for payout after the guest checks out.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="hd-table">
                  <thead>
                    <tr>
                      <th>Date</th><th>Bookings</th><th>Booking total</th>
                      <th>Commission</th><th>Paid to you</th><th>Reference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.history.map((p) => (
                      <tr key={p.id}>
                        <td>{shortDate(p.paid_at)}</td>
                        <td>{p.bookings_count}</td>
                        <td>{money(p.gross_amount)}</td>
                        <td>{money(p.commission_amount)} ({Number(p.commission_percent)}%)</td>
                        <td><strong>{money(p.net_amount)}</strong></td>
                        <td>
                          {p.reference}
                          {p.note && <div className="hd-guest-email">{p.note}</div>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </Loadable>
  );
}
