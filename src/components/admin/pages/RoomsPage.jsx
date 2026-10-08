// components/admin/pages/RoomsPage.jsx
// Ek hotel ke saare rooms: list + Add + Edit + Delete

import { API_BASE } from "../../../config/api";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";


const BASE = `${API_BASE}/admin`;

const ROOMS_URL = (hotelId) => `${BASE}/hotelRooms/${hotelId}`; // GET
const ADD_ROOM_URL = `${BASE}/addRoom`; //                        POST
const UPDATE_ROOM_URL = (id) => `${BASE}/updateRoom/${id}`; //   PUT
const DELETE_ROOM_URL = (id) => `${BASE}/deleteRoom/${id}`; //   DELETE

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  Accept: "application/json",
});

// Alag-alag API formats se rooms ka array nikalta hai
const extractList = (json) => {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.data?.data)) return json.data.data;
  if (Array.isArray(json?.data?.rooms)) return json.data.rooms;
  if (Array.isArray(json?.rooms)) return json.rooms;
  return [];
};

const errMsg = (e) =>
  e?.response?.data?.message || e?.message || "Something went wrong";

const isActive = (s) => [1, "1", true, "active"].includes(s);

// ─────────────────────────────────────────────────────────────
// Form values
// ─────────────────────────────────────────────────────────────

const emptyRoom = {
  name: "",
  room_type: "",
  description: "",
  price: "",
  capacity: "",
  bed_type: "",
  total_rooms: "",
  amenities: "",
  image: "",
  status: "active",
};

// Room object (API se aaya hua) → form values
const fromRoom = (r) => ({
  name: r.name ?? r.room_name ?? "",
  room_type: r.room_type ?? r.type ?? "",
  description: r.description ?? "",
  price: String(r.price ?? r.price_per_night ?? ""),
  capacity: String(r.capacity ?? r.max_guests ?? ""),
  bed_type: r.bed_type ?? "",
  total_rooms: String(r.total_rooms ?? r.quantity ?? ""),
  amenities: Array.isArray(r.amenities)
    ? r.amenities.join(", ")
    : r.amenities ?? "",
  image: r.image ?? "",
  status: isActive(r.status) ? "active" : "inactive",
});

// Form values → API payload
const toPayload = (f, hotelId) => ({
  hotel_id: hotelId,
  name: f.name.trim(),
  room_type: f.room_type || null,
  description: f.description || null,
  price: Number(f.price),
  capacity: f.capacity ? Number(f.capacity) : null,
  bed_type: f.bed_type || null,
  total_rooms: f.total_rooms ? Number(f.total_rooms) : null,
  amenities: f.amenities || null,
  image: f.image || null,
  status: f.status === "active" ? 1 : 0,
});

// ─────────────────────────────────────────────────────────────
// Add / Edit form
// ─────────────────────────────────────────────────────────────

