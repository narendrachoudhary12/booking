// components/admin/pages/NotificationsPage.jsx
// Everything that happened on the platform, newest first: bookings,
// payments, cancellations, refunds, hotel requests, reviews and payouts.

import { useState } from "react";
import useLoad from "../../../hooks/useLoad";
import { apiError, getActivity } from "../../../services/adminApi";
import ActivityFeed from "../ui/ActivityFeed";
import Loadable from "../ui/Loadable";

const FILTERS = [
  { id: "", label: "All" },
  { id: "booking", label: "Bookings" },
  { id: "payment", label: "Payments" },
  { id: "cancellation", label: "Cancellations" },
  { id: "refund", label: "Refunds" },
  { id: "hotel_request", label: "Hotel requests" },
  { id: "review", label: "Reviews" },
  { id: "payout", label: "Payouts" },
];

export default function NotificationsPage() {
  const { data: events, error, reload } = useLoad(getActivity, [], apiError);
  const [filter, setFilter] = useState("");

  return (
    <div className="s9-card" style={{ maxWidth: 860 }}>
      <div className="s9-card-head">
        <div className="s9-card-title">Activity</div>
        <button className="s9-btn s9-btn-outline s9-btn-sm" onClick={reload}>
          Refresh
        </button>
      </div>

      <div className="s9-card-body">
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={`s9-btn s9-btn-sm ${filter === f.id ? "s9-btn-primary" : "s9-btn-outline"}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <Loadable data={events} error={error}>
          {events && <ActivityFeed events={events.filter((e) => !filter || e.type === filter)} />}
        </Loadable>
      </div>
    </div>
  );
}
