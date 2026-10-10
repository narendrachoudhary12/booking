// components/admin/pages/BookingsPage.jsx
// All bookings with filters, CSV export and the admin actions.
// lockedStatus shows only one status (used by the Pending and Cancellations
// pages); search comes from the search box in the top bar.

import { useEffect, useState } from "react";
import Papa from "papaparse";
import useLoad from "../../../hooks/useLoad";
import { apiError, getBookings } from "../../../services/adminApi";
import Loadable from "../ui/Loadable";
import BookingsTable from "./BookingsTable";

const STATUSES = [
  { id: "", label: "All statuses" },
  { id: "confirmed", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "pending", label: "Awaiting payment" },
  { id: "cancelled", label: "Cancelled" },
];

const inputStyle = { padding: "8px 12px", fontSize: 13, width: "auto" };

function exportCsv(bookings) {
  const csv = Papa.unparse(
    bookings.map((b) => ({
      Reference: b.booking_ref,
      Guest: b.guest_name,
      Email: b.guest_email || "",
      Phone: b.guest_phone || "",
      Hotel: b.hotel_name,
      Rooms: b.rooms,
      "Check-in": b.check_in,
      "Check-out": b.check_out,
      Nights: b.nights,
      Amount: b.total_price,
      "Paid by": b.pay_method || "",
      Payment: b.payment_status,
      Status: b.status,
      Refund: b.refund_status || "",
    }))
  );

  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  link.download = `stay9ja-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

export default function BookingsPage({ lockedStatus = "", search = "", onChanged }) {
  const [status, setStatus] = useState(lockedStatus);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [query, setQuery] = useState(search);

  // A new search typed in the top bar replaces the one here
  useEffect(() => setQuery(search), [search]);
  useEffect(() => setStatus(lockedStatus), [lockedStatus]);

  const { data: bookings, error, reload } = useLoad(
    () => getBookings({ status, from, to, search: query }),
    [status, from, to, query],
    apiError
  );

  // Reload the list and the sidebar badges after an action
  const handleChanged = () => {
    reload();
    onChanged?.();
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        {!lockedStatus && (
          <select className="s9-input" style={inputStyle} value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        )}

        <input
          className="s9-input"
          style={{ ...inputStyle, minWidth: 220 }}
          type="search"
          placeholder="Ref, guest or hotel"
          defaultValue={query}
          key={query}
          onKeyDown={(e) => e.key === "Enter" && setQuery(e.target.value.trim())}
          onBlur={(e) => setQuery(e.target.value.trim())}
        />

        <label style={{ fontSize: 12, color: "var(--muted)" }}>Check-in from</label>
        <input type="date" className="s9-input" style={inputStyle} value={from} onChange={(e) => setFrom(e.target.value)} />
        <label style={{ fontSize: 12, color: "var(--muted)" }}>to</label>
        <input type="date" className="s9-input" style={inputStyle} min={from} value={to} onChange={(e) => setTo(e.target.value)} />

        <button
          className="s9-btn s9-btn-outline"
          style={{ marginLeft: "auto" }}
          disabled={!bookings?.length}
          onClick={() => exportCsv(bookings)}
        >
          Export CSV
        </button>
      </div>

      <div className="s9-card">
        <Loadable data={bookings} error={error}>
          {bookings && <BookingsTable bookings={bookings} onChanged={handleChanged} />}
        </Loadable>
      </div>
    </div>
  );
}
