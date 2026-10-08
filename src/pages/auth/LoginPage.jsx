import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FiLock, FiMail } from "react-icons/fi";
import popup from "../../components/common/Popup/popupService";
import { apiError, login } from "../../services/authApi";
import {
  dashboardPath,
  isLoggedIn,
  postLoginPath,
  setSession,
} from "../../utils/auth";
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
      const data = await login(email, password);

      if (data.status === true) {
        setSession(data);
        navigate(postLoginPath(data.user?.type, from), { replace: true });
        return;
      }

      popup.error(data.message);
    } catch (error) {
      popup.error(apiError(error));
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
      <GoogleButton mode="signin" />
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
