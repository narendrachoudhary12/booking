// pages/host/AvailabilityPage.jsx
import { useEffect, useRef } from "react";

const STATUSES = [
  "available","available","available","booked","booked","partial","available",
  "available","closed","closed","available","booked","available","available",
  "available","booked","booked","available","partial","partial","available",
  "available","available","booked","available","available","available",
  "available","partial","partial","available",
];

export default function AvailabilityPage() {
  const calRef = useRef(null);

  useEffect(() => {
    if (!calRef.current) return;
    calRef.current.innerHTML = "";
    const startOffset = 1; // July 2024 starts on Monday

    for (let i = 0; i < startOffset; i++) {
      const blank = document.createElement("div");
      blank.className = "hd-cal-day hd-cal-prev-month";
      blank.innerHTML = `<div class="hd-cal-day-num">${30 - startOffset + 1 + i}</div>`;
      calRef.current.appendChild(blank);
    }

    for (let d = 1; d <= 31; d++) {
      const status = STATUSES[d - 1] || "available";
      const avail  = status === "available" ? Math.floor(Math.random() * 5) + 1 : status === "partial" ? 1 : 0;
      const isToday = d === 15;
      const div = document.createElement("div");
      div.className = `hd-cal-day hd-cal-${status}${isToday ? " hd-cal-today" : ""}`;
      div.title = `July ${d}: ${status} (${avail} rooms)`;
      div.innerHTML = `<div class="hd-cal-day-num">${d}</div>${
        status !== "closed"
          ? `<div class="hd-cal-day-avail">${avail > 0 ? avail + " rm" : "full"}</div>`
          : `<div class="hd-cal-day-avail">closed</div>`
      }`;
      calRef.current.appendChild(div);
    }
  }, []);

  return (
    <div>
      <div className="hd-tabs">
        <div className="hd-tab active">Calendar View</div>
        <div className="hd-tab">Bulk Update</div>
        <div className="hd-tab">Restrictions</div>
      </div>

      <div className="hd-two-col">
        {/* Calendar */}
        <div className="hd-card">
          <div className="hd-card-header">
            <div className="hd-card-title">📅 July 2024 — Deluxe Double</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="hd-btn hd-btn-outline hd-btn-sm">◀ Prev</button>
              <button className="hd-btn hd-btn-outline hd-btn-sm">Next ▶</button>
            </div>
          </div>
          <div className="hd-card-body">
            <div className="hd-cal-grid" style={{ marginBottom: 8 }}>
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                <div key={d} className="hd-cal-day-label">{d}</div>
              ))}
            </div>
            <div className="hd-cal-grid" ref={calRef} />
            <div style={{ display: "flex", gap: 16, marginTop: 14, fontSize: 11, flexWrap: "wrap" }}>
              {[
                { color: "var(--hd-green-lt)", label: "Available" },
                { color: "#fdecea",            label: "Booked"    },
                { color: "var(--hd-gold-lt)",  label: "Partial"   },
                { color: "var(--hd-border)",   label: "Closed"    },
              ].map(({ color, label }) => (
                <span key={label}>
                  <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: color, marginRight: 4 }} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Block */}
        <div className="hd-card">
          <div className="hd-card-header"><div className="hd-card-title">Quick Availability Update</div></div>
          <div className="hd-card-body">
            <div className="hd-form-group" style={{ marginBottom: 12 }}>
              <label>Room Type</label>
              <select>
                <option>Deluxe Double</option><option>Standard Room</option>
                <option>Executive Suite</option><option>Presidential Suite</option>
              </select>
            </div>
            <div className="hd-form-row">
              <div className="hd-form-group">
                <label>From Date</label>
                <input type="date" defaultValue="2024-07-20" />
              </div>
              <div className="hd-form-group">
                <label>To Date</label>
                <input type="date" defaultValue="2024-07-25" />
              </div>
            </div>
            <div className="hd-form-group" style={{ marginBottom: 12 }}>
              <label>Rooms Available</label>
              <input type="number" defaultValue={3} min={0} max={10} />
            </div>
            <div className="hd-form-group" style={{ marginBottom: 12 }}>
              <label>Action</label>
              <select>
                <option>Set Available</option>
                <option>Close / Block</option>
                <option>Mark Booked</option>
              </select>
            </div>
            <button className="hd-btn hd-btn-primary" style={{ width: "100%" }}>Update Availability</button>
            <div style={{ marginTop: 10, fontSize: 12, color: "var(--hd-muted)", textAlign: "center" }}>
              Changes sync to Stay9ja in real time
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
