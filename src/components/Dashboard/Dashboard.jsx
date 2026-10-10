import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  FiAward,
  FiCalendar,
  FiGrid,
  FiLogOut,
  FiStar,
  FiUser,
} from "react-icons/fi";
import { API_BASE } from "../../config/api";
import popup from "../common/Popup/popupService";
import {
  cancelBooking,
  getBookingStatus,
  getMyBookings,
  getPlatformInfo,
} from "../../services/bookingApi";
import {
  authHeader,
  clearSession,
  getUserName,
  setSessionUser,
} from "../../utils/auth";
import ProfileTab from "./ProfileTab";
import ReviewsTab from "./ReviewsTab";
import "./Dashboard.css";

const TABS = [
  { id: "overview", label: "Dashboard", icon: FiGrid },
  { id: "bookings", label: "Booking Status", icon: FiCalendar },
  { id: "profile", label: "User Profile", icon: FiUser },
  { id: "reviews", label: "My Reviews", icon: FiStar },
  // { id: "points", label: "Membership Points", icon: FiAward },
];

const EMPTY = {
  bookings: {
    title: "No bookings yet",
    text: "When you book a hotel, its status will show up here.",
  },
  points: {
    title: "No points yet",
    text: "You earn membership points every time you complete a stay.",
  },
};

function EmptyState({ title, text }) {
  return (
    <div className="ua-empty">
      <h3>{title}</h3>
      <p>{text}</p>
      <Link to="/" className="ua-btn">
        Find a hotel
      </Link>
    </div>
  );
}

const STATUS_LABEL = {
  confirmed: "Confirmed",
  completed: "Completed",
  pending: "Awaiting payment",
  cancelled: "Cancelled",
};

