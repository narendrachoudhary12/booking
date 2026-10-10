// components/host/Topbar.jsx

import { API_BASE } from "../../config/api";
import { authHeader, clearSession, getUserName } from "../../utils/auth";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const PAGE_TITLES = {
  dashboard: "Dashboard Overview",
  bookings: "Bookings",
  hotels: "My Hotels",
  availability: "Availability Calendar",
  rates: "Rates & Pricing",
  rooms: "Room Types",
  listing: "Listing Details",
  photos: "Photos & Media",
  channel: "Channel Manager",
  analytics: "Analytics",
  reviews: "Guest Reviews",
  payouts: "Earnings & Payouts",
  account: "My Account",
};

// hasHotel: the owner has a hotel selected, so the hotel shortcuts make sense
export default function Topbar({ activePage, onNavigate, profileVersion, hasHotel }) {
  const [adminName, setAdminName] = useState(getUserName() || "Account");
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    fetchAdminProfile();
  }, [profileVersion]);

  const fetchAdminProfile = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/my/profile`,
        { headers: { ...authHeader(), Accept: "application/json" } }
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
    clearSession();

    // login page route change kar sakte ho
    window.location.href = "/partner/login";
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
        {hasHotel && (
          <>
            <button
              className="hd-btn hd-btn-outline hd-btn-sm"
              onClick={() => onNavigate("rates")}
            >
              Update Rates
            </button>

            <button
              className="hd-btn hd-btn-primary hd-btn-sm"
              onClick={() => onNavigate("availability")}
            >
              Block Dates
            </button>
          </>
        )}

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
                onClick={() => {
                  setShowPopup(false);
                  onNavigate?.("account");
                }}
                className="hd-btn hd-btn-outline hd-btn-sm"
                style={{ width: "100%", marginBottom: 8 }}
              >
                My Account
              </button>

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