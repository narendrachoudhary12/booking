import axios from "axios";
import { API_BASE } from "../config/api";

// Calls for the website auth endpoints (Laravel UserAuthController).
// Each resolves with the API's JSON body: { status, message, ... }.
const post = (path, body) =>
  axios.post(`${API_BASE}/auth/${path}`, body).then((res) => res.data);

export const login = (email, password) => post("login", { email, password });

export const register = (fields) => post("register", fields);

// Hotel owner sign-up: same fields plus business_name
export const registerOwner = (fields) => post("owner/register", fields);

// credential = the ID token Google hands the browser after sign-in
export const googleLogin = (credential) => post("google", { credential });

export const forgotPassword = (email) => post("forgot-password", { email });

export const resetPassword = (fields) => post("reset-password", fields);

// The "unlock hotel deals" form. source: the page the form is on.
export const subscribeNewsletter = (email, source) =>
  axios
    .post(`${API_BASE}/newsletter/subscribe`, { email, source })
    .then((res) => res.data);

// Message to show when a call fails
export const apiError = (error, fallback = "Network Error") =>
  error.response?.data?.message || fallback;
