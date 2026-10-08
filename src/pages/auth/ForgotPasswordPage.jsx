import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiLock, FiMail } from "react-icons/fi";
import popup from "../../components/common/Popup/popupService";
import {
  apiError,
  forgotPassword,
  resetPassword,
} from "../../services/authApi";
import { PasswordField, TextField } from "../../components/auth/AuthFields";
import AuthLayout from "./AuthLayout";

// Two steps: 1) ask for the email, the API mails a 6-digit code;
// 2) enter that code with a new password.
export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState("email"); // "email" | "reset"
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const mismatch = confirmPassword !== "" && password !== confirmPassword;

  const backToLogin = (
    <>
      Remembered it? <Link to="/login">Back to sign in</Link>
    </>
  );

  const sendCode = async () => {
    setLoading(true);

    try {
      const data = await forgotPassword(email.trim());

      if (data.status === true) {
        setOtp("");
        setStep("reset");
      } else {
        popup.error(data.message);
      }
    } catch (error) {
      popup.error(apiError(error));
    }

    setLoading(false);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    sendCode();
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      popup.warning("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const data = await resetPassword({
        email: email.trim(),
        otp,
        password,
        confirm_password: confirmPassword,
      });

      if (data.status === true) {
        await popup.success("Password changed. Please sign in.");
        navigate("/login", { state: { email: email.trim() } });
        return;
      }

      popup.error(data.message);
    } catch (error) {
      popup.error(apiError(error));
    }

    setLoading(false);
  };

  if (step === "reset") {
    return (
      <AuthLayout
        metaTitle="Reset password"
        title="Reset your password"
        subtitle={`If an account exists for ${email.trim()}, we’ve emailed it a 6-digit code. It expires in 10 minutes.`}
        footer={backToLogin}
      >
        <form className="auth-form" onSubmit={handleResetSubmit}>
          <TextField
            label="Reset code"
            className="auth-input auth-code-input"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            pattern="[0-9]{6}"
            maxLength={6}
            title="Enter the 6-digit code from your email"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          />

          <PasswordField
            label="New password"
            icon={FiLock}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <PasswordField
            label="Confirm new password"
            icon={FiLock}
            placeholder="Re-enter your new password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {mismatch && <p className="auth-error">Passwords do not match</p>}

          <button className="auth-submit" disabled={loading}>
            {loading ? "Please wait..." : "Change password"}
          </button>

          <p className="auth-hint">
            Didn’t get the code?{" "}
            <button
              type="button"
              className="auth-text-btn"
              disabled={loading}
              onClick={sendCode}
            >
              Resend
            </button>{" "}
            or{" "}
            <button
              type="button"
              className="auth-text-btn"
              disabled={loading}
              onClick={() => setStep("email")}
            >
              use a different email
            </button>
          </p>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      metaTitle="Forgot password"
      title="Forgot your password?"
      subtitle="Enter the email you signed up with and we’ll send you a code to reset it."
      footer={backToLogin}
    >
      <form className="auth-form" onSubmit={handleEmailSubmit}>
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

        <button className="auth-submit" disabled={loading}>
          {loading ? "Sending..." : "Send reset code"}
        </button>
      </form>
    </AuthLayout>
  );
}
