// components/admin/pages/PaymentsPage.jsx
// Money in: what was collected, what guests still have to pay.

import { useState } from "react";
import useLoad from "../../../hooks/useLoad";
import { apiError, getBookings, getFinance } from "../../../services/adminApi";
import { money, shortMoney } from "../format";
import Loadable from "../ui/Loadable";
import BookingsTable from "./BookingsTable";

const TABS = [
  { id: "paid", label: "Paid" },
  { id: "pending", label: "Awaiting payment" },
];

export default function PaymentsPage({ onNav, onChanged }) {
  const [tab, setTab] = useState("paid");

  const finance = useLoad(getFinance, [], apiError);
  const bookings = useLoad(
    () => getBookings(tab === "paid" ? { payment: "paid" } : { status: "pending" }),
    [tab],
    apiError
  );

  const handleChanged = () => {
    finance.reload();
    bookings.reload();
    onChanged?.();
  };

  const f = finance.data;

  return (
    <div>
      <Loadable data={f} error={finance.error}>
        {f && (
          <div className="s9-stats-grid">
            <div className="s9-stat-card s-green">
              <div className="s9-stat-label">Collected This Month</div>
              <div className="s9-stat-val">{shortMoney(f.collected_this_month)}</div>
              <div className="s9-stat-sub">{f.paid_this_month} paid bookings</div>
            </div>
            <div className="s9-stat-card s-gold">
              <div className="s9-stat-label">Awaiting Payment</div>
              <div className="s9-stat-val">{f.awaiting_count}</div>
              <div className="s9-stat-sub">{money(f.awaiting_amount)} total</div>
            </div>
            <div className="s9-stat-card s-red" style={{ cursor: "pointer" }} onClick={() => onNav("refunds")}>
              <div className="s9-stat-label">Refunds Waiting</div>
              <div className="s9-stat-val">{f.refunds_count}</div>
              <div className="s9-stat-sub">{money(f.refunds_amount)} to send back</div>
            </div>
            <div className="s9-stat-card s-blue" style={{ cursor: "pointer" }} onClick={() => onNav("payouts")}>
              <div className="s9-stat-label">Hotel Payouts Due</div>
              <div className="s9-stat-val">{shortMoney(f.payouts_due)}</div>
              <div className="s9-stat-sub">After {f.commission_percent}% commission</div>
            </div>
          </div>
        )}
      </Loadable>

      <div className="s9-card">
        <div className="s9-card-head">
          <div className="s9-card-title">Payment transactions</div>
          <div style={{ display: "flex", gap: 6 }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`s9-btn s9-btn-sm ${tab === t.id ? "s9-btn-primary" : "s9-btn-outline"}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <Loadable data={bookings.data} error={bookings.error}>
          {bookings.data && (
            <BookingsTable
              bookings={bookings.data}
              onChanged={handleChanged}
              emptyText={tab === "paid" ? "No payments yet." : "No booking is waiting for payment."}
            />
          )}
        </Loadable>
      </div>
    </div>
  );
}
