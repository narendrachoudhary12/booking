// components/admin/pages/AddHotelPage.jsx
import { useState, useRef } from "react";
import { Toggle } from "../ui/Badges";
import { useAddHotel, useCSVImport, downloadCSVTemplate } from "../../../hooks/useAddHotel";

// ─── Small helper components ──────────────────────────────────────────────────

function StatusBar({ result }) {
  if (!result) return null;
  const cls = result.success ? "s9-alert s9-alert-green" : "s9-alert s9-alert-red";
  return (
    <div className={cls} style={{ marginTop: 12 }}>
      <span>{result.success ? "Success:" : "Error:"}</span>
      <span>{result.message}</span>
    </div>
  );
}

function ProgressBadge({ status }) {
  const map = {
    pending: { cls: "s9-badge s9-badge-gray",  label: "Pending"  },
    loading: { cls: "s9-badge s9-badge-blue",  label: "Uploading…" },
    success: { cls: "s9-badge s9-badge-green", label: "Done ✓"   },
    error:   { cls: "s9-badge s9-badge-red",   label: "Failed ✗"  },
  };
  const { cls, label } = map[status] || map.pending;
  return <span className={cls}>{label}</span>;
}

// ─── CSV Import Tab ───────────────────────────────────────────────────────────

function CSVImportTab() {
  const { rows, progress, importing, summary, loadFile, importAll, reset, abort } = useCSVImport();
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState("");
  const fileRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    setFileError("");
    try {
      await loadFile(file);
    } catch (e) {
      setFileError(String(e));
    }
  };

  const previewCols = ["name", "address", "city_id", "state_id", "rating", "status"];
  const previewRows = rows.slice(0, 10);

  return (
    <div>
      <div className="s9-alert s9-alert-green">
        <span>Info:</span>
        <span>
          Upload a CSV with columns: <strong>name, slug, description, phone, website, amenities,
          google_place_id, google_maps_url, property_types, address, city_id, state_id,
          country_id, image, latitude, longitude, price_start_from, rating, status,
          extra_images</strong> — use pipe (<code>|</code>) to separate multiple image URLs in
          extra_images.
        </span>
      </div>

      {/* Drop zone */}
      <div className="s9-card">
        <div className="s9-card-head"><div className="s9-card-title">Upload CSV</div></div>
        <div className="s9-card-body">
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
            style={{
              border: `1.5px dashed var(--border)`,
              borderRadius: 10,
              padding: "2rem",
              textAlign: "center",
              cursor: "pointer",
              background: dragOver ? "var(--surface-2)" : "transparent",
              transition: "background 0.15s",
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 6 }}>📂</div>
            <div style={{ fontWeight: 500, fontSize: 14 }}>Click to browse or drag & drop</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>CSV files only · Max 500 hotels</div>
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
              <span>Error:</span><span>{fileError}</span>
            </div>
          )}
          <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
            <button className="s9-btn" onClick={downloadCSVTemplate}>⬇ Download template</button>
            {rows.length > 0 && (
              <button className="s9-btn" onClick={reset}>✕ Clear</button>
            )}
          </div>
        </div>
      </div>

      {/* Preview table */}
      {rows.length > 0 && (
        <div className="s9-card">
          <div className="s9-card-head" style={{ justifyContent: "space-between" }}>
            <div className="s9-card-title">Preview</div>
            <span className="s9-badge s9-badge-green">{rows.length} hotels</span>
          </div>
          <div className="s9-card-body" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={thStyle}>#</th>
                  {previewCols.map((c) => <th key={c} style={thStyle}>{c}</th>)}
                  <th style={thStyle}>status</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{i + 1}</td>
                    {previewCols.map((c) => (
                      <td key={c} style={{ ...tdStyle, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={row[c]}>
                        {row[c] || "—"}
                      </td>
                    ))}
                    <td style={tdStyle}>
                      {progress[i] ? <ProgressBadge status={progress[i].status} /> : <ProgressBadge status="pending" />}
                    </td>
                  </tr>
                ))}
                {rows.length > 10 && (
                  <tr>
                    <td colSpan={previewCols.length + 2} style={{ ...tdStyle, color: "var(--muted)" }}>
                      … and {rows.length - 10} more rows
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary bar */}
          {summary.done + summary.failed > 0 && (
            <div style={{ padding: "10px 16px", fontSize: 13, display: "flex", gap: 16, borderTop: "1px solid var(--border)" }}>
              <span style={{ color: "var(--success)" }}>✓ {summary.done} done</span>
              {summary.failed > 0 && <span style={{ color: "var(--danger)" }}>✗ {summary.failed} failed</span>}
              {summary.pending > 0 && <span style={{ color: "var(--muted)" }}>⏳ {summary.pending} pending</span>}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ padding: "12px 16px", display: "flex", gap: 10, borderTop: "1px solid var(--border)" }}>
            {!importing ? (
              <button
                className="s9-btn s9-btn-primary"
                onClick={importAll}
                disabled={rows.length === 0}
                style={{ minWidth: 160 }}
              >
                ☁ Import {rows.length} hotels
              </button>
            ) : (
              <button className="s9-btn s9-btn-red" onClick={abort}>
                ✕ Stop import
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle = { padding: "8px 10px", textAlign: "left", fontWeight: 500, fontSize: 12, color: "var(--muted)", borderBottom: "1px solid var(--border)", background: "var(--surface-2)", whiteSpace: "nowrap" };
const tdStyle = { padding: "7px 10px", borderBottom: "1px solid var(--border)", fontSize: 12 };

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AddHotelPage() {
  const [activeTab, setActiveTab] = useState("single"); // "single" | "csv"
  const [tier, setTier] = useState("1");
  const { loading, result, save, clearResult } = useAddHotel();

  // Controlled form state
  const [form, setForm] = useState({
    name: "", slug: "", description: "", phone: "", website: "",
    amenities: "", google_place_id: "", google_maps_url: "",
    property_types: "", address: "", city_id: "", state_id: "",
    country_id: "", image: "", latitude: "", longitude: "",
    price_start_from: "", rating: "5", status: "active",
    extra_images: "",
  });

  const set = (field) => (e) => {
    clearResult();
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = () => save(form);

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", width: "fit-content" }}>
        {[["single", "➕ Add Hotel"], ["csv", "📤 Bulk CSV Import"]].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              padding: "8px 20px", fontSize: 13, border: "none", cursor: "pointer",
              background: activeTab === key ? "var(--surface-2)" : "transparent",
              fontWeight: activeTab === key ? 500 : 400,
              borderRight: key === "single" ? "1px solid var(--border)" : "none",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── SINGLE HOTEL FORM ── */}
      {activeTab === "single" && (
        <div>
          <div className="s9-alert s9-alert-green">
            <span>Info:</span>
            <span>
              Fill in the hotel details below. Tier 1 hotels require a channel manager API connection.
              Tier 2 hotels get an extranet login. Tier 3 is managed manually by your team.
            </span>
          </div>

          <div className="s9-two-col">
            {/* Left column */}
            <div>
              {/* Basic Info */}
              <div className="s9-card">
                <div className="s9-card-head"><div className="s9-card-title">Basic Information</div></div>
                <div className="s9-card-body">
                  <div className="s9-form-row full">
                    <div className="s9-form-group">
                      <label className="s9-label">Hotel Name *</label>
                      <input className="s9-input" type="text" placeholder="e.g. Eko Suites & Towers" value={form.name} onChange={set("name")} />
                    </div>
                  </div>
                  <div className="s9-form-row full">
                    <div className="s9-form-group">
                      <label className="s9-label">Slug (auto-generated)</label>
                      <input className="s9-input" type="text" placeholder="eko-suites-towers" value={form.slug} onChange={set("slug")} />
                    </div>
                  </div>
                  <div className="s9-form-row">
                    <div className="s9-form-group">
                      <label className="s9-label">City ID</label>
                      <input className="s9-input" type="number" placeholder="e.g. 1" value={form.city_id} onChange={set("city_id")} />
                    </div>
                    <div className="s9-form-group">
                      <label className="s9-label">State ID</label>
                      <input className="s9-input" type="number" placeholder="e.g. 1" value={form.state_id} onChange={set("state_id")} />
                    </div>
                  </div>
                  <div className="s9-form-row">
                    <div className="s9-form-group">
                      <label className="s9-label">Country ID</label>
                      <input className="s9-input" type="number" placeholder="e.g. 1" value={form.country_id} onChange={set("country_id")} />
                    </div>
                    <div className="s9-form-group">
                      <label className="s9-label">Property Type</label>
                      <input className="s9-input" type="text" placeholder="hotel, resort..." value={form.property_types} onChange={set("property_types")} />
                    </div>
                  </div>
                  <div className="s9-form-row full">
                    <div className="s9-form-group">
                      <label className="s9-label">Full Address</label>
                      <input className="s9-input" type="text" placeholder="Street address" value={form.address} onChange={set("address")} />
                    </div>
                  </div>
                  <div className="s9-form-row">
                    <div className="s9-form-group">
                      <label className="s9-label">Phone Number</label>
                      <input className="s9-input" type="tel" placeholder="+234..." value={form.phone} onChange={set("phone")} />
                    </div>
                    <div className="s9-form-group">
                      <label className="s9-label">Website</label>
                      <input className="s9-input" type="url" placeholder="https://" value={form.website} onChange={set("website")} />
                    </div>
                  </div>
                  <div className="s9-form-row">
                    <div className="s9-form-group">
                      <label className="s9-label">Latitude</label>
                      <input className="s9-input" type="number" step="0.00000001" placeholder="6.45306" value={form.latitude} onChange={set("latitude")} />
                    </div>
                    <div className="s9-form-group">
                      <label className="s9-label">Longitude</label>
                      <input className="s9-input" type="number" step="0.00000001" placeholder="3.39583" value={form.longitude} onChange={set("longitude")} />
                    </div>
                  </div>
                  <div className="s9-form-row">
                    <div className="s9-form-group">
                      <label className="s9-label">Google Place ID</label>
                      <input className="s9-input" type="text" placeholder="ChIJ..." value={form.google_place_id} onChange={set("google_place_id")} />
                    </div>
                    <div className="s9-form-group">
                      <label className="s9-label">Google Maps URL</label>
                      <input className="s9-input" type="url" placeholder="https://maps.google.com/..." value={form.google_maps_url} onChange={set("google_maps_url")} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Integration Tier */}
              <div className="s9-card">
                <div className="s9-card-head"><div className="s9-card-title">Integration Tier</div></div>
                <div className="s9-card-body">
                  <div className="s9-form-row full">
                    <div className="s9-form-group">
                      <label className="s9-label">Integration Tier</label>
                      <select className="s9-input" value={tier} onChange={(e) => setTier(e.target.value)}>
                        <option value="1">Tier 1 - API Connected (Channel Manager / PMS)</option>
                        <option value="2">Tier 2 - Extranet (Manual dashboard login)</option>
                        <option value="3">Tier 3 - Manual (Staff-managed)</option>
                      </select>
                    </div>
                  </div>
                  {tier === "1" && (
                    <>
                      <div className="s9-form-row">
                        <div className="s9-form-group">
                          <label className="s9-label">Channel Manager</label>
                          <select className="s9-input"><option>Channex</option><option>OTA Sync</option><option>Direct PMS API</option></select>
                        </div>
                        <div className="s9-form-group">
                          <label className="s9-label">API Key</label>
                          <input className="s9-input" type="password" placeholder="..." />
                        </div>
                      </div>
                      <div className="s9-form-row full">
                        <div className="s9-form-group">
                          <label className="s9-label">Property ID</label>
                          <input className="s9-input" type="text" placeholder="PROP-12345" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div>
              {/* Media & Details */}
              <div className="s9-card">
                <div className="s9-card-head"><div className="s9-card-title">Media & Details</div></div>
                <div className="s9-card-body">
                  <div className="s9-form-row">
                    <div className="s9-form-group">
                      <label className="s9-label">Star Rating</label>
                      <select className="s9-input" value={form.rating} onChange={set("rating")}>
                        <option value="1">1 Star</option><option value="2">2 Stars</option>
                        <option value="3">3 Stars</option><option value="4">4 Stars</option>
                        <option value="5">5 Stars</option>
                      </select>
                    </div>
                    <div className="s9-form-group">
                      <label className="s9-label">Price From (₦)</label>
                      <input className="s9-input" type="number" placeholder="e.g. 25000" value={form.price_start_from} onChange={set("price_start_from")} />
                    </div>
                  </div>
                  <div className="s9-form-row full">
                    <div className="s9-form-group">
                      <label className="s9-label">Description</label>
                      <textarea className="s9-input" rows={3} placeholder="Brief description of the hotel..." value={form.description} onChange={set("description")} />
                    </div>
                  </div>
                  <div className="s9-form-row full">
                    <div className="s9-form-group">
                      <label className="s9-label">Amenities</label>
                      <input className="s9-input" type="text" placeholder="WiFi, Pool, Gym, Restaurant, Bar..." value={form.amenities} onChange={set("amenities")} />
                    </div>
                  </div>
                  <div className="s9-form-row full">
                    <div className="s9-form-group">
                      <label className="s9-label">Cover Photo URL</label>
                      <input className="s9-input" type="url" placeholder="https://..." value={form.image} onChange={set("image")} />
                    </div>
                  </div>
                  <div className="s9-form-row full">
                    <div className="s9-form-group">
                      <label className="s9-label">Extra Image URLs (one per line → hotel_images table)</label>
                      <textarea className="s9-input" rows={2} placeholder={"https://img1.jpg\nhttps://img2.jpg"} value={form.extra_images} onChange={set("extra_images")} />
                    </div>
                  </div>
                  <div className="s9-form-row">
                    <div className="s9-form-group">
                      <label className="s9-label">Status</label>
                      <select className="s9-input" value={form.status} onChange={set("status")}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "var(--muted)" }}>Published on site:</span>
                    <Toggle defaultChecked />
                  </div>
                </div>
              </div>

              {/* Commission (UI only — not in hotels table, kept as-is) */}
              <div className="s9-card">
                <div className="s9-card-head"><div className="s9-card-title">Commission</div></div>
                <div className="s9-card-body">
                  <div className="s9-form-row full">
                    <div className="s9-form-group">
                      <label className="s9-label">Stay9ja Commission (%)</label>
                      <input className="s9-input" type="number" defaultValue={15} min={0} max={30} />
                    </div>
                  </div>
                  <div className="s9-form-row full">
                    <div className="s9-form-group">
                      <label className="s9-label">Payout Method</label>
                      <select className="s9-input">
                        <option>Bank Transfer (GTBank)</option>
                        <option>Bank Transfer (First Bank)</option>
                        <option>Paystack Transfer</option>
                        <option>Flutterwave Transfer</option>
                      </select>
                    </div>
                  </div>
                  <div className="s9-form-row full">
                    <div className="s9-form-group">
                      <label className="s9-label">Account Number</label>
                      <input className="s9-input" type="text" placeholder="0123456789" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status feedback */}
              <StatusBar result={result} />

              <button
                className="s9-btn s9-btn-primary"
                style={{ width: "100%", padding: 12, fontSize: 14, marginTop: 12 }}
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving…" : "Save Hotel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CSV IMPORT TAB ── */}
      {activeTab === "csv" && <CSVImportTab />}
    </div>
  );
}