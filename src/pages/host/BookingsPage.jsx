// pages/host/BookingsPage.jsx
// All bookings of the selected hotel, with a status filter.

import { useEffect, useState } from "react";
import { apiError, getHostBookings } from "../../services/hostApi";
import BookingsTable from "./BookingsTable";

const FILTERS = [
  { id: "", label: "All" },
  { id: "confirmed", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "pending", label: "Awaiting payment" },
  { id: "cancelled", label: "Cancelled" },
];

export default function BookingsPage({ hotel }) {
  const [status, setStatus] = useState("");
  const [bookings, setBookings] = useState(null); // null = loading
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setBookings(null);
    setError(null);

    getHostBookings(hotel.id, status)
      .then((list) => !cancelled && setBookings(list))
      .catch((err) => !cancelled && setError(apiError(err)));

    return () => {
      cancelled = true;
    };
  }, [hotel.id, status]);

  return (
    <div>
      <div className="hd-tabs">
        {FILTERS.map((f) => (
          <div
            key={f.id}
            className={`hd-tab${status === f.id ? " active" : ""}`}
            onClick={() => setStatus(f.id)}
          >
            {f.label}
          </div>
        ))}
      </div>

      <div className="hd-card">
        {error ? (
          <div style={{ padding: 32, textAlign: "center", color: "var(--hd-red)" }}>{error}</div>
        ) : !bookings ? (
          <div style={{ padding: 32, textAlign: "center", color: "var(--hd-muted)" }}>Loading…</div>
        ) : (
          <BookingsTable bookings={bookings} emptyText="No bookings here yet." />
        )}
      </div>
    </div>
  );
}
