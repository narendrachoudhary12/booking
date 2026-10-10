// pages/host/AvailabilityPage.jsx
// Month calendar of one room type: rooms left per day, from real bookings.
// The owner can close dates or change how many rooms are on sale.

import { useEffect, useState } from "react";
import popup from "../../components/common/Popup/popupService";
import useLoad from "../../hooks/useLoad";
import {
  apiError,
  getHostCalendar,
  getHostRooms,
  updateHostCalendar,
} from "../../services/hostApi";
import Loadable from "./Loadable";
import { isoDate, money, monthLabel } from "./hostFormat";

const LEGEND = [
  { status: "available", label: "Available" },
  { status: "partial", label: "Partly booked" },
  { status: "booked", label: "Full" },
  { status: "closed", label: "Closed" },
];

const ACTIONS = [
  { id: "close", label: "Close (not bookable)" },
  { id: "open", label: "Open again" },
  { id: "rooms", label: "Set rooms on sale" },
  { id: "reset", label: "Back to normal" },
];

// "2026-10" moved by a number of months
const shiftMonth = (month, by) => {
  const [year, m] = month.split("-").map(Number);
  const date = new Date(year, m - 1 + by, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

export default function AvailabilityPage({ hotel, onNavigate }) {
  const today = isoDate();

  const { data: rooms, error: roomsError } = useLoad(() => getHostRooms(hotel.id), [hotel.id], apiError);

  const [roomId, setRoomId] = useState(null);
  const [month, setMonth] = useState(today.slice(0, 7));

  // Pick the first room once the rooms have loaded (or the hotel changed)
  useEffect(() => {
    setRoomId(rooms?.[0]?.id ?? null);
  }, [rooms]);

  const { data: calendar, error: calendarError, reload } = useLoad(
    () => (roomId ? getHostCalendar(hotel.id, roomId, month) : Promise.resolve(null)),
    [hotel.id, roomId, month],
    apiError
  );

  const [form, setForm] = useState({ from: today, to: today, action: "close", rooms: "0" });
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  // Clicking a day starts a new range; clicking a later day ends it
  const pickDay = (date) => {
    if (date < today) return;
    setForm(date > form.from && form.from === form.to ? { ...form, to: date } : { ...form, from: date, to: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const changes = { room_id: roomId, from: form.from, to: form.to };

    if (form.action === "close") changes.is_closed = true;
    if (form.action === "open") changes.is_closed = false;
    if (form.action === "rooms") changes.rooms_available = Number(form.rooms);
    if (form.action === "reset") changes.reset = true;

    try {
      const res = await updateHostCalendar(hotel.id, changes);
      await reload();
      popup.success(res.message);
    } catch (err) {
      popup.error(apiError(err));
    }

    setSaving(false);
  };

  if (rooms?.length === 0) {
    return (
      <div className="hd-card">
        <div className="hd-card-body" style={{ textAlign: "center", color: "var(--hd-muted)", fontSize: 14 }}>
          <p style={{ marginBottom: 12 }}>Add a room type first, then manage its availability here.</p>
          <button className="hd-btn hd-btn-primary" onClick={() => onNavigate("rooms")}>
            Go to Room Types
          </button>
        </div>
      </div>
    );
  }

  // Empty cells before the 1st so it lands under the right weekday
  const offset = new Date(`${month}-01T00:00:00`).getDay();

  return (
    <Loadable data={rooms} error={roomsError}>
      <div className="hd-two-col">
        {/* Calendar */}
        <div className="hd-card">
          <div className="hd-card-header">
            <div className="hd-card-title">
              {monthLabel(month)}
              {calendar ? ` — ${calendar.room.room_type}` : ""}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="hd-btn hd-btn-outline hd-btn-sm" onClick={() => setMonth(shiftMonth(month, -1))}>
                ◀ Prev
              </button>
              <button className="hd-btn hd-btn-outline hd-btn-sm" onClick={() => setMonth(shiftMonth(month, 1))}>
                Next ▶
              </button>
            </div>
          </div>

          <div className="hd-card-body">
            <div className="hd-form-group" style={{ marginBottom: 14, maxWidth: 320 }}>
              <label>Room type</label>
              <select value={roomId ?? ""} onChange={(e) => setRoomId(Number(e.target.value))}>
                {rooms?.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.room_type} ({room.total_rooms} rooms)
                  </option>
                ))}
              </select>
            </div>

            <Loadable data={calendar} error={calendarError}>
              <div className="hd-cal-grid" style={{ marginBottom: 8 }}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} className="hd-cal-day-label">{d}</div>
                ))}
              </div>

              <div className="hd-cal-grid">
                {Array.from({ length: offset }, (_, i) => (
                  <div key={`blank-${i}`} />
                ))}

                {calendar?.days.map((day) => {
                  const selected = day.date >= form.from && day.date <= form.to;

                  return (
                    <div
                      key={day.date}
                      className={`hd-cal-day hd-cal-${day.status}${day.date === today ? " hd-cal-today" : ""}`}
                      style={{
                        opacity: day.date < today ? 0.45 : 1,
                        outline: selected ? "2px solid var(--hd-green)" : "none",
                      }}
                      title={`${day.booked} booked of ${day.capacity} · ${money(day.price)} per night`}
                      onClick={() => pickDay(day.date)}
                    >
                      <div className="hd-cal-day-num">{Number(day.date.slice(8))}</div>
                      <div className="hd-cal-day-avail">
                        {day.closed ? "closed" : day.available > 0 ? `${day.available} left` : "full"}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "flex", gap: 16, marginTop: 14, fontSize: 11, flexWrap: "wrap" }}>
                {LEGEND.map(({ status, label }) => (
                  <span key={status} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <span className={`hd-cal-${status}`} style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3 }} />
                    {label}
                  </span>
                ))}
              </div>
            </Loadable>
          </div>
        </div>

        {/* Change a date range */}
        <form className="hd-card" onSubmit={handleSubmit} style={{ alignSelf: "start" }}>
          <div className="hd-card-header">
            <div className="hd-card-title">Update availability</div>
          </div>
          <div className="hd-card-body">
            <div className="hd-form-row">
              <div className="hd-form-group">
                <label>From</label>
                <input type="date" min={today} value={form.from} onChange={set("from")} required />
              </div>
              <div className="hd-form-group">
                <label>To</label>
                <input type="date" min={form.from} value={form.to} onChange={set("to")} required />
              </div>
            </div>

            <div className="hd-form-group" style={{ marginBottom: 12 }}>
              <label>Action</label>
              <select value={form.action} onChange={set("action")}>
                {ACTIONS.map((a) => (
                  <option key={a.id} value={a.id}>{a.label}</option>
                ))}
              </select>
            </div>

            {form.action === "rooms" && (
              <div className="hd-form-group" style={{ marginBottom: 12 }}>
                <label>Rooms on sale per night</label>
                <input type="number" min="0" value={form.rooms} onChange={set("rooms")} required />
              </div>
            )}

            <button className="hd-btn hd-btn-primary" style={{ width: "100%" }} disabled={saving || !roomId}>
              {saving ? "Saving..." : "Update availability"}
            </button>

            <div style={{ marginTop: 10, fontSize: 12, color: "var(--hd-muted)" }}>
              Tip: click a day in the calendar to pick it, then a later day to
              select the whole range. Rooms already booked stay booked.
            </div>
          </div>
        </form>
      </div>
    </Loadable>
  );
}
