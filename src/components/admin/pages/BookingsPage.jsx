// components/admin/pages/BookingsPage.jsx

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { StatusBadge } from "../ui/Badges";

export default function BookingsPage({ openModal }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [gatewayFilter, setGatewayFilter] = useState("All Gateways");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://dhunobeats.com/api/admin/bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      // Latest data first
      const sortedBookings = (response.data || []).sort(
        (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at)
      );

      setBookings(sortedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Gateways
  const gateways = useMemo(() => {
    const allGateways = bookings
      .map((booking) => booking.pay_method)
      .filter(Boolean);

    return ["All Gateways", ...new Set(allGateways)];
  }, [bookings]);

  // Filtered Data
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const status = (
        b.booking_status || ""
      ).toLowerCase();

      const gateway = b.pay_method || "";

      const bookingDate = b.check_in;

      const matchesStatus =
        statusFilter === "All Statuses" ||
        status === statusFilter.toLowerCase();

      const matchesGateway =
        gatewayFilter === "All Gateways" ||
        gateway === gatewayFilter;

      let matchesDate = true;

      if (fromDate && bookingDate) {
        matchesDate =
          new Date(bookingDate) >=
          new Date(fromDate);
      }

      if (toDate && bookingDate) {
        matchesDate =
          matchesDate &&
          new Date(bookingDate) <=
            new Date(toDate);
      }

      return (
        matchesStatus &&
        matchesGateway &&
        matchesDate
      );
    });
  }, [
    bookings,
    statusFilter,
    gatewayFilter,
    fromDate,
    toDate,
  ]);

  // Pagination Logic
  const totalPages = Math.ceil(
    filteredBookings.length / bookingsPerPage
  );

  const indexOfLastBooking =
    currentPage * bookingsPerPage;

  const indexOfFirstBooking =
    indexOfLastBooking - bookingsPerPage;

  const currentBookings =
    filteredBookings.slice(
      indexOfFirstBooking,
      indexOfLastBooking
    );

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    statusFilter,
    gatewayFilter,
    fromDate,
    toDate,
  ]);

  return (
    <div>
      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
        {/* Status Filter */}
        <select
          className="s9-input"
          style={{
            padding: "8px 12px",
            fontSize: 13,
            width: "auto",
          }}
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option>All Statuses</option>
          <option value="confirmed">
            Confirmed
          </option>
          <option value="pending">
            Pending
          </option>
          <option value="cancelled">
            Cancelled
          </option>
        </select>

        {/* Gateway Filter */}
        <select
          className="s9-input"
          style={{
            padding: "8px 12px",
            fontSize: 13,
            width: "auto",
          }}
          value={gatewayFilter}
          onChange={(e) =>
            setGatewayFilter(e.target.value)
          }
        >
          {gateways.map((gateway, index) => (
            <option key={index} value={gateway}>
              {gateway}
            </option>
          ))}
        </select>

        {/* Date Filters */}
        <input
          type="date"
          className="s9-input"
          style={{
            padding: "8px 12px",
            fontSize: 13,
          }}
          value={fromDate}
          onChange={(e) =>
            setFromDate(e.target.value)
          }
        />

        <input
          type="date"
          className="s9-input"
          style={{
            padding: "8px 12px",
            fontSize: 13,
          }}
          value={toDate}
          onChange={(e) =>
            setToDate(e.target.value)
          }
        />

        <button className="s9-btn s9-btn-primary">
          Filter
        </button>

        <button
          className="s9-btn s9-btn-outline"
          style={{ marginLeft: "auto" }}
        >
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="s9-card">
        <table className="s9-tbl">
          <thead>
            <tr>
              <th>Ref</th>
              <th>Guest</th>
              <th>Hotel</th>
              <th>Room</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Nights</th>
              <th>Amount</th>
              <th>Gateway</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="11"
                  style={{
                    textAlign: "center",
                    padding: 20,
                  }}
                >
                  Loading...
                </td>
              </tr>
            ) : currentBookings.length > 0 ? (
              currentBookings.map((b, index) => (
                <tr key={b.id || index}>
                  {/* Ref */}
                  <td>
                    <code className="s9-code">
                      {b.booking_ref ||
                        `BOOK-${b.id}`}
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
                        ? `${b.first_name || ""} ${
                            b.last_name || ""
                          }`
                        : "Guest"}
                    </div>

                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--muted)",
                      }}
                    >
                      {b.phone || "N/A"}
                    </div>
                  </td>

                  {/* Hotel */}
                  <td>
                    {b.hotel?.name || "N/A"}
                  </td>

                  {/* Room */}
                  <td>
                    {b.room?.room_type || "N/A"}
                  </td>

                  {/* Check-in */}
                  <td>
                    {b.check_in
                      ? new Date(
                          b.check_in
                        ).toLocaleDateString()
                      : "N/A"}
                  </td>

                  {/* Check-out */}
                  <td>
                    {b.check_out
                      ? new Date(
                          b.check_out
                        ).toLocaleDateString()
                      : "N/A"}
                  </td>

                  {/* Nights */}
                  <td>
                    {b.nights ||
                      Math.ceil(
                        (new Date(b.check_out) -
                          new Date(b.check_in)) /
                          (1000 * 60 * 60 * 24)
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
                    ₦{b.total_price || "0"}
                  </td>

                  {/* Gateway */}
                  <td>
                    <span className="s9-tag">
                      {b.pay_method || "N/A"}
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

                  {/* Actions */}
                  <td
                    style={{
                      display: "flex",
                      gap: 5,
                    }}
                  >
                    {b.booking_status ===
                    "pending" ? (
                      <>
                        <button
                          className="s9-btn s9-btn-gold s9-btn-sm"
                          onClick={openModal}
                        >
                          Confirm
                        </button>

                        <button className="s9-btn s9-btn-danger s9-btn-sm">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="s9-btn s9-btn-outline s9-btn-sm">
                          View
                        </button>

                        <button className="s9-btn s9-btn-outline s9-btn-sm">
                          Receipt
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="11"
                  style={{
                    textAlign: "center",
                    padding: 20,
                  }}
                >
                  No Bookings Found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {!loading &&
          filteredBookings.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
                padding: 20,
                flexWrap: "wrap",
              }}
            >
              <button
                className="s9-btn s9-btn-outline s9-btn-sm"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage(
                    currentPage - 1
                  )
                }
              >
                Prev
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      setCurrentPage(index + 1)
                    }
                    className={`s9-btn s9-btn-sm ${
                      currentPage ===
                      index + 1
                        ? "s9-btn-primary"
                        : "s9-btn-outline"
                    }`}
                  >
                    {index + 1}
                  </button>
                )
              )}

              <button
                className="s9-btn s9-btn-outline s9-btn-sm"
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    currentPage + 1
                  )
                }
              >
                Next
              </button>
            </div>
          )}
      </div>
    </div>
  );
}