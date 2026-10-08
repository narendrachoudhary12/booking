import axios from "axios";
import { API_BASE } from "../config/api";

// Calls for the website auth endpoints (Laravel UserAuthController).
// Each resolves with the API's JSON body: { status, message, ... }.
const post = (path, body) =>
  axios.post(`${API_BASE}/auth/${path}`, body).then((res) => res.data);

export const login = (email, password) => post("login", { email, password });

export const register = (fields) => post("register", fields);

// credential = the ID token Google hands the browser after sign-in
export const googleLogin = (credential) => post("google", { credential });

export const forgotPassword = (email) => post("forgot-password", { email });

export const resetPassword = (fields) => post("reset-password", fields);

// Message to show when a call fails
export const apiError = (error, fallback = "Network Error") =>
  error.response?.data?.message || fallback;
