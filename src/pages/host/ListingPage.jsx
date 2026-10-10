// pages/host/ListingPage.jsx
// The public details of the selected hotel, as shown on its page.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import popup from "../../components/common/Popup/popupService";
import useLoad from "../../hooks/useLoad";
import { apiError, getHostListing, saveHostListing } from "../../services/hostApi";
import Loadable from "./Loadable";
import { money } from "./hostFormat";

const FIELDS = [
  "description", "address", "phone", "website", "property_types",
  "amenities", "google_maps_url", "latitude", "longitude",
];

const toForm = (listing) =>
  Object.fromEntries(FIELDS.map((key) => [key, listing[key] == null ? "" : String(listing[key])]));

export default function ListingPage({ hotel }) {
  const { data: listing, error, setData: setListing } = useLoad(
    () => getHostListing(hotel.id),
    [hotel.id],
    apiError
  );

  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(listing ? toForm(listing) : null);
  }, [listing]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Empty fields are sent as null so the API clears them
      const fields = Object.fromEntries(
        Object.entries(form).map(([key, value]) => [key, value.trim() === "" ? null : value.trim()])
      );

      setListing(await saveHostListing(hotel.id, fields));
      popup.success("Listing updated");
    } catch (err) {
      popup.error(apiError(err));
    }

    setSaving(false);
  };

  return (
    <Loadable data={listing && form} error={error}>
      {listing && form && (
        <form className="hd-card" onSubmit={handleSubmit} style={{ maxWidth: 820 }}>
          <div className="hd-card-header">
            <div className="hd-card-title">{listing.name}</div>
            <Link className="hd-btn hd-btn-outline hd-btn-sm" to={`/hotel-details/${listing.slug}`} target="_blank">
              View public page
            </Link>
          </div>

          <div className="hd-card-body">
            <div className="hd-modal-notice" style={{ marginBottom: 16 }}>
              {listing.city_name ? `${listing.city_name} · ` : ""}
              Status: {listing.status || "—"}
              {listing.price_start_from ? ` · From ${money(listing.price_start_from)} per night` : ""}
              . The hotel name, city and status are managed by Stay9ja. The
              "from" price follows your cheapest room type.
            </div>

            <div className="hd-form-group" style={{ marginBottom: 12 }}>
              <label>Description</label>
              <textarea rows={5} value={form.description} onChange={set("description")} />
            </div>

            <div className="hd-form-group" style={{ marginBottom: 12 }}>
              <label>Address *</label>
              <input value={form.address} onChange={set("address")} required />
            </div>

            <div className="hd-form-row">
              <div className="hd-form-group">
                <label>Phone</label>
                <input value={form.phone} onChange={set("phone")} />
              </div>
              <div className="hd-form-group">
                <label>Website</label>
                <input type="url" value={form.website} onChange={set("website")} placeholder="https://" />
              </div>
            </div>

            <div className="hd-form-row">
              <div className="hd-form-group">
                <label>Property type</label>
                <input value={form.property_types} onChange={set("property_types")} placeholder="e.g. Hotel, Resort" />
              </div>
              <div className="hd-form-group">
                <label>Amenities</label>
                <input value={form.amenities} onChange={set("amenities")} placeholder="e.g. Pool, Free WiFi, Parking" />
              </div>
            </div>

            <div className="hd-form-group" style={{ marginBottom: 12 }}>
              <label>Google Maps link</label>
              <input type="url" value={form.google_maps_url} onChange={set("google_maps_url")} placeholder="https://maps.google.com/..." />
            </div>

            <div className="hd-form-row">
              <div className="hd-form-group">
                <label>Latitude</label>
                <input type="number" step="any" value={form.latitude} onChange={set("latitude")} />
              </div>
              <div className="hd-form-group">
                <label>Longitude</label>
                <input type="number" step="any" value={form.longitude} onChange={set("longitude")} />
              </div>
            </div>

            <button type="submit" className="hd-btn hd-btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save listing"}
            </button>
          </div>
        </form>
      )}
    </Loadable>
  );
}
