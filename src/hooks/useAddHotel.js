import { API_BASE } from "../config/api";
import { useState, useRef, useMemo, useCallback } from "react";
import Papa from "papaparse";

const API_URL = `${API_BASE}/admin/addHotel`;
// ⚠️ Ye endpoint meri guess hai. Backend ka asli update URL/method yahan daalo.
const UPDATE_URL = (id) => `${API_BASE}/admin/updateHotel/${id}`;

/* ---------------- TOKEN ---------------- */
const getToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("accessToken") ||
  localStorage.getItem("adminToken");

/* ---------------- SLUG ---------------- */
function buildSlug(name = "") {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/* ---------------- HELPERS ---------------- */
const toInt = (v) => {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? null : n;
};

const toFloat = (v) => {
  const n = parseFloat(v);
  return Number.isNaN(n) ? null : n;
};

// Single form sends 1/0, so CSV is normalised to the same format.
// If your backend expects "active"/"inactive" strings, change this.
const toStatus = (v) => {
  if (v === 1 || v === "1" || String(v).toLowerCase() === "active") return 1;
  if (v === 0 || v === "0" || String(v).toLowerCase() === "inactive") return 0;
  return 1;
};

/* ---------------- PAYLOAD (CSV rows) ---------------- */
function buildPayload(data) {
  const errors = [];

  if (!data.name) errors.push("Hotel name required");
  if (!data.city_id) errors.push("city_id required");
  if (!data.state_id) errors.push("state_id required");
  if (!data.country_id) errors.push("country_id required");

  const rawImages = data.images || data.extra_images;

  const payload = {
    name: data.name,
    slug: data.slug || buildSlug(data.name),

    description: data.description || null,
    phone: data.phone || null,
    website: data.website || null,
    amenities: data.amenities || null,

    google_place_id: data.google_place_id || null,
    google_maps_url: data.google_maps_url || null,
    property_types: data.property_types || null,
    address: data.address || null,

    city_id: toInt(data.city_id),
    state_id: toInt(data.state_id),
    country_id: toInt(data.country_id),

    image: data.image || null,
    latitude: toFloat(data.latitude),
    longitude: toFloat(data.longitude),
    price_start_from: toFloat(data.price_start_from),
    rating: toFloat(data.rating) ?? 0,

    status: toStatus(data.status),

    // component ka single form `extra_images` bhejta hai; backend jo naam
    // leta hai wahi rakhna (images ya extra_images)
    images: rawImages
      ? String(rawImages)
          .split("|")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
  };

  return { payload, errors };
}

/* =========================
   1. SINGLE HOTEL HOOK
========================= */
export function useAddHotel() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const clearResult = useCallback(() => setResult(null), []);

  const send = async (url, method, payload) => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      setResult({
        success: res.ok,
        message: data.message || (res.ok ? "Saved" : "Failed to save"),
      });
      return res.ok;
    } catch (e) {
      setResult({ success: false, message: e.message });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const save = (payload) => send(API_URL, "POST", payload);
  const update = (id, payload) => send(UPDATE_URL(id), "PUT", payload);

  return { loading, result, save, update, clearResult };
}

/* =========================
   2. CSV IMPORT HOOK
========================= */
export function useCSVImport() {
  const [rows, setRows] = useState([]);
  const [progress, setProgress] = useState([]);
  const [importing, setImporting] = useState(false);
  const abortRef = useRef(false);

  const summary = useMemo(
    () => ({
      total: progress.length,
      done: progress.filter((p) => p.status === "success").length,
      failed: progress.filter((p) => p.status === "error").length,
      pending: progress.filter((p) => p.status === "pending").length,
    }),
    [progress]
  );

  const loadFile = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const parsed = Papa.parse(e.target.result, {
          header: true,
          skipEmptyLines: true,
        });

        const data = (parsed.data || []).slice(0, 500);

        setRows(data);
        setProgress(
          data.map((r) => ({
            name: r.name || "Unknown",
            status: "pending",
            msg: "",
          }))
        );

        resolve(data);
      };

      reader.onerror = () => reject("File error");
      reader.readAsText(file);
    });

  const updateRow = (i, patch) =>
    setProgress((p) => p.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));

  const importAll = async () => {
    abortRef.current = false;
    setImporting(true);

    for (let i = 0; i < rows.length; i++) {
      if (abortRef.current) break;

      const { payload, errors } = buildPayload(rows[i]);

      if (errors.length) {
        updateRow(i, { status: "error", msg: errors.join(", ") });
        continue;
      }

      updateRow(i, { status: "loading" });

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));

        updateRow(i, {
          status: res.ok ? "success" : "error",
          msg: data.message || (res.ok ? "Done" : "Failed"),
        });
      } catch (e) {
        updateRow(i, { status: "error", msg: e.message });
      }
    }

    setImporting(false);
  };

  const reset = () => {
    setRows([]);
    setProgress([]);
    abortRef.current = false;
  };

  const abort = () => {
    abortRef.current = true;
  };

  return {
    rows,
    progress,
    importing,
    summary,
    loadFile,
    importAll,
    reset,
    abort,
  };
}

/* =========================
   3. CSV TEMPLATE
========================= */
export function downloadCSVTemplate() {
  const cols = [
    "name", "slug", "description", "phone", "website", "amenities",
    "google_place_id", "google_maps_url", "property_types",
    "address", "city_id", "state_id", "country_id", "image",
    "latitude", "longitude", "price_start_from", "rating", "status",
    "extra_images",
  ].join(",");

  const sample = [
    "Eko Hotel", "eko-hotel", "Luxury hotel", "+123", "https://example.com",
    "WiFi|Pool", "CHIJXXX", "https://maps.google.com", "hotel",
    "Address", "1", "1", "1", "https://img.jpg",
    "6.4", "3.4", "45000", "4.5", "active",
    "https://img1.jpg|https://img2.jpg",
  ].join(",");

  const blob = new Blob([cols + "\n" + sample], { type: "text/csv" });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "hotel_template.csv";
  a.click();
  URL.revokeObjectURL(a.href);
}