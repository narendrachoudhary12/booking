import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBooking } from "../services/bookingApi";

// While a payment is still being verified, re-check every few seconds
const RECHECK_MS = 5000;
const MAX_RECHECKS = 12;

function formatDate(d: string) {
  if (!d) return "—";
  const M = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dt = new Date(d);
  return `${M[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`;
}

const pageStyle = {
  fontFamily: "system-ui, sans-serif",
  maxWidth: 680,
  margin: "0 auto",
  padding: "40px 16px 80px",
};

const primaryBtn = {
  flex: 1, minWidth: 140,
  background: "#1d9e75", color: "#fff",
  border: "none", borderRadius: 10,
  padding: "13px 0", fontSize: 14,
  fontWeight: 500, cursor: "pointer",
};

const secondaryBtn = { ...primaryBtn, background: "#f3f4f6", color: "#374151" };

// Everything shown here comes from the server (by booking reference), so the
// page is correct after a refresh and never claims a payment that was not verified.
export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const navigate      = useNavigate();

  const [booking, setBooking] = useState<any>(null);
  const [failed, setFailed]   = useState(false);
  const [checks, setChecks]   = useState(0);

  const paid = booking?.payment_status === "paid";

  useEffect(() => {
    let cancelled = false;

    getBooking(bookingId)
      .then((data: any) => !cancelled && setBooking(data))
      .catch(() => !cancelled && setFailed(true));

    return () => {
      cancelled = true;
    };
  }, [bookingId, checks]);

  useEffect(() => {
    if (!booking || paid || checks >= MAX_RECHECKS) return;

    const timer = setTimeout(() => setChecks((c) => c + 1), RECHECK_MS);
    return () => clearTimeout(timer);
  }, [booking, paid, checks]);

  if (failed && !booking) {
    return (
      <div style={{ ...pageStyle, textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Booking not found</h1>
        <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>
          We could not find booking <strong>{bookingId}</strong> on your account.
        </p>
        <button onClick={() => navigate("/user")} style={{ ...primaryBtn, flex: "none", padding: "13px 28px" }}>
          Go to my account
        </button>
      </div>
    );
  }

  if (!booking) {
    return <div style={{ ...pageStyle, textAlign: "center", color: "#6b7280" }}>Loading your booking…</div>;
  }

  const guestName =
    `${booking.title || ""} ${booking.first_name || ""} ${booking.last_name || ""}`.trim() || "Guest";
  const rooms =
    (booking.rooms || []).map((r: any) => `${r.quantity} × ${r.room_type || "Room"}`).join(", ") || "—";
  const total = Number(booking.total_price || 0).toLocaleString();

  // Green when paid, amber while the payment is still being verified
  const banner = paid
    ? { bg: "#f0fdf4", border: "#86efac", dot: "#1d9e75", title: "#14532d", text: "#166534" }
    : { bg: "#fffbeb", border: "#fcd34d", dot: "#d97706", title: "#92400e", text: "#92400e" };

  return (
    <div style={pageStyle}>

      {/* ── Status banner ── */}
      <div style={{
        background: banner.bg,
        border: `1.5px solid ${banner.border}`,
        borderRadius: 16,
        padding: "28px 24px",
        textAlign: "center",
        marginBottom: 32,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: banner.dot, color: "#fff",
          fontSize: 26, display: "flex", alignItems: "center",
          justifyContent: "center", margin: "0 auto 14px",
        }}>{paid ? "✓" : "…"}</div>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: banner.title, marginBottom: 6 }}>
          {paid ? "Booking Confirmed!" : "Verifying your payment"}
        </h1>
        <p style={{ color: banner.text, fontSize: 14, margin: 0 }}>
          {paid
            ? `Thank you, ${guestName}. Your booking is confirmed.`
            : "Your booking is saved, but we have not received confirmation of your payment yet. This page updates automatically. If you have paid, you do not need to pay again."}
        </p>
      </div>

      {/* ── Booking reference ── */}
      <div style={{
        background: "#fff", border: "0.5px solid #e0e0e0",
        borderRadius: 12, padding: "18px 20px", marginBottom: 20,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 10,
      }}>
        <div>
          <p style={{ fontSize: 11, color: "#888", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Booking Reference
          </p>
          <p style={{ fontSize: 22, fontWeight: 700, color: "#111", letterSpacing: "0.04em", margin: 0 }}>
            {booking.booking_ref}
          </p>
        </div>
        <button
          onClick={() => navigator.clipboard?.writeText(booking.booking_ref || "")}
          style={{
            background: "#f3f4f6", border: "none", borderRadius: 8,
            padding: "8px 16px", fontSize: 13, cursor: "pointer", color: "#374151",
          }}
        >
          Copy ID
        </button>
      </div>

      {/* ── Hotel + booking details ── */}
      <div style={{
        background: "#fff", border: "0.5px solid #e0e0e0",
        borderRadius: 12, padding: "16px 20px", marginBottom: 20,
      }}>
        <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 14, color: "#111" }}>
          {booking.hotel?.name || "Hotel"}
        </p>

        {[
          ["Guest",      guestName],
          ["Email",      booking.email || "—"],
          ["Phone",      booking.phone || "—"],
          ["Check-in",   formatDate(booking.check_in)],
          ["Check-out",  formatDate(booking.check_out)],
          ["Duration",   `${booking.nights} night${booking.nights > 1 ? "s" : ""}`],
          ["Rooms",      rooms],
          ["Guests",     `${booking.adults || 1} adult${(booking.adults || 1) > 1 ? "s" : ""}${
            booking.children > 0
              ? `, ${booking.children} child${booking.children > 1 ? "ren" : ""}`
              : ""
          }`],
          ["Payment",    paid ? "Paid" : "Awaiting confirmation"],
        ].map(([label, value]) => (
          <div key={label} style={{
            display: "flex", justifyContent: "space-between",
            fontSize: 13, padding: "7px 0",
            borderBottom: "0.5px solid #f3f4f6",
          }}>
            <span style={{ color: "#6b7280" }}>{label}</span>
            <span style={{ fontWeight: 500, color: "#111", textAlign: "right", maxWidth: "60%" }}>{value}</span>
          </div>
        ))}

        {/* Total */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginTop: 12, paddingTop: 12,
          borderTop: "1px solid #e5e7eb",
        }}>
          <span style={{ fontSize: 14, color: "#374151" }}>Total Amount</span>
          <span style={{ fontSize: 22, fontWeight: 700, color: "#1d9e75" }}>₦{total}</span>
        </div>
      </div>

      {/* ── Email notice (only once the booking is really confirmed) ── */}
      {paid && booking.email && (
        <div style={{
          background: "#eff6ff", border: "0.5px solid #bfdbfe",
          borderRadius: 10, padding: "14px 16px", marginBottom: 24,
          fontSize: 13, color: "#1e40af",
        }}>
          📧 A confirmation has been sent to <strong>{booking.email}</strong>
        </div>
      )}

      {/* ── Action buttons ── */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button onClick={() => navigate("/user")} style={primaryBtn}>
          My bookings
        </button>
        {paid ? (
          <button onClick={() => window.print()} style={secondaryBtn}>
            🖨️ Print Confirmation
          </button>
        ) : (
          <button onClick={() => setChecks((c) => c + 1)} style={secondaryBtn}>
            Check again
          </button>
        )}
      </div>
    </div>
  );
}
