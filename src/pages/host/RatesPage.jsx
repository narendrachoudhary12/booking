// pages/host/RatesPage.jsx
// Normal prices come from the room types. Here the owner sets a different
// price (or a minimum stay) for a date range, e.g. weekends or holidays.

import { useEffect, useState } from "react";
import popup from "../../components/common/Popup/popupService";
import useLoad from "../../hooks/useLoad";
import {
  apiError,
  getHostRates,
  getHostRooms,
  updateHostCalendar,
} from "../../services/hostApi";
import Loadable from "./Loadable";
import { isoDate, money, shortDate } from "./hostFormat";

export default function RatesPage({ hotel, onNavigate }) {
  const today = isoDate();

  const { data: rooms, error: roomsError } = useLoad(() => getHostRooms(hotel.id), [hotel.id], apiError);
  const { data: rates, error: ratesError, reload } = useLoad(() => getHostRates(hotel.id), [hotel.id], apiError);

  const [form, setForm] = useState({ room_id: "", from: today, to: today, price: "", min_stay: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm((current) => ({ ...current, room_id: rooms?.[0]?.id ?? "" }));
  }, [rooms]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  // Sends one change to the calendar, then reloads the list
  const change = async (changes, successMessage) => {
    setSaving(true);

    try {
      await updateHostCalendar(hotel.id, changes);
      await reload();
      popup.success(successMessage);
    } catch (err) {
      popup.error(apiError(err));
    }

    setSaving(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.price && !form.min_stay) {
      popup.warning("Enter a price or a minimum stay.");
      return;
    }

    const changes = { room_id: Number(form.room_id), from: form.from, to: form.to };
    if (form.price) changes.price = Number(form.price);
    if (form.min_stay) changes.min_stay = Number(form.min_stay);

    change(changes, "Special rate saved").then(() =>
      setForm((current) => ({ ...current, price: "", min_stay: "" }))
    );
  };

  const handleRemove = async (rate) => {
    if (!(await popup.confirm("Remove this special rate? The normal price will apply again."))) return;

    change(
      { room_id: rate.room_id, from: rate.from < today ? today : rate.from, to: rate.to, price: null, min_stay: null },
      "Special rate removed"
    );
  };

  if (rooms?.length === 0) {
    return (
      <div className="hd-card">
        <div className="hd-card-body" style={{ textAlign: "center", color: "var(--hd-muted)", fontSize: 14 }}>
          <p style={{ marginBottom: 12 }}>Add a room type first, then set its prices here.</p>
          <button className="hd-btn hd-btn-primary" onClick={() => onNavigate("rooms")}>
            Go to Room Types
          </button>
        </div>
      </div>
    );
  }

  return (
    <Loadable data={rooms} error={roomsError}>
      {/* Normal prices */}
      <div className="hd-card">
        <div className="hd-card-header">
          <div className="hd-card-title">Normal prices</div>
          <button className="hd-btn hd-btn-outline hd-btn-sm" onClick={() => onNavigate("rooms")}>
            Edit in Room Types
          </button>
        </div>
        <div className="hd-card-body">
          {rooms?.map((room) => (
            <div key={room.id} className="hd-room-item">
              <div className="hd-room-info">
                <div className="hd-room-name">{room.room_type}</div>
                <div className="hd-room-meta">{room.total_rooms} rooms · Max {room.max_guests} guests</div>
              </div>
              <div className="hd-room-rate">
                {money(room.discount_price || room.price_per_night)} / night
                {room.discount_price && (
                  <span style={{ marginLeft: 8, color: "var(--hd-muted)", textDecoration: "line-through", fontWeight: 400 }}>
                    {money(room.price_per_night)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add a special rate */}
      <form className="hd-card" onSubmit={handleSubmit}>
        <div className="hd-card-header">
          <div className="hd-card-title">Add a special rate</div>
        </div>
        <div className="hd-card-body">
          <div className="hd-form-row">
            <div className="hd-form-group">
              <label>Room type</label>
              <select value={form.room_id} onChange={set("room_id")} required>
                {rooms?.map((room) => (
                  <option key={room.id} value={room.id}>{room.room_type}</option>
                ))}
              </select>
            </div>
            <div className="hd-form-group">
              <label>Price per night (₦)</label>
              <input type="number" min="1" step="any" value={form.price} onChange={set("price")} placeholder="e.g. 75000" />
            </div>
          </div>

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

          <div className="hd-form-row">
            <div className="hd-form-group">
              <label>Minimum stay (nights)</label>
              <input type="number" min="1" max="60" value={form.min_stay} onChange={set("min_stay")} placeholder="Optional" />
            </div>
          </div>

          <button className="hd-btn hd-btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save special rate"}
          </button>
        </div>
      </form>

      {/* Upcoming special rates */}
      <div className="hd-card">
        <div className="hd-card-header">
          <div className="hd-card-title">Upcoming special rates</div>
        </div>
        <Loadable data={rates} error={ratesError}>
          {rates?.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "var(--hd-muted)", fontSize: 14 }}>
              No special rates. Every date uses the normal price.
            </div>
          ) : (
            <table className="hd-table">
              <thead>
                <tr><th>Room type</th><th>From</th><th>To</th><th>Price / night</th><th>Min stay</th><th></th></tr>
              </thead>
              <tbody>
                {rates?.map((rate) => (
                  <tr key={`${rate.room_id}-${rate.from}`}>
                    <td>{rate.room_type}</td>
                    <td>{shortDate(rate.from)}</td>
                    <td>{shortDate(rate.to)}</td>
                    <td>{rate.price ? money(rate.price) : "Normal price"}</td>
                    <td>{rate.min_stay ? `${rate.min_stay} nights` : "—"}</td>
                    <td>
                      <button className="hd-btn hd-btn-outline hd-btn-sm" disabled={saving} onClick={() => handleRemove(rate)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Loadable>
      </div>
    </Loadable>
  );
}
