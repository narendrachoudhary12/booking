// components/admin/Dashboard.jsx

import { API_BASE } from "../../config/api";
import { useEffect, useState } from "react";
import axios from "axios";

import RevenueChart from "./ui/RevenueChart";
import { StatusBadge, TierBadge } from "./ui/Badges";

const TOP_HOTELS = [
  {
    name: "Eko Suites & Towers",
    meta: "Victoria Island, Lagos",
    tier: 1,
    revenue: "₦4.2M",
    bookings: 62,
  },
  {
    name: "Transcorp Hilton",
    meta: "Maitama, Abuja",
    tier: 1,
    revenue: "₦3.8M",
    bookings: 44,
  },
  {
    name: "Radisson Blu Anchorage",
    meta: "Victoria Island, Lagos",
    tier: 1,
    revenue: "₦2.9M",
    bookings: 38,
  },
  {
    name: "Bolton White Hotel",
    meta: "Garki, Abuja",
    tier: 2,
    revenue: "₦1.4M",
    bookings: 29,
  },
];

const LIVE_FEED = [
  {
    color: "green",
    text: (
      <>
        New booking{" "}
        <strong>STY-2024-05821</strong> —
        Eko Suites, Lagos
      </>
    ),
    time: "2m ago",
  },
  {
    color: "gold",
    text: "Bank transfer pending — ₦135,000 · Ref STY-2024-05819",
    time: "8m ago",
  },
  {
    color: "green",
    text: (
      <>
        Payment confirmed via Paystack —{" "}
        <strong>Amaka Nwosu</strong>
      </>
    ),
    time: "14m ago",
  },
  {
    color: "blue",
    text: (
      <>
        New hotel onboarded —{" "}
        <strong>
          Protea Hotel, Enugu
        </strong>{" "}
        (Tier 2)
      </>
    ),
    time: "1h ago",
  },
  {
    color: "red",
    text: "Booking STY-2024-05801 cancelled — refund initiated",
    time: "2h ago",
  },
  {
    color: "green",
    text: "ARI sync complete — 14 hotels updated via Channex",
    time: "2h ago",
  },
];

