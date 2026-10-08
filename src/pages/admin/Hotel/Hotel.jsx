import React, { useEffect, useState, useRef } from 'react'
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://dhunobeats.com";

// ─── Field Config ─────────────────────────────────────────────────────────────
const HOTEL_FIELDS = [
  { name: "name",             label: "Hotel Name",        required: true },
  { name: "slug",             label: "Slug" },
  { name: "description",      label: "Description",       textarea: true },
  { name: "address",          label: "Address",           textarea: true },
  { name: "city_id",          label: "City ID",           type: "number", required: true },
  { name: "state_id",         label: "State ID",          type: "number", required: true },
  { name: "country_id",       label: "Country ID",        type: "number", required: true },
  { name: "latitude",         label: "Latitude",          type: "number" },
  { name: "longitude",        label: "Longitude",         type: "number" },
  { name: "price_start_from", label: "Price Start From",  type: "number", required: true },
  { name: "rating",           label: "Rating (0–5)",      type: "number" },
  { name: "phone",            label: "Phone" },
  { name: "website",          label: "Website URL" },
  { name: "amenities",        label: "Amenities" },
  { name: "google_place_id",  label: "Google Place ID" },
  { name: "google_maps_url",  label: "Google Maps URL" },
  { name: "property_types",   label: "Property Types" },
];

const EMPTY_FORM = {
  name: "", slug: "", description: "", address: "",
  city_id: "", state_id: "", country_id: "",
  latitude: "", longitude: "", price_start_from: "",
  rating: "", status: "active",
  phone: "", website: "", amenities: "",
  google_place_id: "", google_maps_url: "", property_types: "",
};

// ─── Toast Notification ───────────────────────────────────────────────────────
function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: "bg-green-600 text-white",
    error:   "bg-red-600 text-white",
  };

  const icons = {
    success: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  };

  return (
    <div
      className={`fixed top-5 right-5 z-[999999] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-medium max-w-sm animate-slide-in ${styles[type]}`}
      style={{ animation: "slideIn 0.3s ease" }}
    >
      {icons[type]}
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 opacity-70 hover:opacity-100 transition text-lg leading-none"
      >
        &times;
      </button>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Image Preview Component ──────────────────────────────────────────────────
function ImageThumb({ src, onRemove, label }) {
  return (
    <div className="relative group w-20 h-20 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0">
      <img src={src} alt={label} className="w-full h-full object-cover" />
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute inset-0 bg-black/60 text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          &times;
        </button>
      )}
      {label && (
        <span className="absolute bottom-0 left-0 right-0 text-center text-white text-[9px] bg-black/50 py-0.5">
          {label}
        </span>
      )}
    </div>
  );
}

// ─── Add Image Button ─────────────────────────────────────────────────────────
function AddImageButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition bg-gray-50 dark:bg-gray-800 flex-shrink-0"
    >
      <span className="text-2xl text-gray-300 dark:text-gray-600 leading-none">+</span>
      <span className="text-[9px] text-gray-400 mt-0.5">Add</span>
    </button>
  );
}

// ─── Field Error ──────────────────────────────────────────────────────────────
function FieldError({ errors, name }) {
  if (!errors?.[name]) return null;
  const msgs = Array.isArray(errors[name]) ? errors[name] : [errors[name]];
  return (
    <div className="mt-1 space-y-0.5">
      {msgs.map((msg, i) => (
        <p key={i} className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
          <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {msg}
        </p>
      ))}
    </div>
  );
}

