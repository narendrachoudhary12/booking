import axios from "axios";
import { API_BASE } from "../config/api";
import { authHeader } from "../utils/auth";

// Profile update and hotel reviews (Laravel UserProfileController and
// UserReviewController). Everything except getHotelReviews needs the login token.
const config = () => ({
  headers: { ...authHeader(), Accept: "application/json" },
});

// fields: { name, last_name, phone, image?: File, remove_image?: boolean }
// Sent as a multipart form because of the photo. Resolves with the saved user.
export const updateProfile = (fields) => {
  const form = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    form.append(key, typeof value === "boolean" ? (value ? "1" : "0") : value);
  });

  return axios
    .post(`${API_BASE}/my/profile`, form, config())
    .then((res) => res.data.data);
};

export const changePassword = (fields) =>
  axios
    .post(`${API_BASE}/my/change-password`, fields, config())
    .then((res) => res.data);

// Resolves with { summary: { average, count, breakdown }, data: [reviews] }
export const getHotelReviews = (hotelId) =>
  axios.get(`${API_BASE}/hotels/${hotelId}/reviews`).then((res) => res.data);

// Resolves with { reviews: [...], to_review: [stays without a review yet] }
export const getMyReviews = () =>
  axios.get(`${API_BASE}/my/reviews`, config()).then((res) => res.data.data);

// fields: { booking_ref, rating, title, comment }
export const createReview = (fields) =>
  axios.post(`${API_BASE}/my/reviews`, fields, config()).then((res) => res.data);

export const updateReview = (id, fields) =>
  axios
    .put(`${API_BASE}/my/reviews/${id}`, fields, config())
    .then((res) => res.data);

export const deleteReview = (id) =>
  axios.delete(`${API_BASE}/my/reviews/${id}`, config()).then((res) => res.data);
