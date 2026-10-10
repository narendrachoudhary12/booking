import { useState } from "react";
import { useLocation } from "react-router-dom";
import { apiError, subscribeNewsletter } from "../../services/authApi";
import "./UnlockDeals.css";

// Email sign-up for hotel deals, shown above the footer. The email is saved
// by the API; admins see the list under "Deal Subscribers".
const UnlockDeals = () => {
  const { pathname } = useLocation();

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  // { ok: boolean, text: string } shown under the form
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setResult(null);

    try {
      const res = await subscribeNewsletter(email.trim(), pathname);
      setResult({ ok: true, text: res.message });
      setEmail("");
    } catch (error) {
      setResult({
        ok: false,
        text: apiError(error, "Could not sign you up. Please try again."),
      });
    }

    setSending(false);
  };

  return (
    <section className="ud-container">
      <div className="ud-wrapper">

        {/* Left Content */}
        <div className="ud-left">
          <div className="ud-icon">🔒</div>

          <div>
            <h3>Enter your email address to unlock hotel deals</h3>
            <p>Sign up to start receiving exclusive offers</p>
          </div>
        </div>

        {/* Right Form */}
        <div className="ud-right">
          <form className="ud-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email address"
              aria-label="Email address"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit" disabled={sending}>
              {sending ? "Please wait..." : "Unlock"}
            </button>
          </form>

          {result && (
            <span
              className={`ud-message${result.ok ? "" : " ud-message--error"}`}
              role="status"
            >
              {result.text}
            </span>
          )}
        </div>

      </div>
    </section>
  );
};

export default UnlockDeals;
