import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import {
  createBooking,
  getProfile,
  verifyPayment,
} from "../services/bookingApi";
import { clearSession } from "../utils/auth";
import {
  clearPendingBooking,
  readPendingBooking,
} from "../utils/pendingBooking";

import Navbar from "../components/Navbar/Navbar";
import GetApp from "../components/GetApp/GetApp";
import UnlockDeals from "../components/UnlockDeals/UnlockDeals";

const TITLES = [
  "Mr.",
  "Mrs.",
  "Miss.",
  "Dr.",
  "Prof.",
  "Chief.",
  "Engr.",
  "Barr.",
];

// ─── Flutterwave Public Key ──────────────────────────────────
const FLW_PUBLIC_KEY =
  import.meta.env.VITE_FLW_PUBLIC_KEY ||
  "FLWPUBK_TEST-0a198d53a823493cd0adf75a39a0b02e-X";

// ─── UI Components ───────────────────────────────────────────

const BankPill = ({ label }) => (
  <span
    style={{
      background: "#f4f4f4",
      border: "0.5px solid #ddd",
      borderRadius: 6,
      padding: "3px 10px",
      fontSize: 11,
      fontWeight: 500,
      color: "#555",
    }}
  >
    {label}
  </span>
);

const RadioDot = ({ checked }) => (
  <div
    style={{
      width: 18,
      height: 18,
      borderRadius: "50%",
      border: checked ? "none" : "1.5px solid #ccc",
      background: checked ? "#1d9e75" : "transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    {checked && (
      <div
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "#fff",
        }}
      />
    )}
  </div>
);

const StepDot = ({ state, num }) => {
  const s = {
    done: {
      background: "#1d9e75",
      color: "#fff",
    },
    active: {
      background: "#1d9e75",
      color: "#fff",
    },
    pending: {
      background: "#f0f0f0",
      color: "#aaa",
      border: "0.5px solid #ccc",
    },
  };

  return (
    <div
      style={{
        width: 24,
        height: 24,
        borderRadius: "50%",
        fontSize: 11,
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...s[state],
      }}
    >
      {state === "done" ? "✓" : num}
    </div>
  );
};

function FormGroup({ label, children, style }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 5,
        ...style,
      }}
    >
      <label
        style={{
          fontSize: 12,
          color: "#888",
        }}
      >
        {label}
      </label>

      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  fontSize: 14,
  border: "0.5px solid #ddd",
  borderRadius: 8,
  background: "#fff",
  color: "#111",
  outline: "none",
  fontFamily: "inherit",
};

function formatDate(d) {
  if (!d) return "";

  const M = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dt = new Date(d);

  return `${M[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`;
}

// ─── Main Component ──────────────────────────────────────────