// ─── Add / Edit Hotel Modal ───────────────────────────────────────────────────
function HotelModal({ onClose, onSuccess, editData = null }) {
  const isEdit = !!editData;
  const sanitized = isEdit
    ? Object.fromEntries(
        Object.entries({ ...EMPTY_FORM, ...editData }).map(([k, v]) => [k, v ?? ""])
      )
    : EMPTY_FORM;
  const [form, setForm] = useState(sanitized);
  const [mainImage, setMainImage]     = useState(null);
  const [mainPreview, setMainPreview] = useState(
    editData?.image ? `${BASE_URL}/storage/app/public/${editData.image}` : null
  );
  const [galleryFiles, setGalleryFiles]       = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState(null);
  const [fieldErrors, setFieldErrors] = useState({}); // ← API validation errors
  const mainRef    = useRef(null);
  const galleryRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    }
  };

  const handleMainImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setError("Main image must be under 2MB."); return; }
    setMainImage(file);
    setMainPreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleGalleryAdd = (e) => {
    const files = Array.from(e.target.files);
    const oversized = files.filter(f => f.size > 2 * 1024 * 1024);
    if (oversized.length) { setError(`${oversized.length} file(s) exceed 2MB limit.`); return; }
    setGalleryFiles(prev => [...prev, ...files]);
    setGalleryPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    setError(null);
    e.target.value = "";
  };

  const removeGallery = (i) => {
    setGalleryFiles(prev => prev.filter((_, idx) => idx !== i));
    setGalleryPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setFieldErrors({});
    try {
      const token = localStorage.getItem("token");
      const url = isEdit
        ? `${BASE_URL}/api/admin/updateHotel/${editData.id}`
        : `${BASE_URL}/api/admin/addHotel`;

      const formData = new FormData();

      Object.entries(form).forEach(([key, val]) => {
        if (val !== "" && val !== null && val !== undefined) {
          formData.append(key, val);
        }
      });

      if (mainImage) formData.append("image", mainImage);
      galleryFiles.forEach(file => formData.append("images[]", file));
      if (isEdit) formData.append("_method", "PUT");

      const response = await fetch(url, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();

      if (result.status === true) {
        onSuccess(isEdit ? "Hotel successfully updated!" : "Hotel successfully added!");
        onClose();
      } else {
        // ── Handle Laravel validation errors (422 style) ──
        if (result.errors && typeof result.errors === "object") {
          setFieldErrors(result.errors);
          setError("Please fix the errors below.");
        } else {
          setError(result.message || "Failed to save hotel.");
        }
      }
    } catch (err) {
      setError("API error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const hasFieldError = (name) => !!fieldErrors?.[name];

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {isEdit ? "Edit Hotel" : "Add New Hotel"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none transition"
          >
            &times;
          </button>
        </div>

        {/* General error banner */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* ── Text Fields ── */}
          {HOTEL_FIELDS.map(({ name, label, required, type, textarea }) => (
            <div key={name} className={textarea ? "sm:col-span-2" : ""}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {textarea ? (
                <textarea
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  rows={2}
                  className={`w-full border rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 resize-none transition ${
                    hasFieldError(name)
                      ? "border-red-400 dark:border-red-500 focus:ring-red-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                  }`}
                />
              ) : (
                <input
                  type={type || "text"}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required={required}
                  step={type === "number" ? "any" : undefined}
                  className={`w-full border rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 transition ${
                    hasFieldError(name)
                      ? "border-red-400 dark:border-red-500 focus:ring-red-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                  }`}
                />
              )}
              <FieldError errors={fieldErrors} name={name} />
            </div>
          ))}

          {/* ── Status ── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* ── Main / Cover Image ── */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Main Cover Image
            </label>
            <div className="flex items-start gap-4">
              {mainPreview ? (
                <ImageThumb
                  src={mainPreview}
                  label="Cover"
                  onRemove={() => { setMainImage(null); setMainPreview(null); }}
                />
              ) : (
                <AddImageButton onClick={() => mainRef.current?.click()} />
              )}
              <div className="text-xs text-gray-400 dark:text-gray-500 pt-1 space-y-0.5">
                <p>JPG, PNG, WEBP accepted</p>
                <p>Max size: 2MB</p>
                {!mainPreview && (
                  <button
                    type="button"
                    onClick={() => mainRef.current?.click()}
                    className="mt-1 text-blue-500 hover:underline text-xs"
                  >
                    Browse file
                  </button>
                )}
              </div>
              <input
                ref={mainRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleMainImage}
              />
            </div>
            <FieldError errors={fieldErrors} name="image" />
          </div>

          {/* ── Gallery Images ── */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gallery Images
              <span className="ml-1 text-xs font-normal text-gray-400">(multiple select kar sakte ho)</span>
            </label>
            <div className="flex flex-wrap gap-3 items-start">
              {galleryPreviews.map((src, i) => (
                <ImageThumb
                  key={i}
                  src={src}
                  label={`Photo ${i + 1}`}
                  onRemove={() => removeGallery(i)}
                />
              ))}
              <AddImageButton onClick={() => galleryRef.current?.click()} />
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              {galleryFiles.length > 0
                ? `${galleryFiles.length} image(s) selected`
                : "Koi gallery image select nahi hui"}
            </p>
            <input
              ref={galleryRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleGalleryAdd}
            />
          </div>

          {/* ── Action Buttons ── */}
          <div className="sm:col-span-2 flex justify-end gap-3 mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50 flex items-center gap-2"
            >
              {saving && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              )}
              {saving ? "Saving..." : isEdit ? "Update Hotel" : "Add Hotel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({ hotel, onClose, onSuccess }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError]       = useState(null);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/admin/deleteHotel/${hotel.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (result.status === true) {
        onSuccess(`"${hotel.name}" successfully deleted!`);
        onClose();
      } else {
        setError(result.message || "Failed to delete.");
      }
    } catch (err) {
      setError("API error: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="text-center mb-5">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Delete Hotel</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Are you sure you want to delete <strong className="text-gray-700 dark:text-gray-300">"{hotel.name}"</strong>? This cannot be undone.
          </p>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg text-sm text-center">
            {error}
          </div>
        )}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 px-4 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {deleting && (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
            )}
            {deleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CSV Import Modal ─────────────────────────────────────────────────────────
function CsvImportModal({ onClose, onSuccess }) {
  const fileRef = useRef(null);
  const [rows, setRows]           = useState([]);
  const [parsed, setParsed]       = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [results, setResults]     = useState(null);
  const [error, setError]         = useState(null);

  const CSV_HEADERS = [
    "name","slug","description","address",
    "city_id","state_id","country_id",
    "latitude","longitude","price_start_from","rating","status",
    "phone","website","amenities",
    "google_place_id","google_maps_url","property_types",
  ];

  const parseCSV = (text) => {
    const lines = text.trim().split("\n").filter(Boolean);
    if (lines.length < 2) {
      setError("CSV mein header row aur kam se kam ek data row honi chahiye.");
      return;
    }
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/"/g, "").replace(/\s+/g, "_"));
    const data = lines.slice(1).map(line => {
      const vals = [];
      let cur = "", inQuotes = false;
      for (const ch of line) {
        if (ch === '"') { inQuotes = !inQuotes; continue; }
        if (ch === ',' && !inQuotes) { vals.push(cur.trim()); cur = ""; continue; }
        cur += ch;
      }
      vals.push(cur.trim());
      const obj = {};
      headers.forEach((h, i) => { obj[h] = (vals[i] || "").trim(); });
      return obj;
    });
    setRows(data);
    setParsed(true);
    setError(null);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => parseCSV(ev.target.result);
    reader.readAsText(file, "latin1");
  };

  const handleImport = async () => {
    setImporting(true);
    setResults(null);
    setProgress(0);
    const token = localStorage.getItem("token");
    let success = 0, failed = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const res = await fetch(`${BASE_URL}/api/admin/addHotel`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(row),
        });
        const result = await res.json();
        result.status === true ? success++ : failed++;
      } catch {
        failed++;
      }
      setProgress(Math.round(((i + 1) / rows.length) * 100));
    }

    setResults({ success, failed });
    setImporting(false);
    if (success > 0) onSuccess(`${success} hotel(s) successfully imported!`);
  };

  const downloadTemplate = () => {
    const csv = CSV_HEADERS.join(",") + "\nSample Hotel,sample-hotel,A great hotel,123 Main St,1,1,1,28.6139,77.2090,2500.00,4.5,active,9876543210,https://example.com,WiFi,ChIJxxx,https://maps.google.com,lodging";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "hotel_template.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Import Hotels via CSV</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg text-xs text-blue-700 dark:text-blue-300 overflow-x-auto">
          <p className="font-medium mb-1">Required columns:</p>
          <code className="font-mono">{CSV_HEADERS.join(", ")}</code>
        </div>

        <button
          onClick={downloadTemplate}
          className="mb-4 text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          ↓ Download CSV Template
        </button>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        {!parsed ? (
          <div
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 transition"
            onClick={() => fileRef.current?.click()}
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Click to select CSV file</p>
            <p className="text-gray-400 text-xs mt-1">Encoding: latin1 / UTF-8</p>
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
          </div>
        ) : (
          <div>
            <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Parsed <strong>{rows.length}</strong> hotel(s) from CSV
            </div>

            <div className="max-h-44 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg mb-4">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                  <tr>
                    {["#", "name", "city_id", "price_start_from", "status"].map(h => (
                      <th key={h} className="px-3 py-2 text-left text-gray-600 dark:text-gray-400 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                      {["name", "city_id", "price_start_from", "status"].map(h => (
                        <td key={h} className="px-3 py-2 text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
                          {row[h] || "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {importing && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Importing...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {results && (
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm flex items-center gap-4">
                <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {results.success} imported
                </span>
                {results.failed > 0 && (
                  <span className="text-red-500 dark:text-red-400 font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {results.failed} failed
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            {results ? "Close" : "Cancel"}
          </button>
          {parsed && !results && (
            <button
              onClick={handleImport}
              disabled={importing}
              className="px-5 py-2 text-sm rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition disabled:opacity-50 flex items-center gap-2"
            >
              {importing && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              )}
              {importing ? `Importing ${progress}%...` : `Import ${rows.length} Hotel(s)`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Hotels Table ─────────────────────────────────────────────────────────────
function HotelsTable({ data, onEdit, onDelete }) {
  if (!data.length) return (
    <div className="py-14 text-center">
      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <p className="text-gray-400 dark:text-gray-500 text-sm">No hotels found.</p>
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            {["ID", "Name", "City ID", "Phone", "Price From", "Rating", "Status", "Actions"].map(c => (
              <th key={c} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((hotel, i) => (
            <tr
              key={hotel.id ?? i}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td className="px-4 py-3 text-gray-400 dark:text-gray-500 text-xs">{hotel.id}</td>

              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {hotel.image && (
                    <img
                      src={`${BASE_URL}/storage/app/public/${hotel.image}`}
                      alt={hotel.name}
                      className="w-8 h-8 rounded-lg object-cover flex-shrink-0 border border-gray-200 dark:border-gray-700"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <span className="font-medium text-gray-800 dark:text-white max-w-[160px] truncate">
                    {hotel.name}
                  </span>
                </div>
              </td>

              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{hotel.city_id ?? "—"}</td>

              <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">
                {hotel.phone ?? "—"}
              </td>

              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                {hotel.price_start_from
                  ? `₹${Number(hotel.price_start_from).toLocaleString()}`
                  : "—"}
              </td>

              <td className="px-4 py-3">
                {hotel.rating ? (
                  <span className="inline-flex items-center gap-1 text-amber-500 font-medium text-xs">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    {hotel.rating}
                  </span>
                ) : "—"}
              </td>

              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  hotel.status === "active"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                    : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                }`}>
                  {hotel.status ?? "—"}
                </span>
              </td>

              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(hotel)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition font-medium whitespace-nowrap"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(hotel)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition font-medium whitespace-nowrap"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ currentPage, totalPages, onChange }) {
  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
    if (currentPage >= totalPages - 3) return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  return (
    <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
      <button
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        ← Prev
      </button>
      <div className="flex items-center gap-1">
        {getPages().map((page, idx) =>
          page === "..." ? (
            <span key={`e-${idx}`} className="px-2 py-1.5 text-sm text-gray-400">…</span>
          ) : (
            <button
              key={page}
              onClick={() => onChange(page)}
              className={`min-w-[34px] px-3 py-1.5 text-sm rounded-lg font-medium transition ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>
      <button
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        Next →
      </button>
    </div>
  );
}

// ─── Main Hotel Page ──────────────────────────────────────────────────────────
function Hotel() {
  const [hotels, setHotels]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [editHotel, setEditHotel]       = useState(null);
  const [deleteHotel, setDeleteHotel]   = useState(null);
  const [searchQuery, setSearchQuery]   = useState("");
  const [currentPage, setCurrentPage]   = useState(1);

  // ── Toast state ──
  const [toast, setToast] = useState(null); // { message, type }
  const showToast = (message, type = "success") => setToast({ message, type });
  const hideToast = () => setToast(null);

  const ROWS_PER_PAGE = 10;
  const navigate = useNavigate();

  const fetchHotels = async (successMsg = null) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/admin/hotelData`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (result.status === true) {
        setHotels(result.data);
        if (successMsg) showToast(successMsg);
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError("API error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHotels(); }, []);

  const filteredHotels = hotels.filter(h => {
    const q = searchQuery.toLowerCase();
    return (
      String(h.name           ?? "").toLowerCase().includes(q) ||
      String(h.city_id        ?? "").toLowerCase().includes(q) ||
      String(h.status         ?? "").toLowerCase().includes(q) ||
      String(h.rating         ?? "").toLowerCase().includes(q) ||
      String(h.phone          ?? "").toLowerCase().includes(q) ||
      String(h.address        ?? "").toLowerCase().includes(q) ||
      String(h.property_types ?? "").toLowerCase().includes(q)
    );
  });

  const totalPages      = Math.max(1, Math.ceil(filteredHotels.length / ROWS_PER_PAGE));
  const paginatedHotels = filteredHotels.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      <PageMeta title="Hotels | Admin Dashboard" description="Hotels management" />
      <PageBreadcrumb pageTitle="Hotels" />

      {/* ── Global Toast ── */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      {/* ── Modals ── */}
      {showAddModal && (
        <HotelModal
          onClose={() => setShowAddModal(false)}
          onSuccess={(msg) => fetchHotels(msg)}
        />
      )}
      {showCsvModal && (
        <CsvImportModal
          onClose={() => setShowCsvModal(false)}
          onSuccess={(msg) => fetchHotels(msg)}
        />
      )}
      {editHotel && (
        <HotelModal
          editData={editHotel}
          onClose={() => setEditHotel(null)}
          onSuccess={(msg) => fetchHotels(msg)}
        />
      )}
      {deleteHotel && (
        <DeleteModal
          hotel={deleteHotel}
          onClose={() => setDeleteHotel(null)}
          onSuccess={(msg) => fetchHotels(msg)}
        />
      )}

      <div className="space-y-6">
        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            onClick={() => setShowCsvModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Hotel
          </button>
        </div>

        <ComponentCard title="Hotels List">
          {/* Search + Count */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="relative w-full max-w-sm">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search by name, city, phone, status..."
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 py-2 pl-9 pr-4 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredHotels.length === 0
                ? "No results"
                : `Showing ${(currentPage - 1) * ROWS_PER_PAGE + 1}–${Math.min(currentPage * ROWS_PER_PAGE, filteredHotels.length)} of ${filteredHotels.length} hotels`}
            </span>
          </div>

          {loading ? (
            <div className="py-14 flex flex-col items-center gap-3 text-gray-400">
              <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              <span className="text-sm">Loading hotels...</span>
            </div>
          ) : error ? (
            <div className="py-10 text-center text-red-500 text-sm">{error}</div>
          ) : (
            <HotelsTable
              data={paginatedHotels}
              onEdit={setEditHotel}
              onDelete={setDeleteHotel}
            />
          )}

          {!loading && !error && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onChange={setCurrentPage}
            />
          )}
        </ComponentCard>
      </div>
    </>
  );
}

export default Hotel;