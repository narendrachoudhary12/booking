// components/admin/pages/PaymentsPage.jsx
import { StatusBadge } from "../ui/Badges";

const PAYMENTS = [
  { ref: "STY-2024-05821", guest: "Chidi Okafor",     amount: "135,000", amtColor: "var(--green)", gw: "Paystack",      ch: "Card",   date: "Jul 12, 2024", status: "confirmed", label: "Successful" },
  { ref: "STY-2024-05819", guest: "Fatima Aliyu",      amount: "210,000", amtColor: "var(--gold)",  gw: "Bank Transfer", ch: "GTBank", date: "Jul 11, 2024", status: "pending",   label: "Awaiting", confirm: true },
  { ref: "STY-2024-05817", guest: "Babatunde Adeyemi", amount: "45,000",  amtColor: "var(--green)", gw: "Flutterwave",   ch: "USSD",   date: "Jul 10, 2024", status: "confirmed", label: "Successful" },
  { ref: "STY-2024-05801", guest: "Emeka Eze",         amount: "90,000",  amtColor: "var(--red)",   gw: "Paystack",      ch: "Card",   date: "Jul 5, 2024",  status: "cancelled", label: "Refunded" },
];

export default function PaymentsPage({ openModal }) {
  return (
    <div>
      <div className="s9-stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="s9-stat-card s-green">
          <div className="s9-stat-label">Total Collected</div>
          <div className="s9-stat-val">N28.4M</div>
          <div className="s9-stat-sub">This month</div>
        </div>
        <div className="s9-stat-card s-gold">
          <div className="s9-stat-label">Awaiting Transfer Confirm</div>
          <div className="s9-stat-val">4</div>
          <div className="s9-stat-sub">N840,000 total</div>
        </div>
        <div className="s9-stat-card s-blue">
          <div className="s9-stat-label">Pending Payouts</div>
          <div className="s9-stat-val">N24.1M</div>
          <div className="s9-stat-sub">To 46 hotels</div>
        </div>
      </div>

      <div className="s9-card">
        <div className="s9-card-head">
          <div className="s9-card-title">Payment Transactions</div>
          <button className="s9-btn s9-btn-outline s9-btn-sm">Export</button>
        </div>
        <table className="s9-tbl">
          <thead>
            <tr>
              <th>Booking Ref</th><th>Guest</th><th>Amount</th><th>Gateway</th>
              <th>Channel</th><th>Date</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {PAYMENTS.map((p) => (
              <tr key={p.ref}>
                <td><code className="s9-code">{p.ref}</code></td>
                <td>{p.guest}</td>
                <td style={{ fontWeight: 600, color: p.amtColor }}>N{p.amount}</td>
                <td><span className="s9-tag">{p.gw}</span></td>
                <td>{p.ch}</td>
                <td>{p.date}</td>
                <td><span className={`s9-badge badge-${p.status}`}>{p.label}</span></td>
                <td>
                  {p.confirm
                    ? <button className="s9-btn s9-btn-gold s9-btn-sm" onClick={openModal}>Confirm</button>
                    : <button className="s9-btn s9-btn-outline s9-btn-sm">{p.status === "cancelled" ? "Details" : "Receipt"}</button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
