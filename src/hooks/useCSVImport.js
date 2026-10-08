import { useState, useRef, useMemo } from "react";
import Papa from "papaparse";

const API_URL = "https://dhunobeats.com/api/admin/addHotel";

function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("adminToken")
  );
}

function buildPayload(data) {
  return {
    name: data.name,
    slug: data.slug,
    description: data.description,
    phone: data.phone,
    website: data.website,
    amenities: data.amenities,
    address: data.address,
    city_id: Number(data.city_id) || null,
    state_id: Number(data.state_id) || null,
    country_id: Number(data.country_id) || null,
    image: data.image,
    latitude: Number(data.latitude) || null,
    longitude: Number(data.longitude) || null,
    price_start_from: Number(data.price_start_from) || null,
    rating: Number(data.rating) || 0,
    status: data.status || "active",
    images: data.images ? data.images.split("|") : [],
  };
}

export function useCSVImport() {
  const [rows, setRows] = useState([]);
  const [progress, setProgress] = useState([]);
  const [importing, setImporting] = useState(false);
  const stopRef = useRef(false);

  const summary = useMemo(() => {
    return {
      total: progress.length,
      done: progress.filter((p) => p.status === "success").length,
      failed: progress.filter((p) => p.status === "error").length,
      pending: progress.filter((p) => p.status === "pending").length,
    };
  }, [progress]);

  const loadFile = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const parsed = Papa.parse(e.target.result, {
          header: true,
          skipEmptyLines: true,
        });

        const data = parsed.data || [];

        setRows(data);
        setProgress(
          data.map((r) => ({
            name: r.name,
            status: "pending",
            msg: "",
          }))
        );

        resolve(data);
      };

      reader.readAsText(file);
    });

  const importAll = async () => {
    setImporting(true);
    stopRef.current = false;

    for (let i = 0; i < rows.length; i++) {
      if (stopRef.current) break;

      const payload = buildPayload(rows[i]);

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

        setProgress((prev) =>
          prev.map((p, idx) =>
            idx === i
              ? {
                  ...p,
                  status: res.ok ? "success" : "error",
                  msg: data.message || "failed",
                }
              : p
          )
        );
      } catch (e) {
        setProgress((prev) =>
          prev.map((p, idx) =>
            idx === i ? { ...p, status: "error", msg: e.message } : p
          )
        );
      }
    }

    setImporting(false);
  };

  const abort = () => (stopRef.current = true);

  return { rows, progress, summary, loadFile, importAll, abort, importing };
}