import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { authHeader, clearSession, getUserName } from "../../utils/auth";
import "./Dashboard.css";

const TABS = [
  { id: "overview", label: "Dashboard", icon: FiGrid },
  { id: "bookings", label: "Booking Status", icon: FiCalendar },
  { id: "profile", label: "User Profile", icon: FiUser },
  { id: "reviews", label: "Reviews & Rewards", icon: FiStar },
  { id: "points", label: "Membership Points", icon: FiAward },
];

const EMPTY = {
  bookings: {
    title: "No bookings yet",
    text: "When you book a hotel, its status will show up here.",
  },
  reviews: {
    title: "No reviews yet",
    text: "After a stay you can review the hotel and earn rewards.",
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

const Dashboard = () => {
  const [tab, setTab] = useState("overview");
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE}/admin/usersProfile`, {
        headers: { ...authHeader(), Accept: "application/json" },
      })
      .then((res) => setProfile(res.data?.data || res.data?.user || null))
      .catch(() => setProfile(null)); // fall back to the name saved at login
  }, []);

  const name = profile?.name || getUserName() || "Guest";
  const initial = name.trim().charAt(0).toUpperCase();
  const active = TABS.find((t) => t.id === tab);

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
            <div className="ua-avatar">{initial}</div>
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
              <EmptyState {...EMPTY.bookings} />
            </>
          )}

          {tab === "profile" && (
            <dl className="ua-profile">
              <div>
                <dt>Name</dt>
                <dd>{name}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{profile?.email || "—"}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{profile?.phone || profile?.mobile || "—"}</dd>
              </div>
            </dl>
          )}

          {EMPTY[tab] && <EmptyState {...EMPTY[tab]} />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
