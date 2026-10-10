// pages/host/RoomsPage.jsx
// Room types of the selected hotel: add, edit, remove. The price and number
// of rooms set here are what guests see and can book.

import { useState } from "react";
import popup from "../../components/common/Popup/popupService";
import useLoad from "../../hooks/useLoad";
import { apiError, deleteHostRoom, getHostRooms, saveHostRoom } from "../../services/hostApi";
import Loadable from "./Loadable";
import { money } from "./hostFormat";

const EMPTY_FORM = {
  room_type: "",
  description: "",
  bed_type: "",
  amenities: "",
  price_per_night: "",
  discount_price: "",
  max_guests: "2",
  total_rooms: "1",
};

const toForm = (room) =>
  Object.fromEntries(
    Object.keys(EMPTY_FORM).map((key) => [key, room[key] == null ? "" : String(room[key])])
  );

// Empty optional fields are sent as null so the API clears them
const toFields = (form) =>
  Object.fromEntries(
    Object.entries(form).map(([key, value]) => [key, value.trim() === "" ? null : value.trim()])
  );

export default function RoomsPage({ hotel }) {
  const { data: rooms, error, setData: setRooms } = useLoad(
    () => getHostRooms(hotel.id),
    [hotel.id],
    apiError
  );

  // null = form closed, "new" = adding, a number = the room being edited
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const open = (room) => {
    setEditing(room ? room.id : "new");
    setForm(room ? toForm(room) : EMPTY_FORM);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      setRooms(await saveHostRoom(hotel.id, toFields(form), editing === "new" ? null : editing));
      popup.success(editing === "new" ? "Room type added" : "Room type updated");
      setEditing(null);
    } catch (err) {
      popup.error(apiError(err));
    }

    setSaving(false);
  };

  const handleDelete = async (room) => {
    const sure = await popup.confirm(`Remove "${room.room_type}"? Guests will no longer be able to book it.`, {
      danger: true,
      confirmText: "Remove",
    });
    if (!sure) return;

    try {
      setRooms(await deleteHostRoom(hotel.id, room.id));
      popup.success("Room type removed");
    } catch (err) {
      popup.error(apiError(err));
    }
  };

  return (
    <Loadable data={rooms} error={error}>
      <div className="hd-card">
        <div className="hd-card-header">
          <div className="hd-card-title">Room types of {hotel.name}</div>
          <button className="hd-btn hd-btn-primary hd-btn-sm" onClick={() => open(null)}>
            + Add room type
          </button>
        </div>

        {rooms?.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "var(--hd-muted)", fontSize: 14 }}>
            No room types yet. Add one so guests can book your hotel.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="hd-table">
              <thead>
                <tr>
                  <th>Room type</th><th>Price / night</th><th>Discount price</th>
                  <th>Max guests</th><th>Rooms</th><th></th>
                </tr>
              </thead>
              <tbody>
                {rooms?.map((room) => (
                  <tr key={room.id}>
                    <td>
                      <div className="hd-guest-name">{room.room_type}</div>
                      <div className="hd-guest-email">{room.bed_type || ""}</div>
                    </td>
                    <td>{money(room.price_per_night)}</td>
                    <td>{room.discount_price ? money(room.discount_price) : "—"}</td>
                    <td>{room.max_guests}</td>
                    <td>{room.total_rooms}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="hd-btn hd-btn-outline hd-btn-sm" onClick={() => open(room)}>
                          Edit
                        </button>
                        <button className="hd-btn hd-btn-outline hd-btn-sm" onClick={() => handleDelete(room)}>
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing !== null && (
        <div className="hd-modal-overlay" onClick={(e) => e.target === e.currentTarget && setEditing(null)}>
          <form className="hd-modal" onSubmit={handleSubmit} style={{ width: 560, maxHeight: "92vh", overflowY: "auto" }}>
            <div className="hd-modal-title">{editing === "new" ? "Add room type" : "Edit room type"}</div>

            <div className="hd-form-row">
              <div className="hd-form-group">
                <label>Room type *</label>
                <input value={form.room_type} onChange={set("room_type")} placeholder="e.g. Deluxe Double" required />
              </div>
              <div className="hd-form-group">
                <label>Bed type</label>
                <input value={form.bed_type} onChange={set("bed_type")} placeholder="e.g. 1 king bed" />
              </div>
            </div>

            <div className="hd-form-row">
              <div className="hd-form-group">
                <label>Price per night (₦) *</label>
                <input type="number" min="1" step="any" value={form.price_per_night} onChange={set("price_per_night")} required />
              </div>
              <div className="hd-form-group">
                <label>Discount price (₦)</label>
                <input type="number" min="1" step="any" value={form.discount_price} onChange={set("discount_price")} placeholder="Leave empty for none" />
              </div>
            </div>

            <div className="hd-form-row">
              <div className="hd-form-group">
                <label>Max guests *</label>
                <input type="number" min="1" value={form.max_guests} onChange={set("max_guests")} required />
              </div>
              <div className="hd-form-group">
                <label>Number of rooms *</label>
                <input type="number" min="0" value={form.total_rooms} onChange={set("total_rooms")} required />
              </div>
            </div>

            <div className="hd-form-group" style={{ marginBottom: 12 }}>
              <label>Description</label>
              <textarea rows={3} value={form.description} onChange={set("description")} />
            </div>

            <div className="hd-form-group">
              <label>Amenities</label>
              <input value={form.amenities} onChange={set("amenities")} placeholder="e.g. WiFi, Air conditioning, TV" />
            </div>

            <div className="hd-modal-footer">
              <button type="button" className="hd-btn hd-btn-outline" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button type="submit" className="hd-btn hd-btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </Loadable>
  );
}
