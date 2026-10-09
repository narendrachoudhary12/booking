import { Link } from "react-router-dom";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import PageMeta from "../../components/common/PageMeta";
import "./Auth.css";

const PERKS = [
  "Best-rate hotels across Nigeria",
  "Secure payments and instant confirmation",
  "Manage every booking from one account",
];

const OWNER_PERKS = [
  "Reach guests searching for hotels across Nigeria",
  "Manage rooms, rates and availability in one place",
  "Track every booking from your partner dashboard",
];

// Shared shell for the sign in, sign up and forgot password pages:
// brand panel on the left, the page's form card on the right.
// owner: the hotel partner version of the brand panel.
export default function AuthLayout({
  metaTitle,
  title,
  subtitle,
  children,
  footer,
  owner = false,
}) {
  const perks = owner ? OWNER_PERKS : PERKS;

  return (
    <>
      <PageMeta
        title={`${metaTitle} | Stay9ja Hotels`}
        description="Sign in or create your Stay9ja Hotels account to book hotels."
      />

      <div className="auth-page">
        <aside className="auth-brand">
          <Link to="/" className="auth-wordmark">
            Stay9ja <span>{owner ? "Partners" : "Hotels"}</span>
          </Link>

          <div className="auth-brand-body">
            <h2 className="auth-brand-title">
              {owner ? (
                <>
                  Grow your hotel <em>with Stay9ja.</em>
                </>
              ) : (
                <>
                  Your next stay, <em>booked in minutes.</em>
                </>
              )}
            </h2>
            <ul className="auth-perks">
              {perks.map((perk) => (
                <li key={perk}>
                  <FiCheck aria-hidden="true" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          <p className="auth-brand-foot">
            © {new Date().getFullYear()} Stay9ja Hotels
          </p>
        </aside>

        <main className="auth-main">
          <Link to="/" className="auth-back">
            <FiArrowLeft aria-hidden="true" /> Back to home
          </Link>

          <div className="auth-card">
            <Link to="/" className="auth-wordmark auth-wordmark--mobile">
              Stay9ja <span>Hotels</span>
            </Link>

            <h1 className="auth-title">{title}</h1>
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}

            {children}

            {footer && <p className="auth-footer">{footer}</p>}
          </div>
        </main>
      </div>
    </>
  );
}
