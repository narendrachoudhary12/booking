// components/admin/Topbar.jsx

import { API_BASE } from "../../config/api";
import { authHeader, clearSession } from "../../utils/auth";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { PAGE_TITLES } from "./constants";

export default function Topbar({
  activePage,
}) {
  const [user, setUser] = useState(null);

  // Popup
  const [showMenu, setShowMenu] =
    useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  // Close popup outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/admin/usersProfile`,
        {
          headers: {
            ...authHeader(),
            Accept: "application/json",
          },
        }
      );

      setUser(
        response.data.data ||
          response.data.user ||
          response.data
      );
    } catch (error) {
      console.error(
        "Error fetching profile:",
        error
      );
    }
  };

  const handleLogout = () => {
    clearSession();

    window.location.href = "/login";
  };

  // Initials
  const getInitials = () => {
    if (!user?.name) return "A";

    return user.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="s9-topbar">
      {/* Title */}
      <div className="s9-topbar-title">
        {PAGE_TITLES[activePage] ||
          activePage}
      </div>

      {/* Right */}
      <div className="s9-topbar-right">
        {/* Search */}
        <input
          className="s9-search"
          type="text"
          placeholder="Search bookings, hotels..."
        />

        {/* New Booking */}
        <button className="s9-btn s9-btn-primary s9-btn-sm">
          + New Booking
        </button>

        {/* User Menu */}
        <div
          ref={menuRef}
          style={{
            position: "relative",
          }}
        >
          {/* User Button */}
          <div
            onClick={() =>
              setShowMenu(!showMenu)
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              padding: "6px 10px",
              borderRadius: 10,
            }}
          >
            {/* Name */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                lineHeight: 1.2,
              }}
            >
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                {user?.name || "Mohit"}
              </span>

              <span
                style={{
                  fontSize: 11,
                  color: "var(--muted)",
                }}
              >
                {user?.email ||
                  "admin@gmail.com"}
              </span>
            </div>

            {/* Avatar */}
            <div className="s9-avatar">
              {getInitials()}
            </div>
          </div>

          {/* Popup */}
          {showMenu && (
            <div
              style={{
                position: "absolute",
                top: "110%",
                right: 0,
                width: 220,
                background: "#fff",
                border:
                  "1px solid var(--border)",
                borderRadius: 14,
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.12)",
                zIndex: 999,
                overflow: "hidden",
              }}
            >
              {/* User Info */}
              <div
                style={{
                  padding: 16,
                  borderBottom:
                    "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {user?.name || "Mohit"}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "var(--muted)",
                    marginTop: 4,
                  }}
                >
                  {user?.email ||
                    "admin@gmail.com"}
                </div>
              </div>

              {/* Menu Items */}
              <div
                style={{
                  padding: 8,
                }}
              >
                <button
                  className="s9-btn s9-btn-outline"
                  style={{
                    width: "100%",
                    justifyContent:
                      "flex-start",
                    marginBottom: 8,
                  }}
                >
                  Profile
                </button>

                <button
                  className="s9-btn s9-btn-outline"
                  style={{
                    width: "100%",
                    justifyContent:
                      "flex-start",
                    marginBottom: 8,
                  }}
                >
                  Settings
                </button>

                <button
                  className="s9-btn s9-btn-danger"
                  style={{
                    width: "100%",
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}