export default function HotelBooking() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Router state is lost if the user had to log in first, so fall back to
  // the copy the hotel page saved for this tab.
  const [bookingInfo] = useState(
    () => state || readPendingBooking()
  );

  /*
   * Only two payment methods:
   *
   * 1. transfer = Bank Transfer
   * 2. card     = Visa / Mastercard
   */
  const [payMethod, setPayMethod] = useState("transfer");
  const [onBehalf, setOnBehalf] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  /*
   * The booking saved on the server (status "pending") that is
   * waiting for payment: { ref, amount, txRef }
   */
  const [payment, setPayment] = useState(null);

  const [form, setForm] = useState({
    title: "Mr.",
    firstName: "",
    lastName: "",
    email: "",
    phone: bookingInfo?.phone || "",
    guestFirst: "",
    guestLast: "",
    guestEmail: "",
  });

  const field = (key) => ({
    value: form[key],
    onChange: (e) =>
      setForm((f) => ({
        ...f,
        [key]: e.target.value,
      })),
  });

  // Rooms being booked: [{ room, quantity }]
  const roomLines =
    bookingInfo?.rooms?.length > 0
      ? bookingInfo.rooms
      : bookingInfo?.room
      ? [{ room: bookingInfo.room, quantity: 1 }]
      : [];

  // ───────────────────────────────────────────────────────────
  // Prefill the form from the logged-in user's profile
  // ───────────────────────────────────────────────────────────
  useEffect(() => {
    getProfile()
      .then((profile) => {
        setForm((f) => ({
          ...f,
          firstName: f.firstName || profile?.name || "",
          lastName: f.lastName || profile?.last_name || "",
          email: f.email || profile?.email || "",
          phone: f.phone || String(profile?.phone || ""),
        }));
      })
      .catch(() => {
        // not critical: the user can type their details
      });
  }, []);

  // ───────────────────────────────────────────────────────────
  // Flutterwave Configuration
  // ───────────────────────────────────────────────────────────
  const flwConfig = {
    public_key: FLW_PUBLIC_KEY,

    // Both come from the server once the booking is saved
    tx_ref: payment?.txRef || "",
    amount: payment?.amount || 0,
    currency: "NGN",

    /*
     * Only:
     * - Card
     * - Bank Transfer
     */
    payment_options: "card,banktransfer",

    customer: {
      email: form.email,
      phone_number: form.phone,
      name:
        `${form.firstName} ${form.lastName}`.trim() || "Guest",
    },

    customizations: {
      title: bookingInfo?.hotel?.name || "Hotel Booking",
      description: `${
        roomLines[0]?.room?.room_type || "Room"
      } — ${bookingInfo?.nights || 1} night(s)`,
      logo: bookingInfo?.hotel?.image || "",
    },
  };

  const openFlutterwave = useFlutterwave(flwConfig);

  // ───────────────────────────────────────────────────────────
  // Build Booking Payload
  // ───────────────────────────────────────────────────────────
  // No price is sent: the server works it out from the rooms and dates.
  function buildPayload() {
    return {
      hotel_id: bookingInfo?.hotel?.id,

      rooms: roomLines.map(({ room, quantity }) => ({
        room_id: room.id,
        quantity,
      })),

      check_in: bookingInfo?.checkIn,
      check_out: bookingInfo?.checkOut,
      adults: bookingInfo?.adults || 1,
      children: bookingInfo?.children || 0,

      title: form.title,
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      phone: form.phone,
      pay_method: payMethod,

      ...(onBehalf && {
        guest_first_name: form.guestFirst,
        guest_last_name: form.guestLast,
        guest_email: form.guestEmail || null,
      }),
    };
  }

  // Login expired: send the user to sign in and bring them back here
  function handleAuthError(err) {
    if (err?.response?.status !== 401) return false;

    clearSession();
    navigate("/login", {
      replace: true,
      state: { from: "/hotel-booking" },
    });
    return true;
  }

  // ───────────────────────────────────────────────────────────
  // Flutterwave Payment
  // ───────────────────────────────────────────────────────────
  // Opens once the booking exists on the server (and again on each retry,
  // because every attempt gets a new txRef).
  useEffect(() => {
    if (!payment) return;

    try {
      openFlutterwave({
        callback: async (response) => {
          closePaymentModal();

          const flwSaysPaid =
            response.status === "successful" ||
            response.status === "completed";

          /*
           * The server checks the payment with Flutterwave and only
           * then marks the booking confirmed.
           */
          let confirmed = false;

          if (response.transaction_id) {
            try {
              const data = await verifyPayment(
                payment.ref,
                response.transaction_id
              );
              confirmed = data.status === true;
            } catch (verifyErr) {
              if (handleAuthError(verifyErr)) return;
              console.error(
                "Payment verification failed:",
                verifyErr
              );
            }
          }

          if (confirmed || flwSaysPaid) {
            /*
             * If the server could not confirm yet, the confirmation
             * page shows the booking as "payment being verified".
             */
            clearPendingBooking();
            navigate(`/booking-confirmation/${payment.ref}`);
            return;
          }

          setError(
            "Payment was not completed. Please try again."
          );
          setSubmitting(false);
        },

        onClose: () => {
          setSubmitting(false);
        },
      });
    } catch (err) {
      console.error("Flutterwave Error:", err);

      setError(
        err?.message ||
          "Unable to open payment window. Please try again."
      );
      setSubmitting(false);
    }
  }, [payment]);

  // ───────────────────────────────────────────────────────────
  // Main Submit
  // ───────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.phone
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!bookingInfo || roomLines.length === 0) {
      setError(
        "Booking information missing. Please go back and select a room."
      );
      return;
    }

    setError(null);
    setSubmitting(true);

    // Retrying payment for the booking that is already saved
    if (payment) {
      setPayment({
        ...payment,
        txRef: `${payment.ref}-${Date.now()}`,
      });
      return;
    }

    /*
     * 1. Save the booking as "pending" (server checks availability
     *    and works out the price)
     * 2. Pay that amount through Flutterwave
     */
    try {
      const booking = await createBooking(buildPayload());

      setPayment({
        ref: booking.booking_ref,
        amount: Number(booking.amount),
        txRef: `${booking.booking_ref}-${Date.now()}`,
      });
    } catch (err) {
      if (handleAuthError(err)) return;

      setError(
        err?.response?.data?.message ||
          "We could not create your booking. Please try again."
      );
      setSubmitting(false);
    }
  }

  // ───────────────────────────────────────────────────────────
  // Derived Values
  // ───────────────────────────────────────────────────────────

  const hotel = bookingInfo?.hotel || {};

  const roomSummary =
    roomLines
      .map(
        ({ room, quantity }) =>
          `${quantity} × ${room.room_type || "Room"}`
      )
      .join(", ") || "Standard";

  const nights = bookingInfo?.nights || 1;

  const total = bookingInfo?.totalPrice
    ? parseFloat(
        bookingInfo.totalPrice
      ).toLocaleString()
    : "—";

  // ───────────────────────────────────────────────────────────
  // No Booking
  // ───────────────────────────────────────────────────────────

  if (!bookingInfo) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: 60,
        }}
      >
        <p
          style={{
            color: "#ef4444",
            fontWeight: 600,
          }}
        >
          No booking found.
        </p>

        <p
          style={{
            color: "#6b7280",
            marginBottom: 16,
          }}
        >
          Please go back and select a room first.
        </p>

        <button
          onClick={() => navigate(-1)}
          style={{
            background: "#1d9e75",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 24px",
            cursor: "pointer",
          }}
        >
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          maxWidth: 860,
          margin: "0 auto",
          padding: "24px 16px",
        }}
      >
        {/* ─────────────────────────────────────────────── */}
        {/* Step Indicator */}
        {/* ─────────────────────────────────────────────── */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            marginBottom: 24,
          }}
        >
          {[
            {
              state: "done",
              num: 1,
              label: "Select room",
            },
            {
              state: "active",
              num: 2,
              label: "Payment",
            },
            {
              state: "pending",
              num: 3,
              label: "Confirmation",
            },
          ].map((step, i, arr) => (
            <div
              key={step.num}
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <StepDot
                  state={step.state}
                  num={step.num}
                />

                <span
                  style={{
                    fontSize: 12,
                    color:
                      step.state === "active"
                        ? "#111"
                        : "#999",
                    fontWeight:
                      step.state === "active"
                        ? 500
                        : 400,
                  }}
                >
                  {step.label}
                </span>
              </div>

              {i < arr.length - 1 && (
                <div
                  style={{
                    width: 28,
                    height: 1,
                    background: "#e0e0e0",
                    margin: "0 8px",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* ─────────────────────────────────────────────── */}
        {/* Heading */}
        {/* ─────────────────────────────────────────────── */}

        <h1
          style={{
            fontSize: 20,
            fontWeight: 500,
            marginBottom: 4,
          }}
        >
          Almost done!
        </h1>

        <p
          style={{
            fontSize: 13,
            color: "#666",
            marginBottom: 28,
          }}
        >
          Confirm your details to finalize your
          reservation — it only takes 30 seconds.
        </p>

        {/* ─────────────────────────────────────────────── */}
        {/* Error */}
        {/* ─────────────────────────────────────────────── */}

        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fca5a5",
              borderRadius: 8,
              padding: "12px 16px",
              marginBottom: 20,
              color: "#991b1b",
              fontSize: 13,
            }}
          >
            ❌ {error}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          {/* ═════════════════════════════════════════════ */}
          {/* LEFT COLUMN */}
          {/* ═════════════════════════════════════════════ */}

          <div
            style={{
              flex: 1,
              minWidth: 280,
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 12,
              }}
            >
              How would you like to pay?
            </p>

            {/* ─────────────────────────────────────────── */}
            {/* PAYMENT METHODS */}
            {/* ─────────────────────────────────────────── */}

            {[
              {
                id: "transfer",

                label: "Bank Transfer",

                pills: ["Bank Transfer"],

                desc:
                  "Pay securely using bank transfer.",
              },

              {
                id: "card",

                label: "Visa / Mastercard",

                pills: ["Visa", "Mastercard"],

                desc:
                  "Pay securely using your Visa or Mastercard.",
              },
            ].map((opt) => (
              <div
                key={opt.id}
                onClick={() =>
                  setPayMethod(opt.id)
                }
                style={{
                  border:
                    payMethod === opt.id
                      ? "1.5px solid #1d9e75"
                      : "0.5px solid #e0e0e0",

                  borderRadius: 12,

                  padding: 16,

                  marginBottom: 12,

                  cursor: "pointer",

                  background: "#fff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <RadioDot
                    checked={
                      payMethod === opt.id
                    }
                  />

                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    {opt.label}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    marginTop: 10,
                    marginLeft: 28,
                    flexWrap: "wrap",
                  }}
                >
                  {opt.pills.map((p) => (
                    <BankPill
                      key={p}
                      label={p}
                    />
                  ))}
                </div>

                <p
                  style={{
                    fontSize: 12,
                    color: "#888",
                    marginTop: 8,
                    marginLeft: 28,
                  }}
                >
                  {opt.desc}
                </p>
              </div>
            ))}

            {/* ─────────────────────────────────────────── */}
            {/* Divider */}
            {/* ─────────────────────────────────────────── */}

            <hr
              style={{
                border: "none",
                borderTop:
                  "0.5px solid #e8e8e8",
                margin: "20px 0",
              }}
            />

            <p
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 14,
              }}
            >
              Your details
            </p>

            {/* Name */}
            <div
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <FormGroup
                label="Title"
                style={{
                  maxWidth: 110,
                }}
              >
                <select
                  {...field("title")}
                  style={inputStyle}
                >
                  {TITLES.map((t) => (
                    <option key={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup label="First name *">
                <input
                  {...field("firstName")}
                  placeholder="First name"
                  style={inputStyle}
                />
              </FormGroup>

              <FormGroup label="Last name *">
                <input
                  {...field("lastName")}
                  placeholder="Last name"
                  style={inputStyle}
                />
              </FormGroup>
            </div>

            {/* Email */}
            <FormGroup
              label="Email address *"
              style={{
                marginBottom: 4,
              }}
            >
              <input
                {...field("email")}
                type="email"
                placeholder="your@email.com"
                style={inputStyle}
              />
            </FormGroup>

            <p
              style={{
                fontSize: 11,
                color: "#aaa",
                marginBottom: 14,
              }}
            >
              Booking ID will be sent to this email.
            </p>

            {/* Phone */}
            <FormGroup
              label="Phone number *"
              style={{
                marginBottom: 16,
              }}
            >
              <input
                {...field("phone")}
                type="tel"
                placeholder="+234 ..."
                style={inputStyle}
              />
            </FormGroup>

            {/* On behalf */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={onBehalf}
                onChange={(e) =>
                  setOnBehalf(
                    e.target.checked
                  )
                }
                style={{
                  width: 16,
                  height: 16,
                  accentColor: "#1d9e75",
                }}
              />

              <span
                style={{
                  fontSize: 13,
                  color: "#666",
                }}
              >
                I'm making this reservation on
                behalf of someone else
              </span>
            </label>

            {/* Guest Details */}
            {onBehalf && (
              <div
                style={{
                  background: "#f8f8f8",
                  borderRadius: 8,
                  padding: 14,
                  marginBottom: 16,
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#888",
                    marginBottom: 10,
                  }}
                >
                  Guest details
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <FormGroup label="First name">
                    <input
                      {...field("guestFirst")}
                      placeholder="Guest first name"
                      style={inputStyle}
                    />
                  </FormGroup>

                  <FormGroup label="Last name">
                    <input
                      {...field("guestLast")}
                      placeholder="Guest last name"
                      style={inputStyle}
                    />
                  </FormGroup>
                </div>

                <FormGroup label="Guest email">
                  <input
                    {...field("guestEmail")}
                    type="email"
                    placeholder="guest@email.com"
                    style={inputStyle}
                  />
                </FormGroup>
              </div>
            )}

            {/* ─────────────────────────────────────────── */}
            {/* PAYMENT INFORMATION */}
            {/* ─────────────────────────────────────────── */}

            {payMethod === "card" && (
              <div
                style={{
                  background: "#f0fdf4",
                  border:
                    "1px solid #86efac",
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 16,
                  fontSize: 12,
                  color: "#166534",
                }}
              >
                🔒 Secure Visa / Mastercard
                payment powered by Flutterwave.
              </div>
            )}

            {payMethod === "transfer" && (
              <div
                style={{
                  background: "#f0fdf4",
                  border:
                    "1px solid #86efac",
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 16,
                  fontSize: 12,
                  color: "#166534",
                }}
              >
                🔒 Secure bank transfer payment
                powered by Flutterwave.
              </div>
            )}

            {/* ─────────────────────────────────────────── */}
            {/* PAY BUTTON */}
            {/* ─────────────────────────────────────────── */}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                width: "100%",
                padding: "13px 0",
                background: submitting
                  ? "#6ee7b7"
                  : "#1d9e75",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 500,
                cursor: submitting
                  ? "wait"
                  : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
                gap: 8,
              }}
            >
              {submitting
                ? "Processing..."
                : `Pay ₦${parseFloat(
                    bookingInfo?.totalPrice ||
                      0
                  ).toLocaleString()}`}

              {!submitting && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              )}
            </button>

            {/* Data Policy */}
            <p
              style={{
                fontSize: 11,
                color: "#aaa",
                marginTop: 10,
                lineHeight: 1.6,
              }}
            >
              We use your personal data to
              process services you've applied
              for and for personalised content.
              You consent to our{" "}
              <a
                href="#"
                style={{
                  color: "#1d9e75",
                  textDecoration: "none",
                }}
              >
                Data Policy
              </a>{" "}
              when you click the button above.
            </p>
          </div>

          {/* ═════════════════════════════════════════════ */}
          {/* RIGHT COLUMN */}
          {/* ═════════════════════════════════════════════ */}

          <div
            style={{
              width: 270,
              minWidth: 240,
            }}
          >
            {/* Hotel Card */}
            <div
              style={{
                border:
                  "0.5px solid #e0e0e0",
                borderRadius: 12,
                overflow: "hidden",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  height: 130,
                  overflow: "hidden",
                  background: "#f3f4f6",
                }}
              >
                {hotel.image ? (
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400";
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      background:
                        "linear-gradient(135deg, #e1f5ee, #9fe1cb)",
                    }}
                  >
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#1d9e75"
                      strokeWidth="1.5"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />

                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </div>
                )}
              </div>

              <div
                style={{
                  padding: 14,
                }}
              >
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    marginBottom: 10,
                  }}
                >
                  {hotel.name || "Hotel"}
                </p>

                {[
                  [
                    "Check-in",
                    formatDate(
                      bookingInfo?.checkIn
                    ) || "—",
                  ],

                  [
                    "Check-out",
                    formatDate(
                      bookingInfo?.checkOut
                    ) || "—",
                  ],

                  [
                    "Duration",
                    `${nights} night${
                      nights > 1
                        ? "s"
                        : ""
                    }`,
                  ],

                  [
                    "Rooms",
                    roomSummary,
                  ],

                  [
                    "Guests",
                    `${bookingInfo?.adults || 1} adult${
                      (bookingInfo?.adults ||
                        1) > 1
                        ? "s"
                        : ""
                    }${
                      bookingInfo?.children >
                      0
                        ? `, ${
                            bookingInfo.children
                          } child${
                            bookingInfo.children >
                            1
                              ? "ren"
                              : ""
                          }`
                        : ""
                    }`,
                  ],
                ].map(
                  ([label, val]) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        fontSize: 12,
                        padding: "5px 0",
                        borderBottom:
                          "0.5px solid #f0f0f0",
                      }}
                    >
                      <span
                        style={{
                          color: "#888",
                        }}
                      >
                        {label}
                      </span>

                      <span
                        style={{
                          fontWeight: 500,
                        }}
                      >
                        {val}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Total */}
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                padding: "12px 14px",
                background: "#f8f8f8",
                borderRadius: 8,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: "#888",
                }}
              >
                Total
              </span>

              <span
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                }}
              >
                ₦{total}
              </span>
            </div>

            {/* Change Room */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate(-1);
              }}
              style={{
                fontSize: 12,
                color: "#1d9e75",
                textDecoration: "none",
                display: "block",
                textAlign: "center",
                marginTop: 12,
              }}
            >
              ← Change room or dates
            </a>
          </div>
        </div>
      </div>

      <GetApp />

      <UnlockDeals />
    </>
  );
}