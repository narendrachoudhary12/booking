// components/admin/pages/AddHotelPage.jsx

import popup from "../../common/Popup/popupService";
import { useState, useRef } from "react";
import { Toggle } from "../ui/Badges";
import {
  useAddHotel,
  useCSVImport,
  downloadCSVTemplate,
} from "../../../hooks/useAddHotel";

// ─────────────────────────────────────────────────────────────
// Small helper components
// ─────────────────────────────────────────────────────────────

function StatusBar({ result }) {
  if (!result) return null;

  const cls = result.success
    ? "s9-alert s9-alert-green"
    : "s9-alert s9-alert-red";

  return (
    <div className={cls} style={{ marginTop: 12 }}>
      <span>{result.success ? "Success:" : "Error:"}</span>
      <span>{result.message}</span>
    </div>
  );
}

function ProgressBadge({ status }) {
  const map = {
    pending: { cls: "s9-badge s9-badge-gray", label: "Pending" },
    loading: { cls: "s9-badge s9-badge-blue", label: "Uploading…" },
    success: { cls: "s9-badge s9-badge-green", label: "Done ✓" },
    error: { cls: "s9-badge s9-badge-red", label: "Failed ✗" },
  };

  const { cls, label } = map[status] || map.pending;

  return <span className={cls}>{label}</span>;
}

// Form layout helpers (same s9- classes as before)
function Row({ full, children }) {
  return <div className={`s9-form-row${full ? " full" : ""}`}>{children}</div>;
}

