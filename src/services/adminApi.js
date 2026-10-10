import axios from "axios";
import { API_BASE } from "../config/api";
import { authHeader } from "../utils/auth";

// Admin panel numbers, bookings, money and settings (Laravel
// AdminDashboardController). All calls need an admin's login token.
const config = (params) => ({
  headers: { ...authHeader(), Accept: "application/json" },
  params,
});

const get = (path, params) =>
  axios.get(`${API_BASE}/admin/${path}`, config(params)).then((res) => res.data.data);

const send = (method, path, body) =>
  axios[method](`${API_BASE}/admin/${path}`, body, config()).then((res) => res.data);

// Message to show when a call fails
export const apiError = (error) =>
  error.response?.data?.message || "Something went wrong. Please try again.";

// Resolves with { stats, counts, months, top_hotels, gateways, finance,
// recent_bookings, activity }
export const getOverview = () => get("overview");

// Things waiting for an admin: { pending_bookings, refunds, hotel_requests,
// payouts_due, channels }
export const getCounts = () => get("counts");

// [{ type, color, text, time }], newest first
export const getActivity = () => get("activity");

// Resolves with { months, by_status, top_cities, totals }
export const getAnalytics = () => get("analytics");

// filters: { status, payment, refund, search, from, to } (all optional)
export const getBookings = (filters = {}) =>
  get(
    "booking-list",
    Object.fromEntries(Object.entries(filters).filter(([, value]) => value))
  );

// fields: { amount, pay_method, payment_reference }
export const confirmBookingPayment = (ref, fields) =>
  send("post", `booking-list/${ref}/confirm-payment`, fields);

export const cancelBooking = (ref, reason) =>
  send("post", `booking-list/${ref}/cancel`, { reason });

// fields: { amount, reference }
export const refundBooking = (ref, fields) =>
  send("post", `booking-list/${ref}/refund`, fields);

export const getFinance = () => get("finance");

// Resolves with { due: [per hotel], history: [payouts] }
export const getPayouts = () => get("payouts");

// fields: { hotel_id, reference, note }
export const createPayout = (fields) => send("post", "payouts", fields);

export const getSettings = () => get("settings");

export const saveSettings = (fields) =>
  send("put", "settings", fields).then((res) => res.data);

export const getChannels = () => get("channels");

// status: "pending" | "active" | "disabled"
export const setChannelStatus = (hotelId, status) =>
  send("put", `channels/${hotelId}`, { status });

// Emails from the "unlock hotel deals" form: [{ id, email, source, created_at, user_name }]
export const getSubscribers = (search) =>
  get("subscribers", search ? { search } : undefined);

export const deleteSubscriber = (id) =>
  axios.delete(`${API_BASE}/admin/subscribers/${id}`, config()).then((res) => res.data);
