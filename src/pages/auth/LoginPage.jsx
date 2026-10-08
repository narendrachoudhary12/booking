import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiLock, FiMail } from "react-icons/fi";
import popup from "../../components/common/Popup/popupService";
import { API_BASE } from "../../config/api";
import { dashboardPath, isLoggedIn, setSession } from "../../utils/auth";
import {
  Divider,
  GoogleButton,
  PasswordField,
  TextField,
} from "../../components/auth/AuthFields";
import AuthLayout from "./AuthLayout";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Page that sent the user here (set by ProtectedRoute), kept across /signup
  const from = location.state?.from;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/hotel-login`, {
        email,
        password,
      });

      if (response.data.status === true) {
        setSession(response.data);

        // Back to the page that sent them here, else their dashboard
        const userType = response.data.user?.type;
        const target =
          from && (userType === "admin" || !from.startsWith("/admin"))
            ? from
            : dashboardPath(userType);
        navigate(target, { replace: true });
        return;
      }

      popup.error(response.data.message);
    } catch (error) {
      popup.error(error.response?.data?.message || "Network Error");
    }

    setLoading(false);
  };

  if (isLoggedIn() && !loading) {
    return <Navigate to={dashboardPath()} replace />;
  }

  return (
    <AuthLayout
      metaTitle="Sign in"
      title="Welcome back"
      subtitle="Sign in to manage your bookings and check out faster."
      footer={
        <>
          Don’t have an account?{" "}
          <Link to="/signup" state={{ from }}>
            Sign up
          </Link>
        </>
      }
    >
      <GoogleButton label="Sign in with Google" />
      <Divider>or sign in with email</Divider>

      <form className="auth-form" onSubmit={handleSubmit}>
        <TextField
          label="Email address"
          icon={FiMail}
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <PasswordField
          label="Password"
          icon={FiLock}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          action={
            <Link to="/forgot-password" state={{ email }} className="auth-link-sm">
              Forgot password?
            </Link>
          }
        />

        <button className="auth-submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
}
