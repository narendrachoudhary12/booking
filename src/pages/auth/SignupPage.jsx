import { useId, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FiLock, FiMail, FiUser } from "react-icons/fi";
import popup from "../../components/common/Popup/popupService";
import { apiError, register } from "../../services/authApi";
import { dashboardPath, isLoggedIn } from "../../utils/auth";
import {
  Divider,
  GoogleButton,
  PasswordField,
  TextField,
} from "../../components/auth/AuthFields";
import AuthLayout from "./AuthLayout";

const COUNTRY_CODES = [
  { name: "Nigeria", code: "+234" },
  { name: "India", code: "+91" },
  { name: "USA", code: "+1" },
  { name: "UK", code: "+44" },
];

const EMPTY_FORM = {
  name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
  confirm_password: "",
};

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const phoneId = useId();

  const [form, setForm] = useState(EMPTY_FORM);
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0].code);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from;
  const mismatch =
    form.confirm_password !== "" && form.password !== form.confirm_password;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirm_password) {
      popup.warning("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Phone goes without the country code, digits only (what the API expects)
      const data = await register({
        name: form.name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        phone: form.phone.replace(/\D/g, ""),
        password: form.password,
        confirm_password: form.confirm_password,
      });

      if (data.status) {
        await popup.success("Account created. Please sign in.");
        navigate("/login", { state: { email: form.email, from } });
        return;
      }

      popup.error(data.message);
    } catch (error) {
      popup.error(apiError(error, "Something went wrong"));
    }

    setLoading(false);
  };

  if (isLoggedIn()) {
    return <Navigate to={dashboardPath()} replace />;
  }

  return (
    <AuthLayout
      metaTitle="Create account"
      title="Create your account"
      subtitle="Join Stay9ja Hotels to book stays and track your trips."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" state={{ from }}>
            Sign in
          </Link>
        </>
      }
    >
      <GoogleButton mode="signup" />
      <Divider>or sign up with email</Divider>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-row">
          <TextField
            label="First name"
            icon={FiUser}
            name="name"
            placeholder="First name"
            autoComplete="given-name"
            required
            value={form.name}
            onChange={handleChange}
          />
          <TextField
            label="Last name"
            icon={FiUser}
            name="last_name"
            placeholder="Last name"
            autoComplete="family-name"
            required
            value={form.last_name}
            onChange={handleChange}
          />
        </div>

        <TextField
          label="Email address"
          icon={FiMail}
          type="email"
          name="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          value={form.email}
          onChange={handleChange}
        />

        <div className="auth-field">
          <div className="auth-label-row">
            <label htmlFor={phoneId}>Phone number</label>
          </div>
          <div className="auth-phone">
            <select
              className="auth-input auth-code"
              aria-label="Country code"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
            >
              {COUNTRY_CODES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
            <input
              id={phoneId}
              className="auth-input"
              type="tel"
              name="phone"
              placeholder="Phone number"
              autoComplete="tel-national"
              required
              value={form.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <PasswordField
          label="Password"
          icon={FiLock}
          name="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          minLength={8}
          required
          value={form.password}
          onChange={handleChange}
        />

        <PasswordField
          label="Confirm password"
          icon={FiLock}
          name="confirm_password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          required
          value={form.confirm_password}
          onChange={handleChange}
        />
        {mismatch && <p className="auth-error">Passwords do not match</p>}

        <label className="auth-check">
          <input
            type="checkbox"
            required
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span>
            I agree to the{" "}
            <Link to="/Stay9jaHotelsTermsOfService">Terms of Service</Link> and{" "}
            <Link to="/Stay9jaHotelsPrivacyCookiePolicy">Privacy Policy</Link>
          </span>
        </label>

        <button className="auth-submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}
