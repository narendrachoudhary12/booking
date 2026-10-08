import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import { TextField } from "../../components/auth/AuthFields";
import AuthLayout from "./AuthLayout";

export default function ForgotPasswordPage() {
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [sent, setSent] = useState(false);

  const backToLogin = (
    <>
      Remembered it? <Link to="/login">Back to sign in</Link>
    </>
  );

  // UI only for now: no reset-password API exists yet, so no email is sent.
  // TODO: call the reset endpoint here, then setSent(true) on success.
  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <AuthLayout
        metaTitle="Check your email"
        title="Check your email"
        subtitle="If an account exists for this address, a password reset link is on its way."
        footer={backToLogin}
      >
        <div className="auth-sent">
          <span className="auth-sent-icon">
            <FiMail aria-hidden="true" />
          </span>
          <p className="auth-sent-email">{email}</p>
          <p className="auth-sent-hint">
            Didn’t get it? Check your spam folder, or try another address.
          </p>
          <button
            type="button"
            className="auth-submit auth-submit--ghost"
            onClick={() => setSent(false)}
          >
            Use a different email
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      metaTitle="Forgot password"
      title="Forgot your password?"
      subtitle="Enter the email you signed up with and we’ll send you a link to reset it."
      footer={backToLogin}
    >
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

        <button className="auth-submit">Send reset link</button>
      </form>
    </AuthLayout>
  );
}