export default function Dashboard({
  onNav,
  openModal,
}) {
  const [recentBookings, setRecentBookings] =
    useState([]);

  useEffect(() => {
    fetchRecentBookings();
  }, []);

  const fetchRecentBookings = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await axios.get(
        `${API_BASE}/admin/bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      // Latest bookings first + only 5
      const latestBookings = (
        response.data || []
      )
        .sort(
          (a, b) =>
            new Date(b.created_at) -
            new Date(a.created_at)
        )
        .slice(0, 5);

      setRecentBookings(latestBookings);
    } catch (error) {
      console.error(
        "Error fetching bookings:",
        error
      );
    }
  };

  return (
    <div>
      {/* ── Stat Cards ── */}
      <div className="s9-stats-grid">
        {[
          {
            cls: "s-green",
            label: "Revenue This Month",
            val: "₦28.4M",
            sub: "347 bookings completed",
            trend: "↑ +18% vs last month",
            up: true,
          },
          {
            cls: "s-gold",
            label: "Active Bookings",
            val: "142",
            sub: "Across 46 hotels",
            trend: "↑ +24 this week",
            up: true,
          },
          {
            cls: "s-blue",
            label: "Hotels Listed",
            val: "1,847",
            sub: "38 states covered",
            trend: "↑ +12 this week",
            up: true,
          },
          {
            cls: "s-red",
            label: "Pending Actions",
            val: "7",
            sub: "3 bookings · 4 bank transfers",
            trend: "⚠ Needs attention",
            up: false,
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`s9-stat-card ${s.cls}`}
          >
            <div className="s9-stat-label">
              {s.label}
            </div>

            <div className="s9-stat-val">
              {s.val}
            </div>

            <div className="s9-stat-sub">
              {s.sub}
            </div>

            <div
              className={`s9-stat-trend ${
                s.up
                  ? "trend-up"
                  : "trend-dn"
              }`}
            >
              {s.trend}
            </div>
          </div>
        ))}
      </div>

      {/* ── Revenue Chart + Live Feed ── */}
      <div className="s9-two-col">
        <div className="s9-card">
          <div className="s9-card-head">
            <div className="s9-card-title">
              Monthly Revenue
            </div>

            <button className="s9-btn s9-btn-outline s9-btn-sm">
              This Year
            </button>
          </div>

          <div className="s9-card-body">
            <RevenueChart />
          </div>
        </div>

        <div className="s9-card">
          <div className="s9-card-head">
            <div className="s9-card-title">
              Live Activity
            </div>

            <span
              className="s9-badge badge-confirmed"
              style={{ fontSize: 10 }}
            >
              ● Live
            </span>
          </div>

          <div
            className="s9-card-body"
            style={{ padding: "12px 16px" }}
          >
            {LIVE_FEED.map((f, i) => (
              <div
                key={i}
                className="s9-feed-item"
              >
                <div
                  className={`s9-feed-dot ${f.color}`}
                />

                <div className="s9-feed-text">
                  {f.text}
                </div>

                <div className="s9-feed-time">
                  {f.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Bookings ── */}
      <div className="s9-card">
        <div className="s9-card-head">
          <div className="s9-card-title">
            Recent Bookings
          </div>

          <button
            className="s9-btn s9-btn-outline s9-btn-sm"
            onClick={() => onNav("bookings")}
          >
            View All
          </button>
        </div>

        <table className="s9-tbl">
          <thead>
            <tr>
              <th>Ref</th>
              <th>Guest</th>
              <th>Hotel</th>
              <th>Room</th>
              <th>Check-in</th>
              <th>Nights</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {recentBookings.length > 0 ? (
              recentBookings.map((b, index) => (
                <tr key={b.id || index}>
                  {/* Ref */}
                  <td>
                    <code className="s9-code">
                      {b.booking_ref}
                    </code>
                  </td>

                  {/* Guest */}
                  <td>
                    <div
                      style={{
                        fontWeight: 500,
                      }}
                    >
                      {b.first_name ||
                      b.guest_first_name
                        ? `${
                            b.first_name || ""
                          } ${
                            b.last_name || ""
                          }`
                        : "Guest"}
                    </div>

                    <div
                      style={{
                        fontSize: 11,
                        color:
                          "var(--muted)",
                      }}
                    >
                      {b.email ||
                        b.guest_email ||
                        "N/A"}
                    </div>
                  </td>

                  {/* Hotel */}
                  <td>
                    {b.hotel?.name || "N/A"}
                  </td>

                  {/* Room */}
                  <td>
                    {b.room?.room_type ||
                      "N/A"}
                  </td>

                  {/* Check-in */}
                  <td>
                    {b.check_in
                      ? new Date(
                          b.check_in
                        ).toLocaleDateString()
                      : "N/A"}
                  </td>

                  {/* Nights */}
                  <td>
                    {b.nights ||
                      Math.ceil(
                        (new Date(
                          b.check_out
                        ) -
                          new Date(
                            b.check_in
                          )) /
                          (1000 *
                            60 *
                            60 *
                            24)
                      ) ||
                      0}
                  </td>

                  {/* Amount */}
                  <td
                    style={{
                      fontWeight: 600,
                      color:
                        b.booking_status ===
                        "cancelled"
                          ? "var(--red)"
                          : b.booking_status ===
                            "pending"
                          ? "var(--gold)"
                          : "var(--green)",
                    }}
                  >
                    ₦
                    {b.total_price || "0"}
                  </td>

                  {/* Payment */}
                  <td>
                    <span className="s9-tag">
                      {b.pay_method ||
                        "N/A"}
                    </span>
                  </td>

                  {/* Status */}
                  <td>
                    <StatusBadge
                      status={
                        b.booking_status ||
                        "pending"
                      }
                    />
                  </td>

                  {/* Action */}
                  <td>
                    {b.booking_status ===
                    "pending" ? (
                      <button
                        className="s9-btn s9-btn-gold s9-btn-sm"
                        onClick={openModal}
                      >
                        Confirm
                      </button>
                    ) : (
                      <button className="s9-btn s9-btn-outline s9-btn-sm">
                        {b.booking_status ===
                        "cancelled"
                          ? "Refund"
                          : "View"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="10"
                  style={{
                    textAlign: "center",
                    padding: 20,
                  }}
                >
                  No Recent Bookings
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Top Hotels + Revenue Breakdown ── */}
      <div className="s9-two-col">
        <div className="s9-card">
          <div className="s9-card-head">
            <div className="s9-card-title">
              Top Performing Hotels
            </div>

            <button
              className="s9-btn s9-btn-outline s9-btn-sm"
              onClick={() => onNav("hotels")}
            >
              All Hotels
            </button>
          </div>

          <div className="s9-card-body">
            {TOP_HOTELS.map((h) => (
              <div
                key={h.name}
                className="s9-hotel-item"
              >
                <div className="s9-hotel-thumb">
                  🏨
                </div>

                <div className="s9-hotel-info">
                  <div className="s9-hotel-name">
                    {h.name}
                  </div>

                  <div className="s9-hotel-meta">
                    {h.meta} ·{" "}
                    <TierBadge
                      tier={h.tier}
                    />
                  </div>
                </div>

                <div className="s9-hotel-stats">
                  <div className="s9-hotel-revenue">
                    {h.revenue}
                  </div>

                  <div className="s9-hotel-bookings">
                    {h.bookings} bookings
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="s9-card">
          <div className="s9-card-head">
            <div className="s9-card-title">
              Revenue Breakdown
            </div>
          </div>

          <div className="s9-card-body">
            <div className="s9-three-col">
              <div className="s9-rev-box">
                <div className="s9-rev-label">
                  Paystack
                </div>

                <div
                  className="s9-rev-val"
                  style={{
                    color: "var(--blue)",
                  }}
                >
                  ₦16.2M
                </div>
              </div>

              <div className="s9-rev-box">
                <div className="s9-rev-label">
                  Flutterwave
                </div>

                <div
                  className="s9-rev-val"
                  style={{
                    color: "var(--gold)",
                  }}
                >
                  ₦9.4M
                </div>
              </div>

              <div className="s9-rev-box">
                <div className="s9-rev-label">
                  Bank Transfer
                </div>

                <div
                  className="s9-rev-val"
                  style={{
                    color: "var(--green)",
                  }}
                >
                  ₦2.8M
                </div>
              </div>
            </div>

            <div style={{ fontSize: 13 }}>
              {[
                {
                  label:
                    "Platform commission (15%)",
                  val: "₦4.26M",
                  color:
                    "var(--green)",
                },
                {
                  label:
                    "Hotel payouts due",
                  val: "₦24.14M",
                  color: "var(--ink)",
                },
                {
                  label:
                    "Pending refunds",
                  val: "₦270,000",
                  color: "var(--red)",
                },
              ].map((r) => (
                <div
                  key={r.label}
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    padding: "8px 0",
                    borderBottom:
                      "1px solid var(--border)",
                  }}
                >
                  <span
                    style={{
                      color:
                        "var(--muted)",
                    }}
                  >
                    {r.label}
                  </span>

                  <span
                    style={{
                      fontWeight: 600,
                      color: r.color,
                    }}
                  >
                    {r.val}
                  </span>
                </div>
              ))}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  padding: "8px 0",
                }}
              >
                <span
                  style={{ fontWeight: 700 }}
                >
                  Net revenue
                </span>

                <span
                  style={{
                    fontWeight: 700,
                    color: "var(--green)",
                    fontSize: 16,
                  }}
                >
                  ₦3.99M
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}