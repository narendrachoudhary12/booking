import axios from "axios";
import { API_BASE } from "../config/api";
import { authHeader } from "../utils/auth";

// Hotel partner dashboard (Laravel HostController) and the admin side of
// hotel ownership (AdminOwnerController). All calls need the login token.
const config = (params) => ({
  headers: { ...authHeader(), Accept: "application/json" },
  params,
});

const get = (path, params) =>
  axios.get(`${API_BASE}${path}`, config(params)).then((res) => res.data.data);

const send = (method, path, body) =>
  axios[method](`${API_BASE}${path}`, body, config()).then((res) => res.data);

// Message to show when a call fails
export const apiError = (error) =>
  error.response?.data?.message || "Something went wrong. Please try again.";

// ── Partner ──

// Resolves with { hotels: [my hotels], requests: [my hotel requests] }
export const getHostHotels = () => get("/host/hotels");

// Multipart form with the photos under "images[]"
const photoForm = (files, fields = {}) => {
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => form.append(key, value));
  files.forEach((file) => form.append("images[]", file));
  return form;
};

// fields: { name, address, city_id, description, phone, website, price_start_from, property_types }
// photos: File[] (optional) sent with the request
export const requestHotel = (fields, photos = []) =>
  send("post", "/host/hotel-requests", photoForm(photos, fields));

// Hotel photos. Each call resolves with the full list:
// [{ id, url, is_primary, legacy }]
export const getHotelPhotos = (hotelId) => get(`/host/hotels/${hotelId}/photos`);

export const uploadHotelPhotos = (hotelId, files) =>
  send("post", `/host/hotels/${hotelId}/photos`, photoForm(files)).then(
    (res) => res.data
  );

export const setPrimaryHotelPhoto = (hotelId, photoId) =>
  send("post", `/host/hotels/${hotelId}/photos/${photoId}/primary`).then(
    (res) => res.data
  );

// Older ("legacy") photos share one record, so their path is sent too
export const deleteHotelPhoto = (hotelId, photo) =>
  axios
    .delete(
      `${API_BASE}/host/hotels/${hotelId}/photos/${photo.id}`,
      config(photo.legacy ? { path: photo.url } : undefined)
    )
    .then((res) => res.data.data);

// Resolves with { hotel, stats, rooms, recent_bookings }
export const getHostDashboard = (hotelId) =>
  get(`/host/hotels/${hotelId}/dashboard`);

// status: "confirmed" | "completed" | "pending" | "cancelled" | undefined (all)
export const getHostBookings = (hotelId, status) =>
  get(`/host/hotels/${hotelId}/bookings`, status ? { status } : undefined);

// ── Admin ──

export const getOwners = () => get("/admin/owners");

export const searchOwnerHotels = (search) => get("/admin/owner-hotels", { search });

// ownerId null removes the owner from the hotel
export const assignHotelOwner = (hotelId, ownerId) =>
  send("put", `/admin/hotels/${hotelId}/owner`, { owner_id: ownerId });

export const getHotelRequests = (status) =>
  get("/admin/hotel-requests", status ? { status } : undefined);

export const approveHotelRequest = (id) =>
  send("post", `/admin/hotel-requests/${id}/approve`);

export const rejectHotelRequest = (id, note) =>
  send("post", `/admin/hotel-requests/${id}/reject`, { note });
