import { useLocation, useNavigate, useParams } from "react-router-dom";

function formatDate(d: string) {
  if (!d) return "—";
  const M = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dt = new Date(d);
  return `${M[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`;
}

export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const { state }     = useLocation();
  const navigate      = useNavigate();

  const form        = state?.form        || {};
  const payMethod   = state?.payMethod   || "transfer";
  const bookingInfo = state?.bookingInfo || {};
  const bankDetails = state?.bankDetails || null;

  const hotel  = bookingInfo?.hotel || {};
  const room   = bookingInfo?.room  || {};
  const nights = bookingInfo?.nights || 1;
  const total  = bookingInfo?.totalPrice
    ? parseFloat(bookingInfo.totalPrice).toLocaleString()
    : "—";

  const guestName = `${form.title || ""} ${form.firstName || ""} ${form.lastName || ""}`.trim() || "Guest";

  return (
    <div style={{
      fontFamily: "system-ui, sans-serif",
      maxWidth: 680,
      margin: "0 auto",
      padding: "40px 16px 80px",
    }}>

      {/* ── Success banner ── */}
      <div style={{
        background: "#f0fdf4",
        border: "1.5px solid #86efac",
        borderRadius: 16,
        padding: "28px 24px",
        textAlign: "center",
        marginBottom: 32,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "#1d9e75", color: "#fff",
          fontSize: 26, display: "flex", alignItems: "center",
          justifyContent: "center", margin: "0 auto 14px",
        }}>✓</div>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: "#14532d", marginBottom: 6 }}>
          Booking {payMethod === "transfer" ? "Received" : "Confirmed"}!
        </h1>
        <p style={{ color: "#166534", fontSize: 14, margin: 0 }}>
          {payMethod === "transfer"
            ? "Complete your bank transfer to confirm your reservation."
            : `Thank you, ${guestName}. Your booking is confirmed.`
          }
        </p>
      </div>

      {/* ── Booking ID ── */}
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
            {bookingId}
          </p>
        </div>
        <button
          onClick={() => navigator.clipboard?.writeText(bookingId || "")}
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
        borderRadius: 12, overflow: "hidden", marginBottom: 20,
      }}>
        {/* Hotel image */}
        {hotel.image && (
          <div style={{ height: 140, overflow: "hidden" }}>
            <img
              src={hotel.image}
              alt={hotel.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={e => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700";
              }}
            />
          </div>
        )}

        <div style={{ padding: "16px 20px" }}>
          <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>
            {hotel.name || "Hotel"}
          </p>

          {[
            ["Guest",      guestName],
            ["Email",      form.email    || "—"],
            ["Phone",      form.phone    || "—"],
            ["Check-in",   formatDate(bookingInfo?.checkIn)],
            ["Check-out",  formatDate(bookingInfo?.checkOut)],
            ["Duration",   `${nights} night${nights > 1 ? "s" : ""}`],
            ["Room",       room.room_type || "Standard"],
            ["Guests",     `${bookingInfo?.adults || 1} adult${(bookingInfo?.adults || 1) > 1 ? "s" : ""}${
              bookingInfo?.children > 0
                ? `, ${bookingInfo.children} child${bookingInfo.children > 1 ? "ren" : ""}`
                : ""
            }`],
            ["Payment",    payMethod === "transfer" ? "Bank Transfer" : payMethod === "paystack" ? "Paystack" : "Flutterwave"],
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
      </div>

      {/* ── Bank transfer details ── */}
      {payMethod === "transfer" && (
        <div style={{
          background: "#fffbeb", border: "1.5px solid #fcd34d",
          borderRadius: 12, padding: "20px 20px", marginBottom: 20,
        }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#92400e", marginBottom: 14 }}>
            🏦 Bank Transfer Details
          </p>

          {bankDetails ? (
            [
              ["Bank",           bankDetails.bank],
              ["Account Name",   bankDetails.account_name],
              ["Account Number", bankDetails.account_number],
              ["Amount",         `₦${parseFloat(bankDetails.amount || bookingInfo?.totalPrice || 0).toLocaleString()}`],
              ["Reference",      bankDetails.reference || bookingId],
            ].map(([label, value]) => (
              <div key={label} style={{
                display: "flex", justifyContent: "space-between",
                fontSize: 13, padding: "6px 0",
                borderBottom: "0.5px solid #fde68a",
              }}>
                <span style={{ color: "#78350f" }}>{label}</span>
                <span style={{ fontWeight: 600, color: "#92400e" }}>{value}</span>
              </div>
            ))
          ) : (
            // Fallback if bankDetails not passed
            [
              ["Bank",           "Guaranty Trust Bank (GTBank)"],
              ["Account Name",   "Stay9ja Hotels Ltd"],
              ["Account Number", "0123456789"],
              ["Amount",         `₦${total}`],
              ["Reference",      bookingId],
            ].map(([label, value]) => (
              <div key={label} style={{
                display: "flex", justifyContent: "space-between",
                fontSize: 13, padding: "6px 0",
                borderBottom: "0.5px solid #fde68a",
              }}>
                <span style={{ color: "#78350f" }}>{label}</span>
                <span style={{ fontWeight: 600, color: "#92400e" }}>{value}</span>
              </div>
            ))
          )}

          <p style={{ fontSize: 12, color: "#92400e", marginTop: 12, lineHeight: 1.6 }}>
            ⚠️ Use your booking reference <strong>{bookingId}</strong> as payment narration.
            Your booking will be confirmed within 2–4 hours after payment is received.
          </p>
        </div>
      )}

      {/* ── Email notice ── */}
      {form.email && (
        <div style={{
          background: "#eff6ff", border: "0.5px solid #bfdbfe",
          borderRadius: 10, padding: "14px 16px", marginBottom: 24,
          fontSize: 13, color: "#1e40af",
        }}>
          📧 A confirmation has been sent to <strong>{form.email}</strong>
        </div>
      )}

      {/* ── Action buttons ── */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            flex: 1, minWidth: 140,
            background: "#1d9e75", color: "#fff",
            border: "none", borderRadius: 10,
            padding: "13px 0", fontSize: 14,
            fontWeight: 500, cursor: "pointer",
          }}
        >
          Back to Home
        </button>
        <button
          onClick={() => window.print()}
          style={{
            flex: 1, minWidth: 140,
            background: "#f3f4f6", color: "#374151",
            border: "none", borderRadius: 10,
            padding: "13px 0", fontSize: 14,
            fontWeight: 500, cursor: "pointer",
          }}
        >
          🖨️ Print Confirmation
        </button>
      </div>
    </div>
  );
}
