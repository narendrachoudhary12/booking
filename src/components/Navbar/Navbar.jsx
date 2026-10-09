import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiChevronDown,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiUser,
  FiX,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import logo from "../../assets/logo.png";
import {
  clearSession,
  dashboardPath,
  getToken,
  getUserImage,
  getUserName,
  SESSION_EVENT,
} from "../../utils/auth";
import "./Navbar.css";

const Navbar = () => {
  const [accountOpen, setAccountOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const accountRef = useRef(null);

  // Redraw when the saved name / photo changes (e.g. after a profile update)
  const [, setSessionVersion] = useState(0);

  useEffect(() => {
    const refresh = () => setSessionVersion((v) => v + 1);
    window.addEventListener(SESSION_EVENT, refresh);
    return () => window.removeEventListener(SESSION_EVENT, refresh);
  }, []);

  // Close the account menu on a click outside it or on Escape
  useEffect(() => {
    if (!accountOpen) return;

    const onPointerDown = (e) => {
      if (!accountRef.current?.contains(e.target)) setAccountOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setAccountOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [accountOpen]);

  const token = getToken();
  const userName = getUserName();
  const userImage = getUserImage();

  // Admins and hotel partners also get a link to their own panel
  const panelPath = dashboardPath();
  const panelLabel =
    panelPath === "/admin-dashboard"
      ? "Admin Panel"
      : panelPath === "/host"
      ? "Host Panel"
      : null;

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

  const closeAccount = () => setAccountOpen(false);

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
          <li className="dropdown account-dropdown" ref={accountRef}>

            {token ? (
              <>
                {/* LOGGED IN: name opens the menu */}
                <button
                  className="nav-link account-btn"
                  onClick={toggleAccount}
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                >
                  {userImage ? (
                    <img src={userImage} alt="" className="account-avatar" />
                  ) : (
                    <span className="account-avatar">
                      {(userName || "A").trim().charAt(0).toUpperCase()}
                    </span>
                  )}

                  <span className="account-name">{userName || "Account"}</span>

                  <FiChevronDown
                    className={`account-chevron${accountOpen ? " is-open" : ""}`}
                  />
                </button>

                <ul
                  className={`dropdown-menu account-menu account-menu--user ${
                    accountOpen ? "active" : ""
                  }`}
                >
                  <li className="account-menu-head">
                    Signed in as
                    <strong>{userName || "Account"}</strong>
                  </li>

                  {panelLabel && (
                    <li>
                      <Link
                        to={panelPath}
                        className="account-menu-item"
                        onClick={closeAccount}
                      >
                        <FiGrid /> {panelLabel}
                      </Link>
                    </li>
                  )}

                  <li>
                    <Link
                      to="/user"
                      className="account-menu-item"
                      onClick={closeAccount}
                    >
                      <FiUser /> My Account
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/user?tab=bookings"
                      className="account-menu-item"
                      onClick={closeAccount}
                    >
                      <FiCalendar /> My Bookings
                    </Link>
                  </li>

                  <li className="account-menu-sep">
                    <button
                      className="account-menu-item account-menu-item--logout"
                      onClick={handleLogout}
                    >
                      <FiLogOut /> Logout
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

                  <p>
                    Hotel owner?{" "}
                    <Link to="/partner/login">Partner Sign In</Link>
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