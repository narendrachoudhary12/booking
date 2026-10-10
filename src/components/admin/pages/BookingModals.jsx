// components/admin/pages/BookingModals.jsx
// Dialogs for the things an admin does with one booking. Each takes the
// booking, onClose, and onDone (called after the change was saved).

import { useState } from "react";
import popup from "../../common/Popup/popupService";
import {
  apiError,
  cancelBooking,
  confirmBookingPayment,
  refundBooking,
} from "../../../services/adminApi";
import { money, shortDate } from "../format";
import Modal from "../ui/Modal";

const PAY_METHODS = ["Bank Transfer", "Cash", "POS", "Flutterwave"];

// Runs the API call of a dialog: shows the result, then closes and reloads
function useAction(onClose, onDone) {
  const [busy, setBusy] = useState(false);

  const run = async (call) => {
    setBusy(true);

    try {
      const res = await call();
      popup.success(res.message);
      onClose();
      onDone();
    } catch (err) {
      popup.error(apiError(err));
    }

    setBusy(false);
  };

  return [busy, run];
}

function Field({ label, children }) {
  return (
    <div className="s9-form-group">
      <label className="s9-label">{label}</label>
      {children}
    </div>
  );
}

/** A guest paid outside the website: mark the booking as paid. */
export function ConfirmPaymentModal({ booking, onClose, onDone }) {
  const [busy, run] = useAction(onClose, onDone);
  const [form, setForm] = useState({
    amount: String(booking.total_price),
    pay_method: PAY_METHODS[0],
    payment_reference: "",
  });

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <Modal
      title={`Confirm payment — ${booking.booking_ref}`}
      submitText="Confirm payment"
      busy={busy}
      onClose={onClose}
      onSubmit={() => run(() => confirmBookingPayment(booking.booking_ref, form))}
    >
      <div className="s9-alert s9-alert-gold">
        <span>⚠️</span>
        <span>
          Only confirm after you have seen {money(booking.total_price)} from{" "}
          {booking.guest_name} in the account.
        </span>
      </div>

      <div className="s9-form-row">
        <Field label="Amount received (₦)">
          <input className="s9-input" type="number" min="0" step="any" value={form.amount} onChange={set("amount")} required />
        </Field>
        <Field label="Paid by">
          <select className="s9-input" value={form.pay_method} onChange={set("pay_method")}>
            {PAY_METHODS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="s9-form-row full">
        <Field label="Payment reference">
          <input className="s9-input" value={form.payment_reference} onChange={set("payment_reference")} placeholder="Bank transaction ID / receipt number" required />
        </Field>
      </div>
    </Modal>
  );
}

export function CancelBookingModal({ booking, onClose, onDone }) {
  const [busy, run] = useAction(onClose, onDone);
  const [reason, setReason] = useState("");
  const paid = booking.payment_status === "paid";

  return (
    <Modal
      title={`Cancel booking — ${booking.booking_ref}`}
      submitText="Cancel booking"
      busy={busy}
      onClose={onClose}
      onSubmit={() => run(() => cancelBooking(booking.booking_ref, reason))}
    >
      <div className={`s9-alert ${paid ? "s9-alert-gold" : "s9-alert-red"}`}>
        <span>⚠️</span>
        <span>
          {booking.guest_name} at {booking.hotel_name}, {shortDate(booking.check_in)} –{" "}
          {shortDate(booking.check_out)}.{" "}
          {paid
            ? `The guest paid ${money(booking.total_price)}; a refund will be added under Refunds.`
            : "The guest has not paid."}
        </span>
      </div>

      <div className="s9-form-row full">
        <Field label="Reason">
          <textarea className="s9-input" rows={3} maxLength={500} value={reason} onChange={(e) => setReason(e.target.value)} required />
        </Field>
      </div>
    </Modal>
  );
}

/** The money was sent back to the guest: record how much and the reference. */
export function RefundModal({ booking, onClose, onDone }) {
  const [busy, run] = useAction(onClose, onDone);
  const [form, setForm] = useState({
    amount: String(booking.refund_amount ?? booking.total_price),
    reference: "",
  });

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <Modal
      title={`Record refund — ${booking.booking_ref}`}
      submitText="Mark as refunded"
      busy={busy}
      onClose={onClose}
      onSubmit={() => run(() => refundBooking(booking.booking_ref, form))}
    >
      <div className="s9-alert s9-alert-gold">
        <span>⚠️</span>
        <span>
          This only records the refund. Send the money to {booking.guest_name} first
          {booking.pay_method ? ` (paid by ${booking.pay_method})` : ""}, then save it here.
        </span>
      </div>

      <div className="s9-form-row">
        <Field label="Amount refunded (₦)">
          <input className="s9-input" type="number" min="0" max={booking.total_price} step="any" value={form.amount} onChange={set("amount")} required />
        </Field>
        <Field label="Refund reference">
          <input className="s9-input" value={form.reference} onChange={set("reference")} placeholder="Transaction ID" required />
        </Field>
      </div>
    </Modal>
  );
}

export function BookingDetailsModal({ booking, onClose }) {
  const rows = [
    ["Guest", booking.guest_name],
    ["Email", booking.guest_email],
    ["Phone", booking.guest_phone],
    ["Hotel", booking.hotel_name],
    ["Rooms", booking.rooms],
    ["Stay", `${shortDate(booking.check_in)} – ${shortDate(booking.check_out)} (${booking.nights} nights)`],
    ["Guests", `${booking.adults} adults${booking.children ? `, ${booking.children} children` : ""}`],
    ["Total", money(booking.total_price)],
    ["Booking status", booking.status],
    ["Payment", booking.payment_status],
    ["Paid by", booking.pay_method],
    ["Payment reference", booking.payment_reference],
    ["Paid on", booking.paid_at && shortDate(booking.paid_at)],
    ["Booked on", shortDate(booking.created_at)],
    ["Cancelled", booking.cancelled_at && `${shortDate(booking.cancelled_at)} by ${booking.cancelled_by || "—"}`],
    ["Cancel reason", booking.cancel_reason],
    ["Refund", booking.refund_status && `${booking.refund_status} · ${money(booking.refund_amount)}`],
    ["Refund reference", booking.refund_reference],
    ["Hotel payout", booking.paid_out ? "Paid out to the hotel" : null],
  ].filter(([, value]) => value);

  return (
    <Modal title={`Booking ${booking.booking_ref}`} onClose={onClose}>
      <div style={{ fontSize: 13 }}>
        {rows.map(([label, value]) => (
          <div
            key={label}
            style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "8px 0", borderBottom: "1px solid var(--border)" }}
          >
            <span style={{ color: "var(--muted)" }}>{label}</span>
            <span style={{ fontWeight: 500, textAlign: "right" }}>{value}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}
