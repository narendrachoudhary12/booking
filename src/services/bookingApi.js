import axios from "axios";
import { API_BASE } from "../config/api";
import { authHeader } from "../utils/auth";

// Calls for the logged-in user's own data (Laravel UserBookingController).
// All of them need the login token.
const config = () => ({
  headers: { ...authHeader(), Accept: "application/json" },
});

export const getProfile = () =>
  axios.get(`${API_BASE}/my/profile`, config()).then((res) => res.data.data);

export const getMyBookings = () =>
  axios.get(`${API_BASE}/my/bookings`, config()).then((res) => res.data.data);

export const getBooking = (ref) =>
  axios
    .get(`${API_BASE}/my/bookings/${ref}`, config())
    .then((res) => res.data.data);

// Saves the booking as "pending". Resolves with { booking_ref, amount, currency }
// where amount is the price worked out by the server.
export const createBooking = (body) =>
  axios
    .post(`${API_BASE}/my/bookings`, body, config())
    .then((res) => res.data.data);

// Asks the server to check the Flutterwave payment and confirm the booking
export const verifyPayment = (ref, transactionId) =>
  axios
    .post(
      `${API_BASE}/my/bookings/${ref}/verify-payment`,
      { transaction_id: transactionId },
      config()
    )
    .then((res) => res.data);

// Cancellation / refund state of my bookings, keyed by booking ref:
// { [ref]: { cancellable, cancelled_at, cancel_reason, refund_status, refund_amount } }
export const getBookingStatus = () =>
  axios.get(`${API_BASE}/my/booking-status`, config()).then((res) => res.data.data);

export const cancelBooking = (ref, reason) =>
  axios
    .post(`${API_BASE}/my/bookings/${ref}/cancel`, { reason }, config())
    .then((res) => res.data);

// Public: { support_email, support_phone, free_cancellation_hours }
export const getPlatformInfo = () =>
  axios.get(`${API_BASE}/platform/info`).then((res) => res.data.data);