const REFUND_LABEL = {
  requested: "Refund is being processed",
  refunded: "Refunded",
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const money = (amount) => `₦${Number(amount || 0).toLocaleString()}`;

// A confirmed booking whose check-out day has passed is "completed"
const statusOf = (b) =>
  b.booking_status === "confirmed" && new Date(b.check_out) < new Date(new Date().toDateString())
    ? "completed"
    : b.booking_status;

const BOOKING_FILTERS = [
  { id: "", label: "All" },
  { id: "confirmed", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "pending", label: "Awaiting payment" },
  { id: "cancelled", label: "Cancelled" },
];

// extra: cancellation / refund state per booking ref; onCancel(booking)
function BookingList({ bookings, extra = {}, onCancel }) {
  return (
    <ul className="ua-bookings">
      {bookings.map((b) => {
        const status = statusOf(b);
        const more = extra[b.booking_ref] || {};

        return (
          <li key={b.booking_ref} className="ua-booking">
            <div className="ua-booking-main">
              <strong>{b.hotel?.name || "Hotel"}</strong>
              <span>
                {formatDate(b.check_in)} – {formatDate(b.check_out)} ·{" "}
                {b.nights} night{b.nights > 1 ? "s" : ""}
              </span>
              <span>
                {(b.rooms || [])
                  .map((r) => `${r.quantity} × ${r.room_type || "Room"}`)
                  .join(", ")}
              </span>
              <span className="ua-booking-ref">Ref: {b.booking_ref}</span>
              {more.refund_status && (
                <span className="ua-booking-ref">
                  {REFUND_LABEL[more.refund_status]}: {money(more.refund_amount)}
                </span>
              )}
            </div>
            <div className="ua-booking-side">
              <span className={`ua-status ua-status--${status}`}>
                {STATUS_LABEL[status] || status}
              </span>
              <strong>{money(b.total_price)}</strong>
              <Link to={`/booking-confirmation/${b.booking_ref}`}>View</Link>
              {more.cancellable && status !== "completed" && (
                <button
                  type="button"
                  className="ua-link-btn ua-link-btn--danger"
                  onClick={() => onCancel(b)}
                >
                  Cancel booking
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

const Dashboard = () => {
  // The open tab lives in the URL (/user?tab=reviews) so pages can link to it
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get("tab");
  const tab = TABS.some((t) => t.id === requested) ? requested : "overview";
  const setTab = (id) => setSearchParams(id === "overview" ? {} : { tab: id });

  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState(null); // null = still loading
  // Cancellation / refund state per booking ref
  const [bookingExtra, setBookingExtra] = useState({});
  // Support contacts and the cancellation rule set by the admin
  const [platform, setPlatform] = useState(null);
  const [bookingFilter, setBookingFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE}/my/profile`, {
        headers: { ...authHeader(), Accept: "application/json" },
      })
      .then((res) => setProfile(res.data?.data || res.data?.user || null))
      .catch(() => setProfile(null)); // fall back to the name saved at login
  }, []);

  const loadBookings = () =>
    Promise.all([
      getMyBookings()
        .then((list) => setBookings(list || []))
        .catch(() => setBookings([])),
      getBookingStatus()
        .then((map) => setBookingExtra(map || {}))
        .catch(() => setBookingExtra({})),
    ]);

  useEffect(() => {
    loadBookings();
    getPlatformInfo().then(setPlatform).catch(() => setPlatform(null));
  }, []);

  const handleCancel = async (booking) => {
    const paid = booking.payment_status === "paid";
    const sure = await popup.confirm(
      `Cancel your booking at ${booking.hotel?.name || "this hotel"}?` +
        (paid ? " The amount you paid will be refunded." : ""),
      { danger: true, confirmText: "Cancel booking", cancelText: "Keep it" }
    );
    if (!sure) return;

    try {
      const res = await cancelBooking(booking.booking_ref);
      await loadBookings();
      popup.success(res.message);
    } catch (error) {
      popup.error(error.response?.data?.message || "Could not cancel the booking.");
    }
  };

  // Numbers for the overview, worked out from the bookings
  const all = bookings || [];
  const stats = {
    upcoming: all.filter((b) => statusOf(b) === "confirmed").length,
    completed: all.filter((b) => statusOf(b) === "completed").length,
    spent: all
      .filter((b) => b.payment_status === "paid" && b.booking_status !== "cancelled")
      .reduce((sum, b) => sum + Number(b.total_price || 0), 0),
  };
  const shownBookings = all.filter((b) => !bookingFilter || statusOf(b) === bookingFilter);

  const name = profile?.name || getUserName() || "Guest";
  const initial = name.trim().charAt(0).toUpperCase();
  const active = TABS.find((t) => t.id === tab);

  // Profile saved: refresh this page and the name / photo in the navbar
  const handleProfileSaved = (user) => {
    setProfile(user);
    setSessionUser(user);
  };

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <div className="ua-page">
      <div className="ua-wrap">
        {/* Sidebar */}
        <aside className="ua-sidebar">
          <div className="ua-user">
            {profile?.image ? (
              <img src={profile.image} alt="" className="ua-avatar" />
            ) : (
              <div className="ua-avatar">{initial}</div>
            )}
            <div className="ua-user-text">
              <strong>{name}</strong>
              {profile?.email && <span>{profile.email}</span>}
            </div>
          </div>

          <nav className="ua-nav">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                className={`ua-nav-item${tab === id ? " is-active" : ""}`}
                onClick={() => setTab(id)}
              >
                <Icon />
                <span>{label}</span>
              </button>
            ))}
            <button
              type="button"
              className="ua-nav-item ua-nav-logout"
              onClick={handleLogout}
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main */}
        <main className="ua-main">
          <header className="ua-head">
            <h1>{tab === "overview" ? `Welcome, ${name}` : active.label}</h1>
            <p className="ua-crumb">
              <Link to="/">Home</Link> / {active.label}
            </p>
          </header>

          {tab === "overview" && (
            <>
              {bookings && (
                <div className="ua-stats">
                  <div className="ua-stat">
                    <strong>{stats.upcoming}</strong>
                    <span>Upcoming stay{stats.upcoming === 1 ? "" : "s"}</span>
                  </div>
                  <div className="ua-stat">
                    <strong>{stats.completed}</strong>
                    <span>Completed stay{stats.completed === 1 ? "" : "s"}</span>
                  </div>
                  <div className="ua-stat">
                    <strong>{money(stats.spent)}</strong>
                    <span>Total spent</span>
                  </div>
                </div>
              )}
              <div className="ua-cards">
                {TABS.filter((t) => t.id !== "overview").map(
                  ({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      className="ua-card"
                      onClick={() => setTab(id)}
                    >
                      <Icon className="ua-card-icon" />
                      <span className="ua-card-label">{label}</span>
                      <span className="ua-card-link">View</span>
                    </button>
                  )
                )}
              </div>
              {bookings?.length > 0 ? (
                <BookingList bookings={bookings.slice(0, 3)} extra={bookingExtra} onCancel={handleCancel} />
              ) : (
                bookings && <EmptyState {...EMPTY.bookings} />
              )}
            </>
          )}

          {tab === "profile" && (
            <ProfileTab profile={profile} onSaved={handleProfileSaved} />
          )}

          {tab === "reviews" && <ReviewsTab />}

          {tab === "bookings" &&
            (bookings?.length > 0 ? (
              <>
                <div className="ua-filters">
                  {BOOKING_FILTERS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      className={`ua-filter${bookingFilter === f.id ? " is-active" : ""}`}
                      onClick={() => setBookingFilter(f.id)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {shownBookings.length > 0 ? (
                  <BookingList bookings={shownBookings} extra={bookingExtra} onCancel={handleCancel} />
                ) : (
                  <p className="ua-hint">No bookings with this status.</p>
                )}

                {platform && (
                  <p className="ua-hint">
                    {platform.free_cancellation_hours > 0
                      ? `Free cancellation until ${platform.free_cancellation_hours} hours before check-in. `
                      : ""}
                    Need help? {platform.support_email}
                    {platform.support_phone ? ` · ${platform.support_phone}` : ""}
                  </p>
                )}
              </>
            ) : (
              bookings && <EmptyState {...EMPTY.bookings} />
            ))}

          {tab === "points" && <EmptyState {...EMPTY.points} />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
