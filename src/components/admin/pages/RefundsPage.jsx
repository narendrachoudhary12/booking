// components/admin/pages/RefundsPage.jsx
// Paid bookings that were cancelled: refunds to send and refunds already sent.

import { useState } from "react";
import useLoad from "../../../hooks/useLoad";
import { apiError, getBookings } from "../../../services/adminApi";
import Loadable from "../ui/Loadable";
import BookingsTable from "./BookingsTable";

const TABS = [
  { id: "requested", label: "Waiting", empty: "No refunds are waiting." },
  { id: "refunded", label: "Sent", empty: "No refunds have been sent yet." },
];

export default function RefundsPage({ onChanged }) {
  const [tab, setTab] = useState(TABS[0]);

  const { data: bookings, error, reload } = useLoad(
    () => getBookings({ refund: tab.id }),
    [tab.id],
    apiError
  );

  const handleChanged = () => {
    reload();
    onChanged?.();
  };

  return (
    <div className="s9-card">
      <div className="s9-card-head">
        <div className="s9-card-title">Refunds</div>
        <div style={{ display: "flex", gap: 6 }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`s9-btn s9-btn-sm ${tab.id === t.id ? "s9-btn-primary" : "s9-btn-outline"}`}
              onClick={() => setTab(t)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <Loadable data={bookings} error={error}>
        {bookings && <BookingsTable bookings={bookings} onChanged={handleChanged} emptyText={tab.empty} />}
      </Loadable>
    </div>
  );
}
