import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import logo from "../../assets/logo.png";
import {
  clearSession,
  dashboardPath,
  getToken,
  getUserName,
} from "../../utils/auth";
import "./Navbar.css";

const Navbar = () => {
  const [accountOpen, setAccountOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const token = getToken();
  const userName = getUserName();

  const toggleAccount = (e) => {
    e.preventDefault();
    setAccountOpen((prev) => !prev);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    clearSession();

    setAccountOpen(false);
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate(dashboardPath());

    setAccountOpen(false);
  };

  return (
    <nav className="hng-navbar">
      <div className="navbar-container">

        {/* LOGO */}
        <Link to="/" className="logo">
          <img src={logo} alt="logo" className="logoImg" />
        </Link>

        {/* MOBILE MENU ICON */}
        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </div>

        {/* NAV LINKS */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>

          {/* WHATSAPP */}
          <li className="dropdown">
            <a
              href="https://wa.me/447956531295"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link call-link"
            >
              <FaWhatsapp
                style={{
                  marginRight: "6px",
                  color: "#25D366",
                  fontSize: "18px",
                }}
              />
              +44 7956531295
            </a>

            <ul className="dropdown-menu">
              <li>
                <a
                  href="https://wa.me/447405946151"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +44 7405946151
                </a>
              </li>

              <li>
                <a
                  href="https://wa.me/2348103505088"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +234 8103505088
                </a>
              </li>
            </ul>
          </li>

          {/* CURRENCY */}
          <li className="dropdown">
            <span className="nav-link">
              <img
                src="https://flagcdn.com/w20/ng.png"
                alt="Nigeria"
                style={{
                  width: "28px",
                  marginRight: "6px",
                }}
              />
              ₦
            </span>

            <ul className="dropdown-menu">
              <li>
                <a href="#">₦ Nigerian Naira</a>
              </li>
              <li>
                <a href="#">€ European Euro</a>
              </li>
              <li>
                <a href="#">$ U.S. Dollar</a>
              </li>
              <li>
                <a href="#">£ British Pound</a>
              </li>
            </ul>
          </li>

          {/* ACCOUNT */}
          <li className="dropdown account-dropdown">

            {token ? (
              <>
                {/* LOGGED IN USER NAME */}
                <button
                  className="nav-link account-btn"
                  onClick={handleProfileClick}
                >
                  <FiUser style={{ marginRight: "8px" }} />

                  {userName || "Account"}

                  <FiChevronDown
                    style={{
                      marginLeft: "10px",
                      fontSize: "14px",
                    }}
                  />
                </button>

                {/* DROPDOWN */}
                <ul
                  className={`dropdown-menu account-menu ${
                    accountOpen ? "active" : ""
                  }`}
                >
                  <li>
                    <button
                      className="dropdown-profile-btn"
                      onClick={handleProfileClick}
                    >
                      {dashboardPath() === "/admin-dashboard"
                        ? "Admin Dashboard"
                        : dashboardPath() === "/host"
                        ? "Host Dashboard"
                        : "My Dashboard"}
                    </button>
                  </li>

                  {dashboardPath() !== "/user" && (
                    <li>
                      <Link
                        to="/user"
                        className="dropdown-profile-btn"
                        onClick={() => setAccountOpen(false)}
                      >
                        My Account
                      </Link>
                    </li>
                  )}

                  <li>
                    <button
                      className="btn"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </>
            ) : (
              <>
                {/* NOT LOGGED IN */}
                <button
                  className="nav-link account-btn"
                  onClick={toggleAccount}
                >
                  <FiUser style={{ marginRight: "10px" }} />
                  Account
                  <FiChevronDown
                    style={{
                      marginLeft: "10px",
                      fontSize: "14px",
                    }}
                  />
                </button>

                <ul
                  className={`dropdown-menu account-menu ${
                    accountOpen ? "active" : ""
                  }`}
                >
                  <p>You are not logged in</p>

                  <Link to="/login" className="btn">
                    Sign In
                  </Link>

                  <p>
                    New here? <Link to="/signup">Sign Up</Link>
                  </p>
                </ul>
              </>
            )}

          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;