// Single source of truth for backend URLs. Override via .env (see .env.example).
const trimSlash = (url) => url.trim().replace(/\/+$/, "");

export const API_BASE = trimSlash(
  import.meta.env.VITE_API_BASE || "https://dhunobeats.com/api"
);

// Uploaded images (hotel photos, city banners) are served from here.
export const ASSET_BASE =
  trimSlash(import.meta.env.VITE_ASSET_BASE || "https://stay9jahotels.com") + "/";
