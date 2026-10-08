// components/host/Topbar.jsx

import { useEffect, useRef, useState } from "react";
import axios from "axios";

const PAGE_TITLES = {
  dashboard: "Dashboard Overview",
  bookings: "Bookings",
  availability: "Availability Calendar",
  rates: "Rates & Pricing",
  rooms: "Room Types",
  listing: "Listing Details",
  photos: "Photos & Media",
  channel: "Channel Manager",
  analytics: "Analytics",
  settings: "Settings",
};

export default function Topbar({ activePage, onOpenModal }) {
  const [adminName, setAdminName] = useState("Admin");
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const res = await axios.get(
        "https://dhunobeats.com/api/admin/usersProfile"
      );

      // API response ke according field change kar lena
      const user = res?.data?.user || res?.data?.data;

      if (user?.name) {
        setAdminName(user.name);
      }
    } catch (error) {
      console.log("Profile fetch error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");

    // login page route change kar sakte ho
    window.location.href = "/login";
  };

  // outside click close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="hd-topbar">
      <div className="hd-topbar-title">
        {PAGE_TITLES[activePage] || activePage}
      </div>

      <div className="hd-topbar-actions">
        <div className="hd-sync-pulse">
          <div className="hd-sync-dot" />
          Live sync active
        </div>

        <button
          className="hd-btn hd-btn-outline hd-btn-sm"
          onClick={onOpenModal}
        >
          + Update Rates
        </button>

        <button className="hd-btn hd-btn-primary hd-btn-sm">
          New Booking Block
        </button>

        {/* Admin Profile */}
        <div
          className="hd-profile-wrapper"
          ref={popupRef}
          style={{ position: "relative" }}
        >
          <div
            className="hd-avatar"
            onClick={() => setShowPopup(!showPopup)}
            style={{ cursor: "pointer" }}
          >
            {adminName}
          </div>

          {showPopup && (
            <div
              className="hd-profile-popup"
              style={{
                position: "absolute",
                top: "45px",
                right: 0,
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "10px",
                minWidth: "180px",
                boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
                zIndex: 999,
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  marginBottom: "10px",
                }}
              >
                {adminName}
              </div>

              <button
                onClick={handleLogout}
                className="hd-btn hd-btn-primary hd-btn-sm"
                style={{ width: "100%" }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}