function Group({ label, children }) {
  return (
    <div className="s9-form-group">
      <label className="s9-label">{label}</label>
      {children}
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="s9-card">
      <div className="s9-card-head">
        <div className="s9-card-title">{title}</div>
      </div>
      <div className="s9-card-body">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CSV Import Tab
// ─────────────────────────────────────────────────────────────

const thStyle = {
  padding: "8px 10px",
  textAlign: "left",
  fontWeight: 500,
  fontSize: 12,
  color: "var(--muted)",
  borderBottom: "1px solid var(--border)",
  background: "var(--surface-2)",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "7px 10px",
  borderBottom: "1px solid var(--border)",
  fontSize: 12,
};

function CSVImportTab() {
  const {
    rows,
    progress,
    importing,
    summary,
    loadFile,
    importAll,
    reset,
    abort,
  } = useCSVImport();

  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState("");

  const fileRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    setFileError("");

    try {
      await loadFile(file);
    } catch (e) {
      setFileError(String(e));
    }
  };

  const previewCols = [
    "name",
    "address",
    "city_id",
    "state_id",
    "rating",
    "status",
  ];

  const previewRows = rows.slice(0, 10);

  return (
    <div>
      <div className="s9-alert s9-alert-green">
        <span>Info:</span>

        <span>
          Upload a CSV with columns:{" "}
          <strong>
            name, slug, description, phone, website, amenities,
            google_place_id, google_maps_url, property_types, address,
            city_id, state_id, country_id, image, latitude, longitude,
            price_start_from, rating, status, extra_images
          </strong>{" "}
          — use pipe (<code>|</code>) to separate multiple image URLs in
          extra_images.
        </span>
      </div>

      <div className="s9-card">
        <div className="s9-card-head">
          <div className="s9-card-title">Upload CSV</div>
        </div>

        <div className="s9-card-body">
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFile(e.dataTransfer.files[0]);
            }}
            style={{
              border: "1.5px dashed var(--border)",
              borderRadius: 10,
              padding: "2rem",
              textAlign: "center",
              cursor: "pointer",
              background: dragOver ? "var(--surface-2)" : "transparent",
              transition: "background 0.15s",
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 6 }}>📂</div>

            <div style={{ fontWeight: 500, fontSize: 14 }}>
              Click to browse or drag & drop
            </div>

            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
              CSV files only · Max 500 hotels
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])}
          />

          {fileError && (
            <div className="s9-alert s9-alert-red" style={{ marginTop: 10 }}>
              <span>Error:</span>
              <span>{fileError}</span>
            </div>
          )}

          <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
            <button
              type="button"
              className="s9-btn"
              onClick={downloadCSVTemplate}
            >
              ⬇ Download template
            </button>

            {rows.length > 0 && (
              <button type="button" className="s9-btn" onClick={reset}>
                ✕ Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {rows.length > 0 && (
        <div className="s9-card">
          <div
            className="s9-card-head"
            style={{ justifyContent: "space-between" }}
          >
            <div className="s9-card-title">Preview</div>

            <span className="s9-badge s9-badge-green">
              {rows.length} hotels
            </span>
          </div>

          <div className="s9-card-body" style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
              }}
            >
              <thead>
                <tr>
                  <th style={thStyle}>#</th>

                  {previewCols.map((c) => (
                    <th key={c} style={thStyle}>
                      {c}
                    </th>
                  ))}

                  <th style={thStyle}>upload</th>
                </tr>
              </thead>

              <tbody>
                {previewRows.map((row, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{i + 1}</td>

                    {previewCols.map((c) => (
                      <td
                        key={c}
                        style={{
                          ...tdStyle,
                          maxWidth: 140,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={row[c]}
                      >
                        {row[c] || "—"}
                      </td>
                    ))}

                    <td style={tdStyle} title={progress[i]?.msg || ""}>
                      <ProgressBadge status={progress[i]?.status || "pending"} />
                    </td>
                  </tr>
                ))}

                {rows.length > 10 && (
                  <tr>
                    <td
                      colSpan={previewCols.length + 2}
                      style={{ ...tdStyle, color: "var(--muted)" }}
                    >
                      … and {rows.length - 10} more rows
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {summary.done + summary.failed > 0 && (
            <div
              style={{
                padding: "10px 16px",
                fontSize: 13,
                display: "flex",
                gap: 16,
                borderTop: "1px solid var(--border)",
              }}
            >
              <span style={{ color: "var(--success)" }}>
                ✓ {summary.done} done
              </span>

              {summary.failed > 0 && (
                <span style={{ color: "var(--danger)" }}>
                  ✗ {summary.failed} failed
                </span>
              )}

              {summary.pending > 0 && (
                <span style={{ color: "var(--muted)" }}>
                  ⏳ {summary.pending} pending
                </span>
              )}
            </div>
          )}

          <div
            style={{
              padding: "12px 16px",
              display: "flex",
              gap: 10,
              borderTop: "1px solid var(--border)",
            }}
          >
            {!importing ? (
              <button
                type="button"
                className="s9-btn s9-btn-primary"
                onClick={importAll}
                disabled={rows.length === 0}
                style={{ minWidth: 160 }}
              >
                ☁ Import {rows.length} hotels
              </button>
            ) : (
              <button type="button" className="s9-btn s9-btn-red" onClick={abort}>
                ✕ Stop import
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Form helpers
// ─────────────────────────────────────────────────────────────

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  phone: "",
  website: "",
  amenities: "",
  google_place_id: "",
  google_maps_url: "",
  property_types: "",
  address: "",
  city_id: "",
  state_id: "",
  country_id: "",
  image: "",
  latitude: "",
  longitude: "",
  price_start_from: "",
  rating: "5",
  status: "active",
  extra_images: "",
};

const slugify = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

// Hotel object (list se aaya hua) → form values
const fromHotel = (h) => {
  const f = { ...emptyForm };

  Object.keys(emptyForm).forEach((k) => {
    if (h[k] !== undefined && h[k] !== null) f[k] = String(h[k]);
  });

  // nested objects ka fallback (jaise hotel.city.id)
  f.city_id = String(h.city_id ?? h.city?.id ?? "");
  f.state_id = String(h.state_id ?? h.state?.id ?? "");
  f.country_id = String(h.country_id ?? h.country?.id ?? "");

  f.rating = String(Math.round(Number(h.rating)) || 5);

  f.status = [1, "1", true, "active"].includes(h.status)
    ? "active"
    : "inactive";

  if (Array.isArray(h.amenities)) f.amenities = h.amenities.join(", ");

  const imgs = h.extra_images || h.images;
  f.extra_images = Array.isArray(imgs)
    ? imgs.map((i) => (typeof i === "string" ? i : i.url || i.image || "")).filter(Boolean).join("\n")
    : imgs || "";

  return f;
};

// ─────────────────────────────────────────────────────────────
// Main Page
//   Add mode:  <AddHotelPage />
//   Edit mode: <AddHotelPage hotel={hotel} onSaved={...} onCancel={...} />
// ─────────────────────────────────────────────────────────────

export default function AddHotelPage({ hotel = null, onSaved, onCancel }) {
  const isEdit = !!hotel?.id;

  const [activeTab, setActiveTab] = useState("single");
  const [tier, setTier] = useState("1");

  const { loading, result, save, update, clearResult } = useAddHotel();

  const [form, setForm] = useState(() =>
    hotel ? fromHotel(hotel) : emptyForm
  );

  const set = (field) => (e) => {
    clearResult();

    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Name change → auto slug (sirf add mode mein; edit mein slug same rehta hai)
  const handleNameChange = (e) => {
    clearResult();

    const name = e.target.value;

    setForm((prev) => ({
      ...prev,
      name,
      slug: isEdit ? prev.slug : slugify(name),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    clearResult();

    if (!form.name.trim()) return popup.warning("Hotel name is required.");
    if (!form.city_id) return popup.warning("City ID is required.");
    if (!form.state_id) return popup.warning("State ID is required.");
    if (!form.country_id) return popup.warning("Country ID is required.");

    const payload = {
      ...form,
      city_id: Number(form.city_id),
      state_id: Number(form.state_id),
      country_id: Number(form.country_id),
      price_start_from: form.price_start_from
        ? Number(form.price_start_from)
        : null,
      rating: form.rating ? Number(form.rating) : 5,
      latitude: form.latitude ? Number(form.latitude) : null,
      longitude: form.longitude ? Number(form.longitude) : null,
      status: form.status === "active" ? 1 : 0,
      extra_images: form.extra_images
        ? form.extra_images
            .split("\n")
            .map((url) => url.trim())
            .filter(Boolean)
        : [],
    };

    const ok = isEdit
      ? await update(hotel.id, payload)
      : await save(payload);

    if (ok && isEdit && onSaved) onSaved();
  };

  return (
    <div>
      {/* ───────── Edit heading ───────── */}

      {isEdit && (
        <h2 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>
          Edit Hotel: {hotel.name}
        </h2>
      )}

      {/* ───────── Tabs (sirf add mode mein) ───────── */}

      {!isEdit && (
        <div
          style={{
            display: "flex",
            gap: 0,
            marginBottom: 20,
            border: "1px solid var(--border)",
            borderRadius: 8,
            overflow: "hidden",
            width: "fit-content",
          }}
        >
          {[
            ["single", "➕ Add Hotel"],
            ["csv", "📤 Bulk CSV Import"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              style={{
                padding: "8px 20px",
                fontSize: 13,
                border: "none",
                cursor: "pointer",
                background:
                  activeTab === key ? "var(--surface-2)" : "transparent",
                fontWeight: activeTab === key ? 500 : 400,
                borderRight: key === "single" ? "1px solid var(--border)" : "none",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ───────── SINGLE HOTEL FORM ───────── */}

      {(isEdit || activeTab === "single") && (
        <form onSubmit={handleSave}>
          <div className="s9-alert s9-alert-green">
            <span>Info:</span>

            <span>
              Fill in the hotel details below. Tier 1 hotels require a channel
              manager API connection. Tier 2 hotels get an extranet login. Tier
              3 is managed manually by your team.
            </span>
          </div>

          <div className="s9-two-col">
            {/* ─────────── LEFT COLUMN ─────────── */}

            <div>
              <Card title="Basic Information">
                <Row full>
                  <Group label="Hotel Name *">
                    <input
                      className="s9-input"
                      type="text"
                      placeholder="e.g. Eko Suites & Towers"
                      value={form.name}
                      onChange={handleNameChange}
                      autoComplete="off"
                    />
                  </Group>
                </Row>

                <Row full>
                  <Group label={isEdit ? "Slug" : "Slug (auto-generated)"}>
                    <input
                      className="s9-input"
                      type="text"
                      placeholder="eko-suites-towers"
                      value={form.slug}
                      onChange={set("slug")}
                      autoComplete="off"
                    />
                  </Group>
                </Row>

                <Row>
                  <Group label="City ID">
                    <input
                      className="s9-input"
                      type="number"
                      placeholder="e.g. 1"
                      value={form.city_id}
                      onChange={set("city_id")}
                    />
                  </Group>

                  <Group label="State ID">
                    <input
                      className="s9-input"
                      type="number"
                      placeholder="e.g. 1"
                      value={form.state_id}
                      onChange={set("state_id")}
                    />
                  </Group>
                </Row>

                <Row>
                  <Group label="Country ID">
                    <input
                      className="s9-input"
                      type="number"
                      placeholder="e.g. 1"
                      value={form.country_id}
                      onChange={set("country_id")}
                    />
                  </Group>

                  <Group label="Property Type">
                    <input
                      className="s9-input"
                      type="text"
                      placeholder="hotel, resort..."
                      value={form.property_types}
                      onChange={set("property_types")}
                    />
                  </Group>
                </Row>

                <Row full>
                  <Group label="Full Address">
                    <input
                      className="s9-input"
                      type="text"
                      placeholder="Street address"
                      value={form.address}
                      onChange={set("address")}
                    />
                  </Group>
                </Row>

                <Row>
                  <Group label="Phone Number">
                    <input
                      className="s9-input"
                      type="tel"
                      placeholder="+234..."
                      value={form.phone}
                      onChange={set("phone")}
                    />
                  </Group>

                  <Group label="Website">
                    <input
                      className="s9-input"
                      type="url"
                      placeholder="https://"
                      value={form.website}
                      onChange={set("website")}
                    />
                  </Group>
                </Row>

                <Row>
                  <Group label="Latitude">
                    <input
                      className="s9-input"
                      type="number"
                      step="0.00000001"
                      placeholder="6.45306"
                      value={form.latitude}
                      onChange={set("latitude")}
                    />
                  </Group>

                  <Group label="Longitude">
                    <input
                      className="s9-input"
                      type="number"
                      step="0.00000001"
                      placeholder="3.39583"
                      value={form.longitude}
                      onChange={set("longitude")}
                    />
                  </Group>
                </Row>

                <Row>
                  <Group label="Google Place ID">
                    <input
                      className="s9-input"
                      type="text"
                      placeholder="ChIJ..."
                      value={form.google_place_id}
                      onChange={set("google_place_id")}
                    />
                  </Group>

                  <Group label="Google Maps URL">
                    <input
                      className="s9-input"
                      type="url"
                      placeholder="https://maps.google.com/..."
                      value={form.google_maps_url}
                      onChange={set("google_maps_url")}
                    />
                  </Group>
                </Row>
              </Card>

              <Card title="Integration Tier">
                <Row full>
                  <Group label="Integration Tier">
                    <select
                      className="s9-input"
                      value={tier}
                      onChange={(e) => setTier(e.target.value)}
                    >
                      <option value="1">
                        Tier 1 - API Connected (Channel Manager / PMS)
                      </option>
                      <option value="2">
                        Tier 2 - Extranet (Manual dashboard login)
                      </option>
                      <option value="3">Tier 3 - Manual (Staff-managed)</option>
                    </select>
                  </Group>
                </Row>

                {tier === "1" && (
                  <>
                    <Row>
                      <Group label="Channel Manager">
                        <select className="s9-input" defaultValue="Channex">
                          <option value="Channex">Channex</option>
                          <option value="OTA Sync">OTA Sync</option>
                          <option value="Direct PMS API">Direct PMS API</option>
                        </select>
                      </Group>

                      <Group label="API Key">
                        <input
                          className="s9-input"
                          type="password"
                          placeholder="..."
                        />
                      </Group>
                    </Row>

                    <Row full>
                      <Group label="Property ID">
                        <input
                          className="s9-input"
                          type="text"
                          placeholder="PROP-12345"
                        />
                      </Group>
                    </Row>
                  </>
                )}

                {tier === "2" && (
                  <Row>
                    <Group label="Extranet Username">
                      <input
                        className="s9-input"
                        type="text"
                        placeholder="Username"
                      />
                    </Group>

                    <Group label="Extranet Password">
                      <input
                        className="s9-input"
                        type="password"
                        placeholder="Password"
                      />
                    </Group>
                  </Row>
                )}

                {tier === "3" && (
                  <div className="s9-alert s9-alert-green" style={{ marginTop: 8 }}>
                    <span>Info:</span>
                    <span>This hotel will be managed manually by your staff.</span>
                  </div>
                )}
              </Card>
            </div>

            {/* ─────────── RIGHT COLUMN ─────────── */}

            <div>
              <Card title="Media & Details">
                <Row>
                  <Group label="Star Rating">
                    <select
                      className="s9-input"
                      value={form.rating}
                      onChange={set("rating")}
                    >
                      <option value="1">1 Star</option>
                      <option value="2">2 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="5">5 Stars</option>
                    </select>
                  </Group>

                  <Group label="Price From (₦)">
                    <input
                      className="s9-input"
                      type="number"
                      placeholder="e.g. 25000"
                      value={form.price_start_from}
                      onChange={set("price_start_from")}
                    />
                  </Group>
                </Row>

                <Row full>
                  <Group label="Description">
                    <textarea
                      className="s9-input"
                      rows={3}
                      placeholder="Brief description of the hotel..."
                      value={form.description}
                      onChange={set("description")}
                      style={{ resize: "vertical" }}
                    />
                  </Group>
                </Row>

                <Row full>
                  <Group label="Amenities">
                    <input
                      className="s9-input"
                      type="text"
                      placeholder="WiFi, Pool, Gym, Restaurant, Bar..."
                      value={form.amenities}
                      onChange={set("amenities")}
                    />
                  </Group>
                </Row>

                <Row full>
                  <Group label="Cover Photo URL">
                    <input
                      className="s9-input"
                      type="url"
                      placeholder="https://..."
                      value={form.image}
                      onChange={set("image")}
                    />
                  </Group>
                </Row>

                <Row full>
                  <Group label="Extra Image URLs (one per line → hotel_images table)">
                    <textarea
                      className="s9-input"
                      rows={2}
                      placeholder={`https://img1.jpg\nhttps://img2.jpg`}
                      value={form.extra_images}
                      onChange={set("extra_images")}
                      style={{ resize: "vertical" }}
                    />
                  </Group>
                </Row>

                <Row>
                  <Group label="Status">
                    <select
                      className="s9-input"
                      value={form.status}
                      onChange={set("status")}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </Group>
                </Row>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    marginTop: 8,
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>
                    Published on site:
                  </span>

                  <Toggle defaultChecked />
                </div>
              </Card>

              <Card title="Commission">
                <Row full>
                  <Group label="Stay9ja Commission (%)">
                    <input
                      className="s9-input"
                      type="number"
                      defaultValue={15}
                      min={0}
                      max={30}
                    />
                  </Group>
                </Row>

                <Row full>
                  <Group label="Payout Method">
                    <select
                      className="s9-input"
                      defaultValue="Bank Transfer (GTBank)"
                    >
                      <option>Bank Transfer (GTBank)</option>
                      <option>Bank Transfer (First Bank)</option>
                      <option>Paystack Transfer</option>
                      <option>Flutterwave Transfer</option>
                    </select>
                  </Group>
                </Row>

                <Row full>
                  <Group label="Account Number">
                    <input
                      className="s9-input"
                      type="text"
                      placeholder="0123456789"
                    />
                  </Group>
                </Row>
              </Card>

              <StatusBar result={result} />

              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                {isEdit && (
                  <button
                    type="button"
                    className="s9-btn"
                    onClick={onCancel}
                    style={{ padding: 12, fontSize: 14 }}
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  className="s9-btn s9-btn-primary"
                  style={{
                    flex: 1,
                    padding: 12,
                    fontSize: 14,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                  disabled={loading}
                >
                  {loading
                    ? "Saving…"
                    : isEdit
                    ? "Update Hotel"
                    : "Save Hotel"}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ───────── CSV TAB ───────── */}

      {!isEdit && activeTab === "csv" && <CSVImportTab />}
    </div>
  );
}