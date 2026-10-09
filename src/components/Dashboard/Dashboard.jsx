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
import { getMyBookings } from "../../services/bookingApi";
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
  pending: "Awaiting payment",
  cancelled: "Cancelled",
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function BookingList({ bookings }) {
  return (
    <ul className="ua-bookings">
      {bookings.map((b) => (
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
          </div>
          <div className="ua-booking-side">
            <span className={`ua-status ua-status--${b.booking_status}`}>
              {STATUS_LABEL[b.booking_status] || b.booking_status}
            </span>
            <strong>₦{Number(b.total_price || 0).toLocaleString()}</strong>
            <Link to={`/booking-confirmation/${b.booking_ref}`}>View</Link>
          </div>
        </li>
      ))}
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
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE}/my/profile`, {
        headers: { ...authHeader(), Accept: "application/json" },
      })
      .then((res) => setProfile(res.data?.data || res.data?.user || null))
      .catch(() => setProfile(null)); // fall back to the name saved at login
  }, []);

  useEffect(() => {
    getMyBookings()
      .then((list) => setBookings(list || []))
      .catch(() => setBookings([]));
  }, []);

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
                <BookingList bookings={bookings.slice(0, 3)} />
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
              <BookingList bookings={bookings} />
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