function RoomForm({ initial, isEdit, saving, error, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial);
  const [localError, setLocalError] = useState("");

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    if (!form.name.trim()) return setLocalError("Room name is required.");
    if (form.price === "" || Number(form.price) < 0)
      return setLocalError("Valid price is required.");

    onSubmit(form);
  };

  const shownError = localError || error;

  return (
    <form onSubmit={handleSubmit}>
      <div className="s9-card">
        <div className="s9-card-head">
          <div className="s9-card-title">
            {isEdit ? "Edit Room" : "Add New Room"}
          </div>
        </div>

        <div className="s9-card-body">
          <div className="s9-form-row">
            <div className="s9-form-group">
              <label className="s9-label">Room Name *</label>
              <input
                className="s9-input"
                type="text"
                placeholder="e.g. Deluxe King Room"
                value={form.name}
                onChange={set("name")}
              />
            </div>

            <div className="s9-form-group">
              <label className="s9-label">Room Type</label>
              <input
                className="s9-input"
                type="text"
                placeholder="Single, Double, Suite..."
                value={form.room_type}
                onChange={set("room_type")}
              />
            </div>
          </div>

          <div className="s9-form-row">
            <div className="s9-form-group">
              <label className="s9-label">Price per night (₦) *</label>
              <input
                className="s9-input"
                type="number"
                min={0}
                placeholder="e.g. 45000"
                value={form.price}
                onChange={set("price")}
              />
            </div>

            <div className="s9-form-group">
              <label className="s9-label">Max Guests</label>
              <input
                className="s9-input"
                type="number"
                min={1}
                placeholder="e.g. 2"
                value={form.capacity}
                onChange={set("capacity")}
              />
            </div>
          </div>

          <div className="s9-form-row">
            <div className="s9-form-group">
              <label className="s9-label">Bed Type</label>
              <input
                className="s9-input"
                type="text"
                placeholder="King, Queen, Twin..."
                value={form.bed_type}
                onChange={set("bed_type")}
              />
            </div>

            <div className="s9-form-group">
              <label className="s9-label">Total Rooms (quantity)</label>
              <input
                className="s9-input"
                type="number"
                min={0}
                placeholder="e.g. 10"
                value={form.total_rooms}
                onChange={set("total_rooms")}
              />
            </div>
          </div>

          <div className="s9-form-row full">
            <div className="s9-form-group">
              <label className="s9-label">Description</label>
              <textarea
                className="s9-input"
                rows={3}
                placeholder="Brief description of the room..."
                value={form.description}
                onChange={set("description")}
                style={{ resize: "vertical" }}
              />
            </div>
          </div>

          <div className="s9-form-row full">
            <div className="s9-form-group">
              <label className="s9-label">Amenities</label>
              <input
                className="s9-input"
                type="text"
                placeholder="WiFi, AC, TV, Breakfast..."
                value={form.amenities}
                onChange={set("amenities")}
              />
            </div>
          </div>

          <div className="s9-form-row">
            <div className="s9-form-group">
              <label className="s9-label">Photo URL</label>
              <input
                className="s9-input"
                type="url"
                placeholder="https://..."
                value={form.image}
                onChange={set("image")}
              />
            </div>

            <div className="s9-form-group">
              <label className="s9-label">Status</label>
              <select
                className="s9-input"
                value={form.status}
                onChange={set("status")}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {shownError && (
            <div className="s9-alert s9-alert-red" style={{ marginTop: 12 }}>
              <span>Error:</span>
              <span>{shownError}</span>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button
              type="button"
              className="s9-btn"
              onClick={onCancel}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="s9-btn s9-btn-primary"
              disabled={saving}
              style={{ minWidth: 140 }}
            >
              {saving ? "Saving…" : isEdit ? "Update Room" : "Add Room"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────
// Main: Rooms list
// ─────────────────────────────────────────────────────────────

export default function RoomsPage({ hotel, onBack }) {
  const hotelName = hotel.name || hotel.hotel_name || "Hotel";

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState(null); // { success, message }

  // formMode: null (list) | "add" | room object (edit)
  const [formMode, setFormMode] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      const res = await axios.get(ROOMS_URL(hotel.id), {
        headers: authHeaders(),
      });
      setRooms(extractList(res.data));
    } catch (e) {
      setLoadError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }, [hotel.id]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const closeForm = () => {
    setFormMode(null);
    setFormError("");
  };

  const handleSubmit = async (form) => {
    const isEdit = formMode && formMode !== "add";
    const payload = toPayload(form, hotel.id);

    setSaving(true);
    setFormError("");
    setNotice(null);

    try {
      if (isEdit) {
        await axios.put(UPDATE_ROOM_URL(formMode.id), payload, {
          headers: authHeaders(),
        });
      } else {
        await axios.post(ADD_ROOM_URL, payload, { headers: authHeaders() });
      }

      setNotice({
        success: true,
        message: isEdit ? "Room updated successfully" : "Room added successfully",
      });
      closeForm();
      fetchRooms();
    } catch (e) {
      setFormError(errMsg(e));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (room) => {
    if (!window.confirm(`Delete room "${room.name || room.room_name}"?`)) return;

    setNotice(null);

    try {
      await axios.delete(DELETE_ROOM_URL(room.id), { headers: authHeaders() });
      setRooms((prev) => prev.filter((r) => r.id !== room.id));
      setNotice({ success: true, message: "Room deleted successfully" });
    } catch (e) {
      setNotice({ success: false, message: errMsg(e) });
    }
  };

  // ─────────── Add / Edit form view ───────────

  if (formMode) {
    const isEdit = formMode !== "add";

    return (
      <div>
        <div style={{ marginBottom: 14 }}>
          <button type="button" className="s9-btn" onClick={closeForm}>
            ← Back to rooms
          </button>
        </div>

        <RoomForm
          key={isEdit ? formMode.id : "new"}
          initial={isEdit ? fromRoom(formMode) : emptyRoom}
          isEdit={isEdit}
          saving={saving}
          error={formError}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      </div>
    );
  }

  // ─────────── Rooms list view ───────────

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 18,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <button type="button" className="s9-btn" onClick={onBack}>
          ← Back to hotels
        </button>

        <div style={{ fontSize: 15, fontWeight: 600 }}>
          Rooms: {hotelName}
        </div>

        <button
          type="button"
          className="s9-btn s9-btn-primary"
          style={{ marginLeft: "auto" }}
          onClick={() => {
            setNotice(null);
            setFormError("");
            setFormMode("add");
          }}
        >
          + Add Room
        </button>
      </div>

      {notice && (
        <div
          className={`s9-alert ${
            notice.success ? "s9-alert-green" : "s9-alert-red"
          }`}
          style={{ marginBottom: 12 }}
        >
          <span>{notice.success ? "Success:" : "Error:"}</span>
          <span>{notice.message}</span>
        </div>
      )}

      {loadError && (
        <div className="s9-alert s9-alert-red" style={{ marginBottom: 12 }}>
          <span>Error:</span>
          <span>
            {loadError} (rooms load nahi hue, ROOMS_URL check karo)
          </span>
        </div>
      )}

      <div className="s9-card">
        <table className="s9-tbl">
          <thead>
            <tr>
              <th>#</th>
              <th>Photo</th>
              <th>Room</th>
              <th>Type</th>
              <th>Price / night</th>
              <th>Guests</th>
              <th>Rooms</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", padding: 20 }}>
                  Loading...
                </td>
              </tr>
            ) : rooms.length > 0 ? (
              rooms.map((r, i) => {
                const price = r.price ?? r.price_per_night;

                return (
                  <tr key={r.id || i}>
                    <td>{i + 1}</td>

                    <td>
                      {r.image ? (
                        <img
                          src={r.image}
                          alt=""
                          style={{
                            width: 44,
                            height: 44,
                            objectFit: "cover",
                            borderRadius: 6,
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        "—"
                      )}
                    </td>

                    <td style={{ fontWeight: 600 }}>
                      {r.name || r.room_name}
                    </td>

                    <td>{r.room_type || r.type || "—"}</td>

                    <td>
                      {price || price === 0
                        ? `₦${Number(price).toLocaleString()}`
                        : "—"}
                    </td>

                    <td>{r.capacity ?? r.max_guests ?? "—"}</td>

                    <td>{r.total_rooms ?? r.quantity ?? "—"}</td>

                    <td>
                      <span
                        className={
                          isActive(r.status)
                            ? "s9-badge s9-badge-green"
                            : "s9-badge s9-badge-gray"
                        }
                      >
                        {isActive(r.status) ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button
                          type="button"
                          className="s9-btn s9-btn-outline s9-btn-sm"
                          onClick={() => {
                            setNotice(null);
                            setFormError("");
                            setFormMode(r);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="s9-btn s9-btn-danger s9-btn-sm"
                          onClick={() => handleDelete(r)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", padding: 20 }}>
                  This hotel doesn’t have any rooms. Please add the first room using the “+ Add Room” button.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}