// pages/host/MyHotelsPage.jsx
// The partner's hotels, their requests to list a hotel, and the request form.

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_BASE } from "../../config/api";
import popup from "../../components/common/Popup/popupService";
import { apiError, requestHotel } from "../../services/hostApi";
import { shortDate } from "./hostFormat";
import { pickValidPhotos } from "./PhotosPage";

const MAX_REQUEST_PHOTOS = 5; // same limit as the API

const EMPTY_FORM = {
  name: "",
  address: "",
  city_id: "",
  description: "",
  phone: "",
  website: "",
  price_start_from: "",
  property_types: "",
};

const REQUEST_BADGE = {
  pending: "hd-badge-pending",
  approved: "hd-badge-confirmed",
  rejected: "hd-badge-cancelled",
};

// hotels / requests come from HostDashboard; onChanged reloads them
export default function MyHotelsPage({ hotels, requests, onChanged }) {
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [sending, setSending] = useState(false);

  // Photos sent with the request
  const fileRef = useRef(null);
  const [photos, setPhotos] = useState([]);

  const handlePhotos = (e) => {
    const room = MAX_REQUEST_PHOTOS - photos.length;
    const picked = pickValidPhotos(e.target.files, room);
    e.target.value = "";
    setPhotos([...photos, ...picked]);
  };

  useEffect(() => {
    axios
      .get(`${API_BASE}/cities`)
      .then((res) => setCities(res.data?.data || []))
      .catch(() => setCities([]));
  }, []);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      // Empty optional fields are left out so the API does not validate ""
      const fields = Object.fromEntries(
        Object.entries(form)
          .map(([key, value]) => [key, value.trim()])
          .filter(([, value]) => value !== "")
      );

      await requestHotel(fields, photos);
      setForm(EMPTY_FORM);
      setPhotos([]);
      await onChanged();
      popup.success("Request sent. We will review your hotel and let you know.");
    } catch (error) {
      popup.error(apiError(error));
    }

    setSending(false);
  };

  return (
    <div style={{ maxWidth: 820 }}>
      {hotels.length === 0 && (
        <div className="hd-modal-notice" style={{ marginBottom: 20, fontSize: 13 }}>
          No hotel is linked to your account yet. If your hotel is already on
          Stay9ja Hotels, ask our team to link it to this account. If it is not
          listed yet, send a request below.
        </div>
      )}

      {hotels.length > 0 && (
        <div className="hd-card">
          <div className="hd-card-header">
            <div className="hd-card-title">My hotels</div>
          </div>
          <table className="hd-table">
            <thead>
              <tr><th>Hotel</th><th>Address</th><th>Status</th></tr>
            </thead>
            <tbody>
              {hotels.map((h) => (
                <tr key={h.id}>
                  <td><div className="hd-guest-name">{h.name}</div></td>
                  <td>{h.address || "—"}</td>
                  <td>{h.status || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {requests.length > 0 && (
        <div className="hd-card">
          <div className="hd-card-header">
            <div className="hd-card-title">My hotel requests</div>
          </div>
          <table className="hd-table">
            <thead>
              <tr><th>Hotel</th><th>City</th><th>Sent</th><th>Status</th></tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="hd-guest-name">{r.name}</div>
                    {r.admin_note && <div className="hd-guest-email">Note: {r.admin_note}</div>}
                  </td>
                  <td>{r.city_name || "—"}</td>
                  <td>{shortDate(r.created_at)}</td>
                  <td>
                    <span className={`hd-badge ${REQUEST_BADGE[r.status] || ""}`}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="hd-card">
        <div className="hd-card-header">
          <div className="hd-card-title">List a new hotel</div>
        </div>

        <form className="hd-card-body" onSubmit={handleSubmit}>
          <div className="hd-form-row">
            <div className="hd-form-group">
              <label htmlFor="rq-name">Hotel name *</label>
              <input id="rq-name" required maxLength={255} value={form.name} onChange={set("name")} />
            </div>
            <div className="hd-form-group">
              <label htmlFor="rq-city">City *</label>
              <select id="rq-city" required value={form.city_id} onChange={set("city_id")}>
                <option value="">Select a city</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="hd-form-group" style={{ marginBottom: 12 }}>
            <label htmlFor="rq-address">Address *</label>
            <input id="rq-address" required maxLength={500} value={form.address} onChange={set("address")} />
          </div>

          <div className="hd-form-row">
            <div className="hd-form-group">
              <label htmlFor="rq-phone">Hotel phone</label>
              <input id="rq-phone" type="tel" maxLength={30} value={form.phone} onChange={set("phone")} />
            </div>
            <div className="hd-form-group">
              <label htmlFor="rq-website">Website</label>
              <input id="rq-website" type="url" placeholder="https://" value={form.website} onChange={set("website")} />
            </div>
          </div>

          <div className="hd-form-row">
            <div className="hd-form-group">
              <label htmlFor="rq-price">Price from (₦ per night)</label>
              <input id="rq-price" type="number" min="0" step="any" value={form.price_start_from} onChange={set("price_start_from")} />
            </div>
            <div className="hd-form-group">
              <label htmlFor="rq-type">Property type</label>
              <input id="rq-type" placeholder="e.g. Hotel, Apartment, Resort" value={form.property_types} onChange={set("property_types")} />
            </div>
          </div>

          <div className="hd-form-group" style={{ marginBottom: 12 }}>
            <label htmlFor="rq-desc">Description</label>
            <textarea id="rq-desc" rows={4} maxLength={5000} value={form.description} onChange={set("description")} />
          </div>

          <div className="hd-form-group" style={{ marginBottom: 12 }}>
            <label>Photos (up to {MAX_REQUEST_PHOTOS})</label>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              {photos.map((file, index) => (
                <span
                  key={`${file.name}-${index}`}
                  className="hd-badge hd-badge-completed"
                  style={{ textTransform: "none" }}
                >
                  {file.name}
                  <button
                    type="button"
                    aria-label={`Remove ${file.name}`}
                    onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                    style={{ border: "none", background: "none", cursor: "pointer", marginLeft: 6 }}
                  >
                    ✕
                  </button>
                </span>
              ))}

              {photos.length < MAX_REQUEST_PHOTOS && (
                <button
                  type="button"
                  className="hd-btn hd-btn-outline hd-btn-sm"
                  onClick={() => fileRef.current?.click()}
                >
                  + Add photos
                </button>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              hidden
              onChange={handlePhotos}
            />
            <div style={{ fontSize: 12, color: "var(--hd-muted)" }}>
              JPG, PNG or WebP, up to 4 MB each. The first photo becomes the main photo.
            </div>
          </div>

          <div className="hd-modal-footer">
            <button className="hd-btn hd-btn-primary" disabled={sending}>
              {sending ? "Sending..." : "Send request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
