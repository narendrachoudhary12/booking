// components/admin/pages/BookingsTable.jsx
// Bookings table with the admin actions (view, confirm payment, cancel,
// refund). Used by the Bookings, Payments and Refunds pages.

import { useState } from "react";
import { StatusBadge } from "../ui/Badges";
import { money, shortDate } from "../format";
import {
  BookingDetailsModal,
  CancelBookingModal,
  ConfirmPaymentModal,
  RefundModal,
} from "./BookingModals";

const PAGE_SIZE = 10;

const MODALS = {
  view: BookingDetailsModal,
  confirm: ConfirmPaymentModal,
  cancel: CancelBookingModal,
  refund: RefundModal,
};

// What the amount colour says: red = cancelled, gold = not paid, green = paid
const amountColor = (b) =>
  b.status === "cancelled" ? "var(--red)" : b.payment_status === "paid" ? "var(--green)" : "var(--gold)";

// bookings: rows from getBookings(); onChanged: reload them after an action
export default function BookingsTable({ bookings, onChanged, emptyText = "No bookings found." }) {
  const [page, setPage] = useState(1);
  // The open dialog: { type: "view" | "confirm" | "cancel" | "refund", booking }
  const [dialog, setDialog] = useState(null);

  const pages = Math.max(1, Math.ceil(bookings.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = bookings.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const Dialog = dialog && MODALS[dialog.type];
  const open = (type, booking) => setDialog({ type, booking });

  return (
    <>
      <div style={{ overflowX: "auto" }}>
        <table className="s9-tbl">
          <thead>
            <tr>
              <th>Ref</th><th>Guest</th><th>Hotel</th><th>Rooms</th><th>Check-in</th>
              <th>Nights</th><th>Amount</th><th>Paid by</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td colSpan="10" style={{ textAlign: "center", padding: 24, color: "var(--muted)" }}>
                  {emptyText}
                </td>
              </tr>
            )}

            {visible.map((b) => (
              <tr key={b.booking_ref}>
                <td><code className="s9-code">{b.booking_ref}</code></td>
                <td>
                  <div style={{ fontWeight: 500 }}>{b.guest_name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{b.guest_email || b.guest_phone || ""}</div>
                </td>
                <td>{b.hotel_name}</td>
                <td>{b.rooms}</td>
                <td>{shortDate(b.check_in)}</td>
                <td>{b.nights}</td>
                <td style={{ fontWeight: 600, color: amountColor(b) }}>{money(b.total_price)}</td>
                <td>{b.pay_method ? <span className="s9-tag">{b.pay_method}</span> : "—"}</td>
                <td>
                  <StatusBadge status={b.status} />
                  {b.refund_status && (
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
                      Refund {b.refund_status === "requested" ? "waiting" : "sent"}
                    </div>
                  )}
                </td>
                <td>
                  <div style={{ display: "flex", gap: 5 }}>
                    <button className="s9-btn s9-btn-outline s9-btn-sm" onClick={() => open("view", b)}>
                      View
                    </button>
                    {b.status === "pending" && (
                      <button className="s9-btn s9-btn-gold s9-btn-sm" onClick={() => open("confirm", b)}>
                        Confirm
                      </button>
                    )}
                    {b.refund_status === "requested" && (
                      <button className="s9-btn s9-btn-gold s9-btn-sm" onClick={() => open("refund", b)}>
                        Refund
                      </button>
                    )}
                    {(b.status === "pending" || b.status === "confirmed") && (
                      <button className="s9-btn s9-btn-danger s9-btn-sm" onClick={() => open("cancel", b)}>
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, padding: 16 }}>
          <button className="s9-btn s9-btn-outline s9-btn-sm" disabled={current === 1} onClick={() => setPage(current - 1)}>
            Prev
          </button>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>
            Page {current} of {pages} · {bookings.length} bookings
          </span>
          <button className="s9-btn s9-btn-outline s9-btn-sm" disabled={current === pages} onClick={() => setPage(current + 1)}>
            Next
          </button>
        </div>
      )}

      {Dialog && (
        <Dialog booking={dialog.booking} onClose={() => setDialog(null)} onDone={onChanged} />
      )}
    </>
  );
}
