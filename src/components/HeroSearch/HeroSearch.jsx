import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiCalendar, FiMapPin, FiSearch, FiStar, FiUsers, FiChevronLeft, FiChevronRight, FiX, FiHome, FiArrowLeft } from "react-icons/fi";
import "./HeroSearch.css";
import axios from "axios";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}
function isSameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function formatDate(d) {
  if (!d) return "";
  return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;
}
function formatForAPI(d) {
  if (!d) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function getDefaultToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
function getDefaultCheckout() {
  const d = getDefaultToday();
  d.setDate(d.getDate() + 2);
  return d;
}
function getNights(ci, co) {
  if (!ci || !co) return 0;
  return Math.round((co - ci) / (1000 * 60 * 60 * 24));
}

function StarRating({ rating }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <FiStar
          key={i}
          size={13}
          style={{
            fill: i <= Math.round(rating) ? "#f59e0b" : "none",
            color: i <= Math.round(rating) ? "#f59e0b" : "#d1d5db",
          }}
        />
      ))}
      <span style={{ fontSize: "0.78rem", color: "#D4AF37", marginLeft: 2 }}>{rating}</span>
    </div>
  );
}

function CalendarMonth({ year, month, checkIn, checkOut, hovered, onDayClick, onDayHover }) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const today = getDefaultToday();

  return (
    <div style={{ flex: 1, minWidth: 200 }}>
      <div style={{ fontWeight: 700, fontSize: "0.95rem", textAlign: "center", marginBottom: 10, color: "#1a1a2e" }}>
        {MONTHS[month]} {year}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 4 }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: "0.73rem", fontWeight: 600, color: "#9ca3af", padding: "3px 0" }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 1 }}>
        {cells.map((date, i) => {
          if (!date) return <div key={i} />;
          const isPast = date < today;
          const isStart = isSameDay(date, checkIn);
          const isEnd = isSameDay(date, checkOut);
          const rangeEnd = checkOut || hovered;
          const inRange = checkIn && rangeEnd && date > checkIn && date < rangeEnd;

          let bg = "transparent", color = "#1a1a2e", borderRadius = "7px", cursor = "pointer";
          if (isPast) { color = "#d1d5db"; cursor = "default"; }
          else if (isStart) { bg = "#1a6fad"; color = "#fff"; borderRadius = "7px 0 0 7px"; }
          else if (isEnd) { bg = "#1a6fad"; color = "#fff"; borderRadius = "0 7px 7px 0"; }
          else if (inRange) { bg = "#dbeafe"; color = "#1a6fad"; borderRadius = "0"; }

          return (
            <div
              key={i}
              onClick={() => !isPast && onDayClick(date)}
              onMouseEnter={e => {
                if (!isPast) {
                  onDayHover(date);
                  if (!isStart && !isEnd && !inRange) e.currentTarget.style.background = "#e8f3fb";
                }
              }}
              onMouseLeave={e => {
                if (!isPast && !isStart && !isEnd) e.currentTarget.style.background = inRange ? "#dbeafe" : "transparent";
              }}
              style={{
                aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.82rem", fontWeight: 500, borderRadius, cursor, background: bg, color,
                userSelect: "none", transition: "background 0.1s",
              }}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HotelCard({ hotel, checkIn, checkOut }) {
  const nights = getNights(checkIn, checkOut);
  const lowestRoom = hotel.rooms && hotel.rooms.length > 0
    ? hotel.rooms.reduce((min, r) => {
        const price = parseFloat(r.discount_price || r.price_per_night);
        return price < min ? price : min;
      }, Infinity)
    : parseFloat(hotel.price_start_from);

  const totalPrice = nights > 0 ? lowestRoom * nights : lowestRoom;

  return (
    <div style={{
      background: "#fff",
      borderRadius: 14,
      overflow: "hidden",
      border: "1.5px solid #e5e9ef",
      boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
      transition: "transform 0.18s, box-shadow 0.18s",
      cursor: "pointer",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 8px 28px rgba(26,111,173,0.15)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(26,111,173,0.07)";
      }}
    >
      <div style={{ position: "relative", height: 190, overflow: "hidden", background: "#f3f4f6" }}>
        <img
          src={hotel.image}
          alt={hotel.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={e => { e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"; }}
        />
        <div style={{
          position: "absolute", top: 10, right: 10,
          background: "#1a6b40", color: "#fff",
          borderRadius: 8, padding: "4px 10px",
          fontSize: "0.78rem", fontWeight: 700,
        }}>
          ₦{lowestRoom.toLocaleString()}/night
        </div>
        <div style={{
          position: "absolute", top: 10, left: 10,
          background: "rgba(255,255,255,0.92)",
          borderRadius: 8, padding: "4px 10px",
          fontSize: "0.75rem", fontWeight: 600, color: "#1a6b40",
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <FiMapPin size={11} />
          {hotel.city?.name?.trim()}
        </div>
      </div>

      <div style={{ padding: "14px 16px" }}>
        <h3 style={{ margin: "0 0 5px", fontSize: "1rem", fontWeight: 700, color: "#D4AF37", lineHeight: 1.3 }}>
          {hotel.name}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
          <FiMapPin size={12} color="#D4AF37" />
          <span style={{ fontSize: "0.78rem", color: "#D4AF37" }}>{hotel.address}</span>
        </div>

        <StarRating rating={hotel.rating} />

        <p style={{ margin: "8px 0 10px", fontSize: "0.82rem", color: "#D4AF37", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {hotel.description}
        </p>

        {hotel.rooms && hotel.rooms.length > 0 && (
          <div style={{ marginBottom: 10 }}>
            {hotel.rooms.slice(0, 2).map(room => (
              <div key={room.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: "rgba(212,175,55,0.08)", borderRadius: 7, padding: "6px 10px", marginBottom: 4,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <FiUsers size={12} color="#D4AF37" />
                  <span style={{ fontSize: "0.77rem", color: "#D4AF37", fontWeight: 500 }}>{room.room_type}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  {room.discount_price && (
                    <span style={{ fontSize: "0.72rem", color: "#8a7a4f", textDecoration: "line-through", marginRight: 5 }}>
                      ₦{parseFloat(room.price_per_night).toLocaleString()}
                    </span>
                  )}
                  <span style={{ fontSize: "0.82rem", color: "#D4AF37", fontWeight: 700 }}>
                    ₦{parseFloat(room.discount_price || room.price_per_night).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(212,175,55,0.2)", paddingTop: 10 }}>
          <div>
            {nights > 0 && (
              <div style={{ fontSize: "0.75rem", color: "#D4AF37" }}>
                {nights} night{nights > 1 ? "s" : ""} total
              </div>
            )}
            <div style={{ fontSize: "1rem", fontWeight: 800, color: "#D4AF37" }}>
              ₦{totalPrice.toLocaleString()}
            </div>
          </div>
          <Link
            to={`/hotel-details/${hotel.slug}`}
            className="book-now-btn"
            style={{
              background: "#1a6b40", color: "#fff", textDecoration: "none",
              borderRadius: 9, padding: "9px 18px",
              fontSize: "0.82rem", fontWeight: 700, cursor: "pointer",
              display: "inline-block",
            }}
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}

// 🆕 AUTOCOMPLETE: small presentational dropdown for the suggestion list
function SuggestionsDropdown({ suggestions, loading, activeIndex, onPick, onHover }) {
  if (!loading && suggestions.length === 0) return null;

  return (
    <div style={{
      position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 9999,
      background: "#fff", borderRadius: 12, overflow: "hidden",
      boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
      border: "1.5px solid #e5e9ef",
      maxHeight: 280, overflowY: "auto",
    }}>
      {loading && (
        <div style={{ padding: "12px 14px", fontSize: "0.82rem", color: "#9ca3af" }}>
          Searching...
        </div>
      )}
      {!loading && suggestions.map((s, i) => (
        <div
          key={`${s.type}-${s.value}-${i}`}
          onMouseDown={e => { e.preventDefault(); onPick(s); }}
          onMouseEnter={() => onHover(i)}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 14px", cursor: "pointer",
            background: activeIndex === i ? "#f7f9fc" : "#fff",
            borderBottom: "1px solid #f0f2f5",
          }}
        >
          <div style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            background: s.type === "city" ? "#e8f3fb" : "rgba(212,175,55,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {s.type === "city"
              ? <FiMapPin size={13} color="#1a6fad" />
              : <FiHome size={13} color="#D4AF37" />}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "0.86rem", fontWeight: 600, color: "#1a1a2e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {s.label}
            </div>
            <div style={{ fontSize: "0.72rem", color: "#9ca3af" }}>
              {s.type === "city" ? "City" : s.subLabel || "Hotel"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const HeroSearch = () => {
  const [totalHotels, setTotalHotels] = useState(0);

  const [showCal, setShowCal] = useState(false);
  const [checkIn, setCheckIn] = useState(() => getDefaultToday());
  const [checkOut, setCheckOut] = useState(() => getDefaultCheckout());
  const [hovered, setHovered] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [leftYear, setLeftYear] = useState(() => new Date().getFullYear());
  const [leftMonth, setLeftMonth] = useState(() => new Date().getMonth());

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  // 🆕 AUTOCOMPLETE: state
  const [citiesList, setCitiesList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);
  const searchWrapRef = useRef(null);

  const wrapRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate(); // 🆕 BACK BUTTON

  // 🆕 BACK BUTTON: only show when NOT on the home page
  const isHomePage = location.pathname === "/";

  const rightMonth = leftMonth === 11 ? 0 : leftMonth + 1;
  const rightYear = leftMonth === 11 ? leftYear + 1 : leftYear;

  useEffect(() => {
    axios.get("https://dhunobeats.com/api/cities")
      .then((res) => {
        const cities = res.data.data || [];
        setCitiesList(cities); // 🆕 AUTOCOMPLETE: keep the full list for local filtering
        const total = cities.reduce((acc, item) => acc + (item.hotels_count || 0), 0);
        setTotalHotels(total);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const handler = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setShowCal(false);
      // 🆕 AUTOCOMPLETE: close suggestions on outside click
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setSearched(false);
    setHotels([]);
    setError(null);
    setSearchQuery("");
  }, [location.key]);

  useEffect(() => {
    const resetSearch = () => {
      setSearched(false);
      setHotels([]);
      setError(null);
      setSearchQuery("");
    };
    window.addEventListener("reset-hero-search", resetSearch);
    return () => window.removeEventListener("reset-hero-search", resetSearch);
  }, []);

  function handleDayClick(date) {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date); setCheckOut(null); setHovered(null);
    } else {
      if (date <= checkIn) { setCheckIn(date); setCheckOut(null); }
      else { setCheckOut(date); setShowCal(false); }
    }
  }

  function prevMonth() {
    if (leftMonth === 0) { setLeftMonth(11); setLeftYear(y => y - 1); }
    else setLeftMonth(m => m - 1);
  }
  function nextMonth() {
    if (leftMonth === 11) { setLeftMonth(0); setLeftYear(y => y + 1); }
    else setLeftMonth(m => m + 1);
  }

  const dateValue = checkIn
    ? checkOut
      ? `${formatDate(checkIn)}  →  ${formatDate(checkOut)}`
      : `${formatDate(checkIn)}  →  Select checkout`
    : "";

  async function performSearch({ hotelName, cityName, ci, co } = {}) {
    setLoading(true);
    setError(null);
    setSearched(true);

    const params = new URLSearchParams();
    if (cityName) {
      params.append("city", cityName);
    } else if (hotelName) {
      params.append("hotel_name", hotelName);
    }
    if (ci) params.append("check_in", formatForAPI(ci));
    if (co) params.append("check_out", formatForAPI(co));

    try {
      const res = await fetch(`https://dhunobeats.com/api/hotels/search?${params}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      setHotels(json.data || []);
    } catch (err) {
      setError("Unable to fetch hotels. Please try again.");
      setHotels([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    setShowSuggestions(false); // 🆕 AUTOCOMPLETE
    performSearch({ hotelName: searchQuery, ci: checkIn, co: checkOut });
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const city = urlParams.get("city");
    if (city) {
      setSearchQuery(city);
      performSearch({ cityName: city, ci: checkIn, co: checkOut });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // 🆕 AUTOCOMPLETE: debounced fetch of suggestions whenever the query changes
  useEffect(() => {
    const query = searchQuery.trim();

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setSuggestLoading(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const myRequestId = ++requestIdRef.current;
      setSuggestLoading(true);

      // Local, instant matches from the cities we already have
      const lowerQuery = query.toLowerCase();
      const cityMatches = citiesList
        .filter(c => c.name?.toLowerCase().includes(lowerQuery))
        .slice(0, 4)
        .map(c => ({
          type: "city",
          label: c.name?.trim(),
          value: c.name?.trim(),
          subLabel: c.hotels_count ? `${c.hotels_count} hotel${c.hotels_count > 1 ? "s" : ""}` : undefined,
        }));

      try {
        const res = await fetch(`https://dhunobeats.com/api/hotels/search?hotel_name=${encodeURIComponent(query)}`);
        const json = res.ok ? await res.json() : { data: [] };

        // Ignore stale responses if the user kept typing
        if (myRequestId !== requestIdRef.current) return;

        const hotelMatches = (json.data || [])
          .slice(0, 5)
          .map(h => ({
            type: "hotel",
            label: h.name,
            value: h.name,
            subLabel: h.city?.name?.trim(),
          }));

        // Dedupe by label, cities first
        const combined = [...cityMatches, ...hotelMatches];
        const seen = new Set();
        const deduped = combined.filter(s => {
          const key = `${s.type}:${s.value.toLowerCase()}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        setSuggestions(deduped);
        setShowSuggestions(deduped.length > 0);
        setActiveSuggestion(-1);
      } catch (err) {
        if (myRequestId !== requestIdRef.current) return;
        // Fall back to just the local city matches if the API call fails
        setSuggestions(cityMatches);
        setShowSuggestions(cityMatches.length > 0);
      } finally {
        if (myRequestId === requestIdRef.current) setSuggestLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, citiesList]);

  // 🆕 AUTOCOMPLETE: pick a suggestion -> fill the box and search immediately
  function pickSuggestion(s) {
    setSearchQuery(s.value);
    setShowSuggestions(false);
    setSuggestions([]);
    setActiveSuggestion(-1);
    if (s.type === "city") {
      performSearch({ cityName: s.value, ci: checkIn, co: checkOut });
    } else {
      performSearch({ hotelName: s.value, ci: checkIn, co: checkOut });
    }
  }

  // 🆕 AUTOCOMPLETE: keyboard navigation (↑ ↓ Enter Esc)
  function handleQueryKeyDown(e) {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestion(i => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestion(i => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && activeSuggestion >= 0) {
      e.preventDefault();
      pickSuggestion(suggestions[activeSuggestion]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  }

  return (
    <div className="hero-wrapper">
      <div className="hero">
        <div className="hero-overlay" style={{ position: "relative" }}>
          {/* 🆕 BACK BUTTON — hidden on home page, always navigates to previous page */}
          {!isHomePage && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              style={{
                position: "absolute",
                left: 24,
                top: 130,
                background: "rgba(212,175,55,0.12)",
                border: "1.5px solid #D4AF37",
                borderRadius: "50%",
                width: 42,
                height: 42,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10,
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(212,175,55,0.25)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(212,175,55,0.12)")}
            >
              <FiArrowLeft size={20} color="#D4AF37" />
            </button>
          )}

          <div className="hero-content">
            <h1>Find and book luxury hotels in Nigeria.</h1>
          </div>
        </div>

        <div
          className="search-container"
          style={{
            background: "linear-gradient(90deg, #15291C 0%, #1A1B18 45%, #2A2119 100%)",
          }}
        >
          <form className="search-form" onSubmit={handleSearch}>
            {/* City / Hotel input */}
            <div ref={searchWrapRef} style={{ position: "relative", flex: 1 }}>
              <FiSearch style={{
                position: "absolute", left: 10, top: "50%",
                transform: "translateY(-50%)", color: "#D4AF37",
                fontSize: 17, pointerEvents: "none",
              }} />
              <input
                type="text"
                placeholder="Search for a city or particular hotel"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleQueryKeyDown}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                autoComplete="off"
                style={{ paddingLeft: 35, width: "100%", color: "#D4AF37" }}
              />

              {showSuggestions && (
                <SuggestionsDropdown
                  suggestions={suggestions}
                  loading={suggestLoading}
                  activeIndex={activeSuggestion}
                  onPick={pickSuggestion}
                  onHover={setActiveSuggestion}
                />
              )}
            </div>

            {/* Date picker */}
            <div ref={wrapRef} style={{ position: "relative", flex: 1, minWidth: 260 }}>
              <FiCalendar style={{
                position: "absolute", left: 10, top: "50%",
                transform: "translateY(-50%)", color: "#D4AF37",
                fontSize: 17, pointerEvents: "none",
              }} />
              <input
                type="text"
                placeholder="Check In - Check Out"
                readOnly
                value={dateValue}
                onClick={() => setShowCal(v => !v)}
                style={{
                  cursor: "pointer",
                  width: "100%",
                  paddingLeft: 35,
                  paddingRight: 10,
                  color: "#D4AF37",
                  fontSize: "0.85rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              />

              {showCal && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 9999,
                  background: "#fff", borderRadius: 14, padding: 20,
                  boxShadow: "0 8px 40px rgba(26,111,173,0.18)",
                  border: "1.5px solid #e5e9ef", minWidth: 340,
                  fontFamily: "inherit",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                    <span style={{ fontSize: "0.82rem", color: "#6b7280" }}>
                      {!checkIn ? "Select check-in date" : !checkOut ? "Now select check-out date" : `${formatDate(checkIn)} → ${formatDate(checkOut)}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => { setCheckIn(getDefaultToday()); setCheckOut(getDefaultCheckout()); setHovered(null); }}
                      style={{ background: "none", border: "1.5px solid #e5e9ef", borderRadius: 6, padding: "4px 11px", fontSize: "0.78rem", color: "#6b7280", cursor: "pointer" }}
                    >
                      Reset
                    </button>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <button type="button" onClick={prevMonth} style={{ background: "#f7f9fc", border: "1.5px solid #e5e9ef", borderRadius: 7, width: 30, height: 30, cursor: "pointer", fontSize: "1rem", color: "#1a6fad", fontWeight: 700, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <FiChevronLeft size={16} />
                    </button>

                    <div style={{ display: "flex", gap: 20, flex: 1, flexWrap: "wrap" }}>
                      <CalendarMonth year={leftYear} month={leftMonth} checkIn={checkIn} checkOut={checkOut} hovered={hovered} onDayClick={handleDayClick} onDayHover={setHovered} />
                      <CalendarMonth year={rightYear} month={rightMonth} checkIn={checkIn} checkOut={checkOut} hovered={hovered} onDayClick={handleDayClick} onDayHover={setHovered} />
                    </div>

                    <button type="button" onClick={nextMonth} style={{ background: "#f7f9fc", border: "1.5px solid #e5e9ef", borderRadius: 7, width: 30, height: 30, cursor: "pointer", fontSize: "1rem", color: "#1a6fad", fontWeight: 700, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <FiChevronRight size={16} />
                    </button>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
                    <button
                      type="button"
                      onClick={() => { if (checkIn && checkOut) setShowCal(false); }}
                      style={{
                        background: "#D4AF37", color: "#fff", border: "none", borderRadius: 8,
                        padding: "9px 22px", fontSize: "0.88rem", fontWeight: 700,
                        cursor: checkIn && checkOut ? "pointer" : "default",
                        opacity: checkIn && checkOut ? 1 : 0.5, fontFamily: "inherit",
                      }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? "Searching..." : "Find Hotel"}
            </button>
          </form>
        </div>
      </div>

      {searched && (
        <div style={{
          width: "100%",
          background: "linear-gradient(90deg, #15291C 0%, #1A1B18 45%, #2A2119 100%)",
        }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "40px 20px",
        }}>
          {!loading && !error && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, color: "#D4AF37" }}>
                  {hotels.length > 0 ? `${hotels.length} Hotel${hotels.length > 1 ? "s" : ""} Found` : "No Hotels Found"}
                </h2>
                {checkIn && checkOut && (
                  <p style={{ margin: "4px 0 0", color: "#D4AF37", fontSize: "0.87rem" }}>
                    {formatDate(checkIn)} → {formatDate(checkOut)} · {getNights(checkIn, checkOut)} night{getNights(checkIn, checkOut) > 1 ? "s" : ""}
                    {searchQuery && ` · "${searchQuery}"`}
                  </p>
                )}
              </div>
            </div>
          )}

          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 22 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ borderRadius: 14, overflow: "hidden", border: "1.5px solid #e5e9ef" }}>
                  <div style={{ height: 190, background: "linear-gradient(90deg, #f0f4f8 25%, #e8eef4 50%, #f0f4f8 75%)", backgroundSize: "400% 100%", animation: "shimmer 1.4s infinite" }} />
                  <div style={{ padding: 16 }}>
                    {[80, 60, 100].map((w, j) => (
                      <div key={j} style={{ height: 14, background: "#D4AF37", borderRadius: 7, marginBottom: 10, width: `${w}%` }} />
                    ))}
                  </div>
                </div>
              ))}
              <style>{`@keyframes shimmer { 0%{background-position:100% 0} 100%{background-position:-100% 0} }`}</style>
            </div>
          )}

          {error && (
            <div style={{ textAlign: "center", padding: "50px 20px", color: "#ef4444" }}>
              <FiX size={40} style={{ marginBottom: 12 }} />
              <p style={{ fontSize: "1rem", fontWeight: 600 }}>{error}</p>
            </div>
          )}

          {!loading && !error && hotels.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#D4AF37" }}>
              <FiSearch size={44} style={{ marginBottom: 14, opacity: 0.3 }} />
              <p style={{ fontSize: "1.05rem", fontWeight: 600, color: "#D4AF37" }}>No hotels found</p>
              <p style={{ fontSize: "0.88rem" }}>Try a different city or adjust your dates</p>
            </div>
          )}

          {!loading && !error && hotels.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 22 }}>
              {hotels.map(hotel => (
                <HotelCard key={hotel.id} hotel={hotel} checkIn={checkIn} checkOut={checkOut} />
              ))}
            </div>
          )}
        </div>
        </div>
      )}
    </div>
  );
};

export default HeroSearch;