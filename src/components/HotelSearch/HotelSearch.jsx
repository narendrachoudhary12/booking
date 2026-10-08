import React, { useEffect, useRef, useState } from "react";
import "./HotelSearch.css";

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
function CalendarMonth({ year, month, checkIn, checkOut, hovered, onDayClick, onDayHover }) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const today = new Date(); today.setHours(0, 0, 0, 0);

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
              onMouseEnter={(e) => {
                if (!isPast) {
                  onDayHover(date);
                  if (!isStart && !isEnd && !inRange) e.currentTarget.style.background = "#e8f3fb";
                }
              }}
              onMouseLeave={(e) => {
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
const HotelSearch = () => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const [showCal, setShowCal] = useState(false);
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const [hovered, setHovered] = useState(null);
    const [leftYear, setLeftYear] = useState(today.getFullYear());
    const [leftMonth, setLeftMonth] = useState(today.getMonth());
    const wrapRef = useRef(null);
  
    const rightMonth = leftMonth === 11 ? 0 : leftMonth + 1;
    const rightYear = leftMonth === 11 ? leftYear + 1 : leftYear;
  
    useEffect(() => {
      const handler = (e) => {
        if (wrapRef.current && !wrapRef.current.contains(e.target)) setShowCal(false);
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
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
  return (
    <div className="search-container">
      <div className="search-inner">
        <form className="search-form">
          
          {/* Search Input */}
          <div className="search-field">
            {/* <span className="icon">🔍</span> */}
            <input
              type="text"
              name="query"
              placeholder="Search for a city or particular hotel"
              required
            />
          </div>

          {/* Date Input */}
        <div ref={wrapRef} style={{ position: "relative", flex: 1 }}>
            <input
              type="text"
              placeholder="Check In - Check Out"
              readOnly
              value={dateValue}
              onClick={() => setShowCal(v => !v)}
              style={{ cursor: "pointer", width: "100%" }}
            />

            {showCal && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 9999,
                background: "#fff", borderRadius: 14, padding: 20,
                boxShadow: "0 8px 40px rgba(26,111,173,0.18)",
                border: "1.5px solid #e5e9ef", minWidth: 320,
                fontFamily: "inherit",
              }}>
                {/* hint + clear row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                  <span style={{ fontSize: "0.82rem", color: "#6b7280" }}>
                    {!checkIn
                      ? "Select check-in date"
                      : !checkOut
                      ? "Now select check-out date"
                      : `${formatDate(checkIn)} → ${formatDate(checkOut)}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => { setCheckIn(null); setCheckOut(null); setHovered(null); }}
                    style={{ background: "none", border: "1.5px solid #e5e9ef", borderRadius: 6, padding: "4px 11px", fontSize: "0.78rem", color: "#6b7280", cursor: "pointer" }}
                  >
                    Clear
                  </button>
                </div>

                {/* prev / months / next */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <button
                    type="button"
                    onClick={prevMonth}
                    style={{ background: "#f7f9fc", border: "1.5px solid #e5e9ef", borderRadius: 7, width: 30, height: 30, cursor: "pointer", fontSize: "1rem", color: "#1a6fad", fontWeight: 700, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                  >‹</button>

                  <div style={{ display: "flex", gap: 20, flex: 1, flexWrap: "wrap" }}>
                    <CalendarMonth
                      year={leftYear} month={leftMonth}
                      checkIn={checkIn} checkOut={checkOut} hovered={hovered}
                      onDayClick={handleDayClick} onDayHover={setHovered}
                    />
                    <CalendarMonth
                      year={rightYear} month={rightMonth}
                      checkIn={checkIn} checkOut={checkOut} hovered={hovered}
                      onDayClick={handleDayClick} onDayHover={setHovered}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={nextMonth}
                    style={{ background: "#f7f9fc", border: "1.5px solid #e5e9ef", borderRadius: 7, width: 30, height: 30, cursor: "pointer", fontSize: "1rem", color: "#1a6fad", fontWeight: 700, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                  >›</button>
                </div>

                {/* Done button */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
                  <button
                    type="button"
                    onClick={() => { if (checkIn && checkOut) setShowCal(false); }}
                    style={{
                      background: "#1a6fad", color: "#fff", border: "none", borderRadius: 8,
                      padding: "9px 22px", fontSize: "0.88rem", fontWeight: 700,
                      cursor: checkIn && checkOut ? "pointer" : "default",
                      opacity: checkIn && checkOut ? 1 : 0.5, fontFamily: "inherit"
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Button */}
          <button type="submit" className="search-btn">
            Find Hotels
          </button>

        </form>
      </div>
    </div>
  );
};

export default HotelSearch;